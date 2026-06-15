<?php

require_once('../../vendor/autoload.php');
require_once('env.php');

use Aws\S3\S3Client;
use Aws\Exception\AwsException;

/**
 * DigitalOcean Spaces Storage Service
 *
 * Wrapper around the AWS S3 SDK for interacting with
 * DigitalOcean Spaces.
 *
 * Features:
 * - Upload files
 * - Delete files
 * - Check file existence
 * - Generate temporary URLs
 * - List stored objects
 *
 * Example:
 *
 * $storage = new SpacesStorage();
 *
 * $url = $storage->upload(
 *     '/tmp/avatar.jpg',
 *     'avatars/user-123.jpg'
 * );
 */
class SpacesStorage
{
    /**
     * S3-compatible client instance.
     */
    private S3Client $client;

    /**
     * Active bucket name.
     */
    private string $bucket;

    /**
     * Absolute path to the public folder.
     * Example: /project/public
     */
    private string $publicPath;

    /**
     * Max upload size in bytes (default: 10MB)
     */
    private int $maxFileSize;

    /**
     * Initialize Spaces client.
     *
     * Reads credentials and configuration from
     * env.php and sets up the S3 client for DigitialOcean Spaces.
     *
     * @throws \RuntimeException
     */
    public function __construct()
    {

        /**
         * resolves to the file's immediate folder:
         * and then goes up to three levels to reach the public folder
         */
        $rootPath = dirname(__DIR__, 3);
        $this->publicPath = $rootPath . '/public/';
        $this->maxFileSize = 10 * 1024 * 1024; // 10MB default
        $this->bucket = WEB_APP_AMAZON_SPACE_STORAGE_BUCKET;
        $region = WEB_APP_AMAZON_SPACE_STORAGE_REGION;

        $this->client = new S3Client([
            'version' => 'latest',
            'region' => $region,
            'endpoint' => "https://{$region}.digitaloceanspaces.com",
            'credentials' => [
                'key' => WEB_APP_AMAZON_SPACE_STORAGE_KEY,
                'secret' => WEB_APP_AMAZON_SPACE_STORAGE_SECRET,
            ],
        ]);
    }

    /**
     * Upload a file to DigitalOcean Spaces.
     *
     * Example:
     *
     * $url = $storage->upload(
     *     '/tmp/image.jpg',
     *     'avatars/user.jpg'
     * );
     *
     * @param string $fileName
     * Name of the file to upload.
     * This will lookup to the public folder if file exist.
     *
     * @param string $destination
     * Target object key in Spaces.
     *
     * @param bool $public
     * Whether the uploaded file should be public.
     *
     * @return string|null
     * Public object URL on success, null on failure.
     */
    public function upload(
        string $fileName,
        string $destination,
        bool $public = true
    ): ?string {
        $fullPath = $this->publicPath . $fileName;
        try {
            // Check if file exists locally
            if (!file_exists($fullPath)) {
                returnError("File not found: {$fullPath}");
                return null;
            }
            // File size validation
            $fileSize = filesize($fullPath);
            if ($fileSize === false) {
                returnError("Unable to read file size.");
                return null;
            }
            // IF FILE IS MORE THAN MAX FILE SIZE
            if ($fileSize > $this->maxFileSize) {
                returnError(
                    "File too large. Max allowed is " .
                        ($this->maxFileSize / 1024 / 1024) . "MB"
                );
                return null;
            }

            $result = $this->client->putObject([
                'Bucket' => $this->bucket,
                'Key' => $destination,
                'SourceFile' => $fullPath,
                'ACL' => $public ? 'public-read' : 'private',
            ]);
            return $result['ObjectURL'];
        } catch (AwsException $e) {
            // upload failed → delete local file
            if (file_exists($fullPath)) unlink($fullPath);
            returnError($e->getMessage());
            return null;
        }
    }

