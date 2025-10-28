#!/bin/sh
RABBIT_HOST=${RABBITMQ_HOST:-rabbitmq}
RABBIT_PORT=${RABBITMQ_PORT:-5672}

echo "Esperando RabbitMQ en $RABBIT_HOST:$RABBIT_PORT..."

while ! nc -z $RABBIT_HOST $RABBIT_PORT; do
  echo "RabbitMQ no disponible todavía. Esperando 2s..."
  sleep 2
done

echo "RabbitMQ listo! Continuando con la aplicación..."
exec "$@"
