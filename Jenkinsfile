pipeline {
    agent any

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        ansiColor('xterm')
        disableConcurrentBuilds()
    }

    parameters {
        choice(name: 'DEPLOY_ENV', choices: ['staging', 'production'], description: 'Môi trường triển khai')
        booleanParam(name: 'RUN_TESTS', defaultValue: true, description: 'Chạy bộ kiểm thử tự động')
        booleanParam(name: 'SECURITY_SCAN', defaultValue: true, description: 'Quét lỗ hổng bảo mật với Trivy')
        booleanParam(name: 'DEPLOY_TO_AWS', defaultValue: true, description: 'Triển khai lên máy chủ AWS sau khi build')
    }

    environment {
        // Cấu hình AWS & Docker Registry
        AWS_REGION        = 'ap-southeast-1'
        AWS_CREDENTIALS_ID= 'aws-ecr-credentials'   // ID của AWS Credentials trong Jenkins Credentials Store
        AWS_ACCOUNT_ID    = credentials('AWS_ACCOUNT_ID') // Secret text chứa AWS Account ID 12 chữ số
        ECR_REGISTRY      = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        
        BACKEND_REPO      = 'norofarm-backend'
        FRONTEND_REPO     = 'norofarm-frontend'
        
        IMAGE_TAG         = "${BUILD_NUMBER}-${GIT_COMMIT.take(7)}"
        
        // Cấu hình Deploy Server EC2
        EC2_HOST          = credentials('EC2_PRODUCTION_IP') // IP máy chủ EC2
        EC2_USER          = 'ubuntu'
        SSH_KEY_ID        = 'ec2-ssh-key' // SSH Username with private key trong Jenkins
        
        DOCKER_BUILDKIT   = '1'
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo "=== Bắt đầu Checkout mã nguồn từ Git ==="
                checkout scm
                script {
                    echo "Branch: ${env.GIT_BRANCH}"
                    echo "Commit: ${env.GIT_COMMIT}"
                    echo "Build Tag: ${IMAGE_TAG}"
                }
            }
        }

        stage('Code Quality & Linting') {
            parallel {
                stage('Lint Backend (Python)') {
                    steps {
                        echo "--- Kiểm tra chất lượng mã nguồn Backend ---"
                        sh '''
                            docker run --rm -v $(pwd)/backend:/app -w /app python:3.13-slim \
                            bash -c "pip install --no-cache-dir ruff && ruff check app/"
                        '''
                    }
                }
                stage('Lint Frontend (Next.js)') {
                    steps {
                        echo "--- Kiểm tra chất lượng mã nguồn Frontend ---"
                        sh '''
                            docker run --rm -v $(pwd)/frontend:/app -w /app node:20-alpine \
                            sh -c "npm ci && npm run lint"
                        '''
                    }
                }
            }
        }

        stage('Automated Tests') {
            when {
                expression { return params.RUN_TESTS == true }
            }
            steps {
                echo "=== Chạy Unit & Integration Tests ==="
                sh '''
                    docker run --rm -v $(pwd)/backend:/app -w /app \
                    -e ENVIRONMENT=test \
                    -e SECRET_KEY=ci-test-secret-key-32-chars-long \
                    python:3.13-slim \
                    bash -c "pip install --no-cache-dir -r requirements.txt && pytest tests/ -v"
                '''
            }
        }

        stage('Docker Build Images') {
            steps {
                echo "=== Đóng gói Docker Images ==="
                script {
                    echo "Building Backend Image: ${ECR_REGISTRY}/${BACKEND_REPO}:${IMAGE_TAG}"
                    sh """
                        docker build \
                            -t ${ECR_REGISTRY}/${BACKEND_REPO}:${IMAGE_TAG} \
                            -t ${ECR_REGISTRY}/${BACKEND_REPO}:latest \
                            ./backend
                    """

                    echo "Building Frontend Image: ${ECR_REGISTRY}/${FRONTEND_REPO}:${IMAGE_TAG}"
                    sh """
                        docker build \
                            --build-arg NEXT_PUBLIC_API_URL=https://api.norofarm.com/api/v1 \
                            -t ${ECR_REGISTRY}/${FRONTEND_REPO}:${IMAGE_TAG} \
                            -t ${ECR_REGISTRY}/${FRONTEND_REPO}:latest \
                            ./frontend
                    """
                }
            }
        }

        stage('Security Vulnerability Scan') {
            when {
                expression { return params.SECURITY_SCAN == true }
            }
            steps {
                echo "=== Quét lỗ hổng Docker Image bằng Trivy ==="
                sh """
                    # Quét lỗ hổng cấp độ HIGH và CRITICAL
                    docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
                    aquasec/trivy:latest image --severity HIGH,CRITICAL --exit-code 0 ${ECR_REGISTRY}/${BACKEND_REPO}:${IMAGE_TAG}

                    docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
                    aquasec/trivy:latest image --severity HIGH,CRITICAL --exit-code 0 ${ECR_REGISTRY}/${FRONTEND_REPO}:${IMAGE_TAG}
                """
            }
        }

        stage('Push Images to AWS ECR') {
            steps {
                echo "=== Đăng nhập AWS ECR và Đẩy Images ==="
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: env.AWS_CREDENTIALS_ID]]) {
                    sh """
                        # Đăng nhập vào AWS ECR Registry
                        aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}

                        # Push Backend
                        docker push ${ECR_REGISTRY}/${BACKEND_REPO}:${IMAGE_TAG}
                        docker push ${ECR_REGISTRY}/${BACKEND_REPO}:latest

                        # Push Frontend
                        docker push ${ECR_REGISTRY}/${FRONTEND_REPO}:${IMAGE_TAG}
                        docker push ${ECR_REGISTRY}/${FRONTEND_REPO}:latest
                    """
                }
            }
        }

        stage('Deploy to AWS Server') {
            when {
                expression { return params.DEPLOY_TO_AWS == true }
            }
            steps {
                echo "=== Triển khai lên máy chủ AWS (${params.DEPLOY_ENV}) ==="
                sshagent([SSH_KEY_ID]) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} << 'EOF'
                            set -e
                            cd /opt/norofarm

                            # Đăng nhập ECR trên máy chủ EC2
                            aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin ${ECR_REGISTRY}

                            # Pull images mới nhất
                            docker pull ${ECR_REGISTRY}/${BACKEND_REPO}:latest
                            docker pull ${ECR_REGISTRY}/${FRONTEND_REPO}:latest

                            # Khởi động lại dịch vụ không gián đoạn
                            docker compose -f docker-compose.prod.yml up -d --remove-orphans

                            # Dọn dẹp images cũ
                            docker image prune -f
                        EOF
                    """
                }
            }
        }

        stage('Healthcheck & Smoke Tests') {
            when {
                expression { return params.DEPLOY_TO_AWS == true }
            }
            steps {
                echo "=== Kiểm tra sức khỏe hệ thống sau khi Deploy ==="
                sh """
                    sleep 10
                    curl -f -m 10 https://api.norofarm.com/api/v1/health || {
                        echo "HEALTHCHECK FAILED: Backend không phản hồi HTTP 200!"
                        exit 1
                    }
                    echo "Hệ thống NoroFarm hoạt động ổn định và sẵn sàng phục vụ!"
                """
            }
        }
    }

    post {
        always {
            cleanWs()
            sh "docker logout ${ECR_REGISTRY} || true"
        }
        success {
            echo "SUCCESS: Pipeline CI/CD hoàn thành thành công cho bản dựng #${BUILD_NUMBER}!"
        }
        failure {
            echo "ERROR: Pipeline CI/CD thất bại tại một trong các công đoạn. Vui lòng kiểm tra console log!"
        }
    }
}