    /**
     * Delete an object from Spaces.
     *
     * Example:
     *
     * $storage->delete('avatars/user.jpg');
     *
     * @param string $path
     * Object key to delete.
     *
     * @return bool
     * True if deleted successfully.
     */
    public function delete(string $path): bool
    {
        try {
            $this->client->deleteObject([
                'Bucket' => $this->bucket,
                'Key' => $path,
            ]);

            return true;
        } catch (AwsException $e) {
            returnError($e->getMessage());
            return false;
        }
    }

    /**
     * Determine whether an object exists.
     *
     * Example:
     *
     * if ($storage->exists('avatars/user.jpg')) {
     *     // file found
     * }
     *
     * @param string $path
     * Object key.
     *
     * @return bool
     */
    public function exists(string $path): bool
    {
        try {
            $this->client->headObject([
                'Bucket' => $this->bucket,
                'Key' => $path,
            ]);
            return true;
        } catch (AwsException) {
            return false;
        }
    }

    /**
     * Generate a temporary signed URL.
     *
     * Useful for private documents,
     * invoices, contracts, etc.
     *
     * Example:
     *
     * $url = $storage->temporaryUrl(
     *     'contracts/contract.pdf',
     *     60
     * );
     *
     * @param string $path
     * Object key.
     *
     * @param int $minutes
     * URL validity period.
     *
     * @return string
     */
    public function temporaryUrl(
        string $path,
        int $minutes = 30
    ): string {
        $command = $this->client->getCommand('GetObject', [
            'Bucket' => $this->bucket,
            'Key' => $path,
        ]);

        $request = $this->client->createPresignedRequest(
            $command,
            "+{$minutes} minutes"
        );
        return (string) $request->getUri();
    }

    /**
     * List objects in a folder/prefix.
     *
     * Example:
     *
     * $files = $storage->list('avatars/');
     *
     * @param string $prefix
     * Optional folder prefix.
     *
     * @return array
     */
    public function list(string $prefix = ''): array
    {
        $result = $this->client->listObjectsV2([
            'Bucket' => $this->bucket,
            'Prefix' => $prefix,
        ]);
        return $result['Contents'] ?? [];
    }

