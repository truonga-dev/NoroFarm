pipeline {
    agent any

    options {
        timeout(time: 45, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        ansiColor('xterm')
        disableConcurrentBuilds()
        skipDefaultCheckout(true)
    }

    parameters {
        choice(name: 'DEPLOY_ENV', choices: ['production', 'staging'], description: 'Target environment')
        booleanParam(name: 'RUN_TESTS', defaultValue: true, description: 'Run automated tests')
        booleanParam(name: 'SECURITY_SCAN', defaultValue: true, description: 'Fail on fixable CRITICAL vulnerabilities')
        booleanParam(name: 'PUSH_TO_ECR', defaultValue: true, description: 'Push built images to Amazon ECR')
        booleanParam(name: 'DEPLOY_TO_AWS', defaultValue: false, description: 'Deploy the pushed images to EC2')
    }

    environment {
        AWS_REGION = 'ap-southeast-1'
        AWS_CREDENTIALS_ID = 'aws-ecr-credentials'
        BACKEND_REPO = 'norofarm-backend'
        FRONTEND_REPO = 'norofarm-frontend'
        SSH_KEY_ID = 'ec2-ssh-key'
        EC2_USER = 'ubuntu'
        DOCKER_BUILDKIT = '0'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.GIT_SHORT_SHA = sh(script: 'git rev-parse --short=7 HEAD', returnStdout: true).trim()
                    env.IMAGE_TAG = "${env.BUILD_NUMBER}-${env.GIT_SHORT_SHA}"
                    env.EC2_HOST_CREDENTIAL_ID = params.DEPLOY_ENV == 'production' ? 'EC2_PRODUCTION_IP' : 'EC2_STAGING_IP'
                    env.PUBLIC_API_URL = params.DEPLOY_ENV == 'production' ? 'https://api.norofarm.com/api/v1' : 'https://staging-api.norofarm.com/api/v1'
                    echo "Commit: ${env.GIT_SHORT_SHA}; image tag: ${env.IMAGE_TAG}; environment: ${params.DEPLOY_ENV}"
                }
            }
        }

        stage('Code Quality') {
            parallel {
                stage('Backend lint') {
                    steps {
                        sh '''
                            docker run --rm -v norofarm_jenkins_home:/var/jenkins_home -w "$WORKSPACE/backend" python:3.13-slim \
                              bash -c "pip install --no-cache-dir ruff && ruff check app/"
                        '''
                    }
                }
                stage('Frontend lint') {
                    steps {
                        sh '''
                            docker run --rm -v norofarm_jenkins_home:/var/jenkins_home -w "$WORKSPACE/frontend" node:20-alpine \
                              sh -c "npm ci && npm run lint"
                        '''
                    }
                }
            }
        }

        stage('Automated Tests') {
            when {
                expression { params.RUN_TESTS }
            }
            steps {
                sh '''
                    docker run --rm -v norofarm_jenkins_home:/var/jenkins_home -w "$WORKSPACE/backend" \
                      -e ENVIRONMENT=test \
                      -e SECRET_KEY=ci-only-secret-key-not-used-outside-tests \
                      python:3.13-slim \
                      bash -c "pip install --no-cache-dir -r requirements.txt && python -m pytest tests/ -v"
                '''
            }
        }

        stage('Build Images') {
            steps {
                script {
                    def awsAccountId = ""
                    def supabaseUrl = ""
                    def supabaseAnonKey = ""

                    try {
                        withCredentials([string(credentialsId: 'AWS_ACCOUNT_ID', variable: 'VAL')]) {
                            awsAccountId = env.VAL
                        }
                    } catch (Exception e) {
                        echo "Info: Credential 'AWS_ACCOUNT_ID' not configured in Jenkins."
                    }

                    try {
                        withCredentials([string(credentialsId: 'NEXT_PUBLIC_SUPABASE_URL', variable: 'VAL')]) {
                            supabaseUrl = env.VAL
                        }
                    } catch (Exception e) {
                        echo "Info: Credential 'NEXT_PUBLIC_SUPABASE_URL' not found in Jenkins, defaulting to empty."
                    }

                    try {
                        withCredentials([string(credentialsId: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', variable: 'VAL')]) {
                            supabaseAnonKey = env.VAL
                        }
                    } catch (Exception e) {
                        echo "Info: Credential 'NEXT_PUBLIC_SUPABASE_ANON_KEY' not found in Jenkins, defaulting to empty."
                    }

                    if (awsAccountId?.trim()) {
                        env.ECR_REGISTRY = "${awsAccountId.trim()}.dkr.ecr.${env.AWS_REGION}.amazonaws.com"
                        env.BACKEND_IMG = "${env.ECR_REGISTRY}/${env.BACKEND_REPO}"
                        env.FRONTEND_IMG = "${env.ECR_REGISTRY}/${env.FRONTEND_REPO}"
                    } else {
                        env.ECR_REGISTRY = ""
                        env.BACKEND_IMG = "${env.BACKEND_REPO}"
                        env.FRONTEND_IMG = "${env.FRONTEND_REPO}"
                    }

                    env.SB_URL = supabaseUrl ?: ""
                    env.SB_KEY = supabaseAnonKey ?: ""

                    sh '''
                        set -e
                        export DOCKER_BUILDKIT=0

                        echo "Building backend: ${BACKEND_IMG}:${IMAGE_TAG}"
                        docker build \
                          -t "${BACKEND_IMG}:${IMAGE_TAG}" \
                          -t "${BACKEND_IMG}:latest" \
                          ./backend

                        echo "Building frontend: ${FRONTEND_IMG}:${IMAGE_TAG}"
                        docker build \
                          --build-arg "NEXT_PUBLIC_API_URL=${PUBLIC_API_URL:-}" \
                          --build-arg "NEXT_PUBLIC_SUPABASE_URL=${SB_URL:-}" \
                          --build-arg "NEXT_PUBLIC_SUPABASE_ANON_KEY=${SB_KEY:-}" \
                          -t "${FRONTEND_IMG}:${IMAGE_TAG}" \
                          -t "${FRONTEND_IMG}:latest" \
                          ./frontend
                    '''
                }
            }
        }

        stage('Security Scan') {
            when {
                expression { params.SECURITY_SCAN }
            }
            steps {
                sh '''
                    set -eu
                    docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
                      aquasec/trivy:latest image --ignore-unfixed --severity CRITICAL --exit-code 1 \
                      "${BACKEND_IMG}:${IMAGE_TAG}"
                    docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
                      aquasec/trivy:latest image --ignore-unfixed --severity CRITICAL --exit-code 1 \
                      "${FRONTEND_IMG}:${IMAGE_TAG}"
                '''
            }
        }

        stage('Push to ECR') {
            when {
                expression { (params.PUSH_TO_ECR || params.DEPLOY_TO_AWS) && env.ECR_REGISTRY != "" }
            }
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: env.AWS_CREDENTIALS_ID]]) {
                    sh '''
                        set -eu
                        aws sts get-caller-identity >/dev/null
                        aws ecr get-login-password --region "${AWS_REGION}" | \
                          docker login --username AWS --password-stdin "${ECR_REGISTRY}"
                        docker push "${ECR_REGISTRY}/${BACKEND_REPO}:${IMAGE_TAG}"
                        docker push "${ECR_REGISTRY}/${BACKEND_REPO}:latest"
                        docker push "${ECR_REGISTRY}/${FRONTEND_REPO}:${IMAGE_TAG}"
                        docker push "${ECR_REGISTRY}/${FRONTEND_REPO}:latest"
                    '''
                }
            }
        }

        stage('Deploy to EC2') {
            when {
                expression { params.DEPLOY_TO_AWS }
            }
            steps {
                script {
                    withCredentials([string(credentialsId: env.EC2_HOST_CREDENTIAL_ID, variable: 'EC2_HOST')]) {
                        sshagent([env.SSH_KEY_ID]) {
                            sh '''
                                set -eu
                                mkdir -p .ci
                                ssh-keyscan -H "${EC2_HOST}" > .ci/known_hosts
                                SSH_OPTS="-o UserKnownHostsFile=$PWD/.ci/known_hosts -o StrictHostKeyChecking=yes"

                                ssh ${SSH_OPTS} "${EC2_USER}@${EC2_HOST}" 'mkdir -p /opt/norofarm/nginx'
                                scp ${SSH_OPTS} docker-compose.prod.yml "${EC2_USER}@${EC2_HOST}:/opt/norofarm/docker-compose.prod.yml"
                                scp ${SSH_OPTS} nginx/nginx.conf "${EC2_USER}@${EC2_HOST}:/opt/norofarm/nginx/nginx.http.conf"
                                scp ${SSH_OPTS} nginx/nginx.ssl.conf "${EC2_USER}@${EC2_HOST}:/opt/norofarm/nginx/nginx.ssl.conf"
                                scp ${SSH_OPTS} scripts/aws/validate-production-env.sh "${EC2_USER}@${EC2_HOST}:/opt/norofarm/validate-production-env.sh"

                                ssh ${SSH_OPTS} "${EC2_USER}@${EC2_HOST}" \
                                  "cd /opt/norofarm && \
                                   test -f nginx/active.conf || cp nginx/nginx.http.conf nginx/active.conf && \
                                   chmod 700 validate-production-env.sh && ./validate-production-env.sh .env.production && \
                                   aws ecr get-login-password --region '${AWS_REGION}' | docker login --username AWS --password-stdin '${ECR_REGISTRY}' && \
                                   ECR_REGISTRY='${ECR_REGISTRY}' IMAGE_TAG='${IMAGE_TAG}' docker compose -f docker-compose.prod.yml pull && \
                                   ECR_REGISTRY='${ECR_REGISTRY}' IMAGE_TAG='${IMAGE_TAG}' docker compose -f docker-compose.prod.yml up -d --remove-orphans && \
                                   docker image prune -f"
                            '''
                        }
                    }
                }
            }
        }

        stage('Smoke Test') {
            when {
                expression { params.DEPLOY_TO_AWS }
            }
            steps {
                script {
                    withCredentials([string(credentialsId: env.EC2_HOST_CREDENTIAL_ID, variable: 'EC2_HOST')]) {
                        sshagent([env.SSH_KEY_ID]) {
                            sh '''
                                set -eu
                                SSH_OPTS="-o UserKnownHostsFile=$PWD/.ci/known_hosts -o StrictHostKeyChecking=yes"
                                ssh ${SSH_OPTS} "${EC2_USER}@${EC2_HOST}" \
                                  'cd /opt/norofarm; for i in 1 2 3 4 5 6; do curl -fsS http://127.0.0.1/api/v1/health && exit 0; sleep 10; done; docker compose -f docker-compose.prod.yml ps; exit 1'
                            '''
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            sh 'if [ -n "${ECR_REGISTRY:-}" ]; then docker logout "${ECR_REGISTRY}" || true; fi'
            cleanWs()
        }
        success {
            echo "Pipeline completed successfully for build #${env.BUILD_NUMBER}."
        }
        failure {
            echo 'Pipeline failed. Review the first failed stage in Console Output.'
        }
    }
}
