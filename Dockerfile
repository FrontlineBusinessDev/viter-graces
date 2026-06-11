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

# Empty root .htaccess
COPY apache/root.htaccess /var/www/html/.htaccess

# SPA .htaccess inside /portal/
COPY apache/.htaccess /var/www/html/portal/.htaccess

COPY rest/ /var/www/html/rest/

RUN docker-php-ext-install pdo pdo_mysql mysqli \
 && chown -R www-data:www-data /var/www/html

EXPOSE 8080
CMD ["apache2-foreground"]