    /**
     * Upload multiple files to DigitalOcean Spaces.
     *
     * This method accepts:
     * - array of filenames
     * - JSON string of filenames
     *
     * It returns:
     * - JSON string on success
     * - array with success=false on failure
     *
     * Stored data format:
     * [
     *   [
     *     "name" => "1700000000-avatar.jpg",
     *     "key" => "Gallery/1700000000-avatar.jpg",
     *     "url" => "https://....",
     *     "datetime" => "2026-06-08 19:00:00"
     *   ]
     * ]
     *
     * @param array|string $photoArray
     * @param array|string $oldFiles
     * @param string $folderName
     * @param bool $public
     * @return array|string
     */
    public function multipleUpload(
        array|string $photoArray,
        array|string $oldFiles = '',
        string $folderName = '',
        bool $public = true
    ): array|string {
        try {
            // Normalize uploaded filenames
            if (is_string($photoArray)) {
                $decoded = json_decode($photoArray, true);
                $photoArray = is_array($decoded) ? $decoded : [$photoArray];
            }

            $photoArray = array_values(array_filter($photoArray, fn($value) => $value !== null && $value !== ''));

            // Normalize old file data
            if (is_string($oldFiles)) {
                $decodedOld = json_decode($oldFiles, true);
                $oldFiles = is_array($decodedOld) ? $decodedOld : [];
            }

            $oldFiles = is_array($oldFiles) ? array_values($oldFiles) : [];

            // If nothing to upload, return old data as-is
            if (count($photoArray) === 0) {
                return json_encode($oldFiles);
            }

            // Build folder prefix
            $folderPrefix = trim($folderName, '/');
            $folderPrefix = $folderPrefix !== '' ? $folderPrefix . '/' : '';

            $resultArray = [];

            foreach ($photoArray as $index => $fileName) {
                $fileName = is_string($fileName) ? $fileName : '';
                if ($fileName === '') {
                    continue;
                }

                $destination = $folderPrefix . $fileName;

                // Upload local file from public folder
                $uploadUrl = $this->upload($fileName, $destination, $public);

                if ($uploadUrl === null) {
                    return [
                        'success' => false,
                        'error' => "Failed to upload file: {$fileName}",
                    ];
                }

                // Preserve existing metadata if available
                $existingData = $oldFiles[$index] ?? [];
                $existingData = is_array($existingData) ? $existingData : (array) $existingData;

                $existingData['name'] = $fileName;
                $existingData['key'] = $destination;
                $existingData['url'] = $uploadUrl;
                $existingData['datetime'] = date('Y-m-d H:i:s');

                $resultArray[] = $existingData;
            }

            return json_encode($resultArray);
        } catch (\Throwable $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Delete multiple files from DigitalOcean Spaces and remove them
     * from the stored JSON array.
     *
     * This method accepts:
     * - JSON string of stored file records
     * - array of stored file records
     *
     * The pending delete items can contain:
     * - key
     * - path
     * - name
     *
     * Example stored item:
     * [
     *   "name" => "1700000000-avatar.jpg",
     *   "key" => "Gallery/1700000000-avatar.jpg",
     *   "url" => "...",
     *   "datetime" => "..."
     * ]
     *
     * @param array|string $files
     * @param array $pendingDeleteFile
     * @return array|string
     */
    public function multipleDelete(
        array|string $files,
        array $pendingDeleteFile = []
    ): array|string {
        try {
            // Normalize current stored files
            if (is_string($files)) {
                $decoded = json_decode($files, true);
                $files = is_array($decoded) ? $decoded : [];
            }

            $storeData = is_array($files) ? array_values($files) : [];
            if (count($pendingDeleteFile) === 0) {
                return json_encode($storeData);
            }

            $deleteKeys = [];

            foreach ($pendingDeleteFile as $item) {
                $decodedItem = is_string($item) ? json_decode($item, true) : $item;
                $decodedItem = is_array($decodedItem) ? $decodedItem : (array) $decodedItem;

                $key = $decodedItem['key']
                    ?? $decodedItem['path']
                    ?? $decodedItem['name']
                    ?? '';

                if ($key === '') {
                    continue;
                }

                $deleteKeys[] = $key;

                // Delete from Spaces
                $this->delete($key);
            }

            // Remove deleted items from local data array
            $filteredData = array_values(array_filter($storeData, function ($item) use ($deleteKeys) {
                $item = is_array($item) ? $item : (array) $item;

                $itemKey = $item['key']
                    ?? $item['path']
                    ?? $item['name']
                    ?? '';

                return !in_array($itemKey, $deleteKeys, true);
            }));

            return json_encode($filteredData);
        } catch (\Throwable $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }
}

// // Example usage in your controller
// always import the SpaceStorage object like in google drive
// LIKE THIS:
//  require_once('/../../SpaceStorage.php');
//  $valStorage = new SpaceStorage();

// THEN USE THIS CODE BELOW AS EXAMPLE

//// Create
// $val->gallery_photo = checkToUploadSpaces($data['gallery_photo'], '', 'Gallery');

//// Update
// $val->gallery_photo = checkToUploadSpaces(
//     $val->gallery_photo,
//     $gallery_photo_old,
//     'Gallery'
// );
// $val->gallery_photo = checkDeleteSpacesFiles(
//     $val->gallery_photo,
//     $pendingDeleteFile
// );

//// Delete
// $val->letters_files = checkDeleteSpacesFiles(
//     $val->letters_files,
//     $pendingDeleteFile
// );

// Important

// Your upload() method already uploads from:

// $this->publicPath . $fileName

// So the filename in $data['gallery_photo'] should be just the actual file name saved in your public folder, such as:

// 1700000000-photo.jpg

// If your files are inside a subfolder in public, tell me the exact path and I’ll adjust the class so it reads from that folder too.