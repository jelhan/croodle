FROM php:7.2

COPY . /croodle/api

WORKDIR /root

RUN curl -sS https://getcomposer.org/installer -o composer-setup.php && \
    php composer-setup.php --install-dir=/usr/local/bin --filename=composer

RUN apt update && \
    apt install -y libzip-dev zip && \
    docker-php-ext-install zip

WORKDIR /croodle

RUN cd /croodle/api && \
    composer install

RUN mkdir /croodle/data

CMD php -S 0.0.0.0:8080
