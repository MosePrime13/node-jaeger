ssh -tt jenkins@172.16.5.20 << 'ENDSSH'
cd /var/www/application/
docker login https://mjenzi.tospay.net -u tsp_registry -p tsp_registry
docker pull mjenzi.tospay.net/mobile-gateway-service-dev
docker container stop mobile-gateway-service-dev 
docker container rm mobile-gateway-service-dev 
docker run --name mobile-gateway-service-dev -p 3060:3060 -dit --restart unless-stopped mjenzi.tospay.net/mobile-gateway-service-dev
docker container ls -a
exit
ENDSSH