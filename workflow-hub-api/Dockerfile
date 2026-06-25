FROM php:8.3-apache

WORKDIR /var/www/html

ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        git \
        libicu-dev \
        libpq-dev \
        libzip-dev \
        unzip \
        zip \
    && docker-php-ext-install \
        intl \
        pdo_pgsql \
        zip \
    && rm -f /etc/apache2/mods-enabled/mpm_event.conf \
             /etc/apache2/mods-enabled/mpm_event.load \
             /etc/apache2/mods-enabled/mpm_worker.conf \
             /etc/apache2/mods-enabled/mpm_worker.load \
             /etc/apache2/mods-enabled/mpm_threaded.conf \
             /etc/apache2/mods-enabled/mpm_threaded.load \
    && sed -i 's/^LoadModule mpm_event/# LoadModule mpm_event/' /etc/apache2/mods-available/mpm_event.load \
    && sed -i 's/^LoadModule mpm_worker/# LoadModule mpm_worker/' /etc/apache2/mods-available/mpm_worker.load \
    && ln -sf /etc/apache2/mods-available/mpm_prefork.conf /etc/apache2/mods-enabled/mpm_prefork.conf \
    && ln -sf /etc/apache2/mods-available/mpm_prefork.load /etc/apache2/mods-enabled/mpm_prefork.load \
    && a2enmod rewrite \
    && sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
    && sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
COPY . .

RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader \
    && chown -R www-data:www-data storage bootstrap/cache

CMD ["apache2-foreground"]
