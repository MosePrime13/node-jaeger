pipeline {
    agent any
    stages {
        stage('--clone--') {
            steps {
                // REMOVE PREVIOUS FILE 
                sh "rm -rf mobile-gateway-service"
                // CLONE PROJECT
                sh "git clone --single-branch --branch develop https://moses:YTfSmDazq2eEds-wXXGs@xanda.tospay.net/microservices-node/mobile-gateway-service.git && cd mobile-gateway-service && ls -la"
            }
        }
        stage('--deploy-to-docker-registry--') {
            steps {
                // BUILD PROD IMAGE
                sh "cd mobile-gateway-service && touch .env && echo 'PORT=3060\nNODE_ENV=development\nPROJECT_NAME=mobile' > .env && ls -la && cat .env"
                 // BUILD IMAGE
                sh "cd mobile-gateway-service/docker-compose && docker-compose -f docker-compose-dev.yml build"
                // DEPLOY TO REGISTRY
                sh "docker login https://mjenzi.tospay.net -u tsp_registry -p tsp_registry && docker tag mobile-gateway-service-dev mjenzi.tospay.net/mobile-gateway-service-dev && docker push mjenzi.tospay.net/mobile-gateway-service-dev"
            }
        }
        stage('--deploy-to-server--') {
            steps {
                sh "cd mobile-gateway-service && chmod +x deploy.sh && ./deploy.sh"
            }
        }
    }
}