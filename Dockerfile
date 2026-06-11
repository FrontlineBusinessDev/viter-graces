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

# FROM php:8.3-apache

# # Enable Apache mod_rewrite (IMPORTANT for .htaccess)
# RUN a2enmod rewrite

# # Install PHP extensions needed for MySQL
# RUN docker-php-ext-install pdo pdo_mysql

# # Copy project files
# COPY . /var/www/html/

# # Set working directory
# WORKDIR /var/www/html

# # Fix permissions
# RUN chown -R www-data:www-data /var/www/html

# # Enable AllowOverride for .htaccess
# RUN sed -i 's/AllowOverride None/AllowOverride All/g' /etc/apache2/apache2.conf

# # Set Apache document root (optional but recommended)
# ENV APACHE_DOCUMENT_ROOT /var/www/html

# EXPOSE 80

# # ---------- Frontend build ----------
# FROM node:20-alpine AS frontend
# WORKDIR /app

# COPY package*.json ./
# RUN npm ci

# COPY . .
# RUN npm run build

# # ---------- Apache + PHP runtime ----------
# FROM php:8.3-apache

# # Enable rewrite module for .htaccess
# RUN a2enmod rewrite headers

# # Make Apache listen on 8080 for App Platform
# RUN sed -ri 's/Listen 80/Listen 8080/' /etc/apache2/ports.conf \
#  && sed -ri 's/:80>/:8080>/' /etc/apache2/sites-available/000-default.conf

# # Copy your built UI
# COPY --from=frontend /app/dist/ /var/www/html/

# # Copy PHP API
# COPY rest/ /var/www/html/rest/

# # Copy Apache config
# COPY apache/000-default.conf /etc/apache2/sites-available/000-default.conf
# COPY apache/.htaccess /var/www/html/.htaccess

# EXPOSE 8080

# RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# CMD ["apache2-foreground"]

FROM node:20-alpine AS frontend
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM php:8.3-apache

RUN a2enmod rewrite headers \
 && sed -ri 's/Listen 80/Listen 8080/' /etc/apache2/ports.conf

COPY apache/000-default.conf /etc/apache2/sites-available/000-default.conf

RUN mkdir -p /var/www/html/portal

COPY --from=frontend /app/dist/ /var/www/html/portal/
COPY apache/.htaccess /var/www/html/portal/.htaccess

COPY rest/ /var/www/html/rest/

RUN docker-php-ext-install pdo pdo_mysql mysqli \
 && chown -R www-data:www-data /var/www/html

EXPOSE 8080

CMD ["apache2-foreground"]