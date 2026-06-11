FROM php:8.5-apache

# Apache Modules
RUN a2enmod rewrite headers

# PHP Extensions
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Copy Application
COPY . /var/www/html

# Permissions
RUN chown -R www-data:www-data /var/www/html

# Apache Config
RUN sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' \
    /etc/apache2/apache2.conf

EXPOSE 80