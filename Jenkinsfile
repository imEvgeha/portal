pipeline {
    agent { label 'usla-jknd-p004' }

    stages {
        stage('Init') {
            steps {
                script { imageTag = ''}
            }
        }

        stage('Build') {
            steps {
                script {
                    tagTime = sh(returnStdout: true, script: 'echo $(date +%Y%m%d)').trim()
                    imageTag = "${tagTime}.${BUILD_NUMBER}"
                }
                sh 'rm -Rf node_modules'
                sh 'rm -Rf packages/ui/lib'
                sh 'rm -Rf packages/utils/lib'
                sh 'yarn'
                sh 'yarn prebuild'
                sh 'yarn build:prod'
            }
        }

        stage('Test') {
            steps {
                sh 'yarn test'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t nexus.vubiquity.com:8445/portal:${imageTag} ."
                sh "docker push nexus.vubiquity.com:8445/portal:${imageTag}"
            }
        }
        stage('Kubernetes Deployment') {
            steps {
                dir('kubernetes') {
                    git url: 'git@github-us.production.tvn.com:Nexus/kubernetes.git'
                    script {
                        imageTag = imageTag ?: sh(returnStdout: true, script: "./image-versions.sh dev nexus-avails portal").trim()
                    }
                }
                dir('kubernetes/nexus-avails/portal') {
                    sh "./deploy.sh ${params.TARGET_ENVIRONMENT} nexus-avails ${imageTag}"
                }
            }
        }  // kubernetes
    }
    post {
        success {
            successPostActions()
        }
        failure {
            mail to: 'PDemetriou@vubiquity.net,anikolaou@vubiquity.net', subject: "Build ${currentBuild.fullDisplayName} FAILED", body: "Please go to ${env.BUILD_URL}/consoleText for more details."
        }
    }  // Post
}

void successPostActions(){
    if (PROMOTE_QA == "true") {
        echo "Triggering promote-qa--portal"
        build job: 'promote-qa--portal'
    }
    mail to: 'PDemetriou@vubiquity.net,anikolaou@vubiquity.net', subject: "Build ${currentBuild.fullDisplayName} SUCCEEDED", body: "Please go to ${env.BUILD_URL}/consoleText for more details."
}
