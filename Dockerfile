# FROM php:8.5-apache

# # Apache Modules
# RUN a2enmod rewrite headers

# # PHP Extensions
# RUN docker-php-ext-install mysqli pdo pdo_mysql

# # Copy Application
# COPY . /var/www/html

# # Permissions
# RUN chown -R www-data:www-data /var/www/html

# # Apache Config
# RUN sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' \
#     /etc/apache2/apache2.conf

# EXPOSE 80

FROM php:8.3-apache

# Enable Apache mod_rewrite (IMPORTANT for .htaccess)
RUN a2enmod rewrite

# Install PHP extensions needed for MySQL
RUN docker-php-ext-install pdo pdo_mysql

# Copy project files
COPY . /var/www/html/

# Set working directory
WORKDIR /var/www/html

# Fix permissions
RUN chown -R www-data:www-data /var/www/html

# Enable AllowOverride for .htaccess
RUN sed -i 's/AllowOverride None/AllowOverride All/g' /etc/apache2/apache2.conf

# Set Apache document root (optional but recommended)
ENV APACHE_DOCUMENT_ROOT /var/www/html

EXPOSE 80