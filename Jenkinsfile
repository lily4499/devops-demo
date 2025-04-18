pipeline {
    agent any

    environment {
        IMAGE_NAME = "laly9999/devops-demo:${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/lily4499/devops-demo.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Push to DockerHub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh 'docker push $IMAGE_NAME'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl set image deployment/devops-demo devops-demo=$IMAGE_NAME || kubectl create deployment devops-demo --image=$IMAGE_NAME'
                sh 'kubectl expose deployment devops-demo --type=NodePort --port=80 --target-port=3000 || echo "Service exists"'
            }
        }

        stage('Port Forward to Access App') {
            steps {
                script {
                    sh '''
                        echo "Starting port-forward in background..."
                        kubectl port-forward deployment/devops-demo 8080:3000 >/dev/null 2>&1 &
                        echo $! > port_forward_pid.txt
                        sleep 5
                        echo "✅ App is now accessible at: http://localhost:8080"
                    '''
                }
            }
        }
    }

    post {
        always {
            script {
                sh '''
                    if [ -f port_forward_pid.txt ]; then
                        kill $(cat port_forward_pid.txt) || true
                        rm port_forward_pid.txt
                        echo "🛑 Port-forward process stopped."
                    fi
                '''
            }
        }
    }
}


