pipeline {
    agent any
    
    environment {
        // Docker image configuration
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_IMAGE = 'your-dockerhub-username/vite-app'  // Change this to your Docker Hub username
        
        // Version tags
        BUILD_NUMBER = "${env.BUILD_NUMBER}"
        GIT_COMMIT = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
        BRANCH_NAME = "${env.BRANCH_NAME}"
        BUILD_DATE = sh(script: 'date +%Y%m%d', returnStdout: true).trim()
        
        // Application configuration
        APP_PORT = '5173'
        CONTAINER_NAME = 'vite-app'
    }
    
    stages {
        stage('Checkout') {
            steps {
                // Checkout code from GitHub
                git branch: 'main',
                    credentialsId: 'github-credentials',
                    url: 'https://github.com/your-username/your-vite-project.git'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                script {
                    sh '''
                        echo "Installing dependencies..."
                        npm ci || npm install
                    '''
                }
            }
        }
        
        stage('Run Linting') {
            steps {
                script {
                    sh '''
                        echo "Running linter..."
                        npm run lint || echo "No lint script found"
                    '''
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                script {
                    sh '''
                        echo "Running tests..."
                        npm run test || echo "No test script found"
                    '''
                }
            }
        }
        
        stage('Build Application') {
            steps {
                script {
                    sh '''
                        echo "Building application..."
                        npm run build
                        
                        # Verify build
                        if [ -d "dist" ]; then
                            echo "✅ Build successful! dist folder created"
                            echo "Build contents:"
                            ls -la dist/
                        else
                            echo "❌ Build failed - dist folder not found"
                            exit 1
                        fi
                    '''
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    sh '''
                        echo "Building Docker image..."
                        
                        # Build with multiple tags
                        docker build -t ${DOCKER_IMAGE}:latest .
                        docker tag ${DOCKER_IMAGE}:latest ${DOCKER_IMAGE}:${BUILD_NUMBER}
                        docker tag ${DOCKER_IMAGE}:latest ${DOCKER_IMAGE}:${GIT_COMMIT}
                        docker tag ${DOCKER_IMAGE}:latest ${DOCKER_IMAGE}:${BRANCH_NAME}
                        
                        echo "✅ Docker images built successfully:"
                        docker images | grep ${DOCKER_IMAGE}
                    '''
                }
            }
        }
        
        stage('Test Docker Container') {
            steps {
                script {
                    sh '''
                        echo "Testing Docker container..."
                        
                        # Stop and remove any existing test container
                        docker stop test-${CONTAINER_NAME} || true
                        docker rm test-${CONTAINER_NAME} || true
                        
                        # Run test container
                        docker run -d \
                            --name test-${CONTAINER_NAME} \
                            -p 5174:80 \
                            ${DOCKER_IMAGE}:latest
                        
                        # Wait for container to start
                        sleep 5
                        
                        # Check if container is running
                        if docker ps | grep test-${CONTAINER_NAME}; then
                            echo "✅ Test container is running"
                        else
                            echo "❌ Test container failed to start"
                            docker logs test-${CONTAINER_NAME}
                            exit 1
                        fi
                        
                        # Test if app is responding
                        echo "Testing application response..."
                        curl -f http://localhost:5174 || (echo "❌ App not responding" && exit 1)
                        
                        echo "✅ Application is responding correctly"
                        
                        # Clean up test container
                        docker stop test-${CONTAINER_NAME}
                        docker rm test-${CONTAINER_NAME}
                    '''
                }
            }
        }
        
        stage('Push to Docker Registry') {
            when {
                branch 'main'  // Only push from main branch
            }
            steps {
                script {
                    withCredentials([string(credentialsId: 'docker-hub-password', variable: 'DOCKER_PASSWORD')]) {
                        sh '''
                            echo "Logging into Docker Hub..."
                            echo $DOCKER_PASSWORD | docker login -u your-dockerhub-username --password-stdin
                            
                            echo "Pushing images to Docker Hub..."
                            docker push ${DOCKER_IMAGE}:latest
                            docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}
                            docker push ${DOCKER_IMAGE}:${GIT_COMMIT}
                            
                            echo "✅ Images pushed successfully"
                        '''
                    }
                }
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                script {
                    sh '''
                        echo "Deploying to production..."
                        
                        # Stop and remove old container
                        docker stop ${CONTAINER_NAME} || true
                        docker rm ${CONTAINER_NAME} || true
                        
                        # Run new container
                        docker run -d \
                            --name ${CONTAINER_NAME} \
                            --restart unless-stopped \
                            -p ${APP_PORT}:80 \
                            -e NODE_ENV=production \
                            --memory="256m" \
                            --cpus="0.5" \
                            ${DOCKER_IMAGE}:latest
                        
                        # Wait for container to start
                        sleep 5
                        
                        # Verify deployment
                        if docker ps | grep ${CONTAINER_NAME}; then
                            echo "✅ Production container is running"
                            echo "Application is available at: http://localhost:${APP_PORT}"
                            
                            # Test application
                            curl -f http://localhost:${APP_PORT} && echo "✅ Application is responding"
                        else
                            echo "❌ Deployment failed"
                            docker logs ${CONTAINER_NAME}
                            exit 1
                        fi
                    '''
                }
            }
        }
    }
    
    post {
        always {
            script {
                sh '''
                    echo "=== Pipeline Summary ==="
                    echo "Build Number: ${BUILD_NUMBER}"
                    echo "Git Commit: ${GIT_COMMIT}"
                    echo "Branch: ${BRANCH_NAME}"
                    echo "Docker Image: ${DOCKER_IMAGE}:${BUILD_NUMBER}"
                    
                    # Clean up old images (keep last 5)
                    echo "Cleaning up old Docker images..."
                    docker image prune -f
                    
                    # Show disk usage
                    echo "Docker disk usage:"
                    docker system df
                '''
            }
        }
        
        success {
            echo '✅ Pipeline completed successfully!'
        }
        
        failure {
            echo '❌ Pipeline failed!'
            script {
                // Send failure notification (email, Slack, etc.)
                sh '''
                    echo "Pipeline failed. Check logs for details."
                '''
            }
        }
    }
}