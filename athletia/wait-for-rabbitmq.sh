#!/bin/sh
# wait-for-rabbitmq.sh
# Espera hasta que RabbitMQ acepte conexiones AMQP

RABBIT_HOST=${RABBITMQ_HOST:-rabbitmq}
RABBIT_PORT=${RABBITMQ_PORT:-5672}

echo "Esperando a que RabbitMQ esté disponible en $RABBIT_HOST:$RABBIT_PORT..."

# Reintentos hasta que el puerto 5672 esté disponible
while ! nc -z $RABBIT_HOST $RABBIT_PORT; do
  echo "RabbitMQ no disponible todavía. Esperando 2s..."
  sleep 2
done

echo "RabbitMQ listo! Continuando con la aplicación..."
exec "$@"
