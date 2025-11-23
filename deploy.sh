#!/bin/bash
cd /var/www/sobremesa
git pull
docker-compose --env-file .env.production down
docker-compose --env-file .env.production build
docker-compose --env-file .env.production up -d
echo "✅ Deploy completado!"
docker ps
