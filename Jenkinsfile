pipeline {
    agent { label 'usla-jknd-p003' }

    stages {
        stage('init') {
            steps {
                script { imageTag = ''}
            }
        }
        stage('build') {
            steps {
                script {
                    tagTime = sh(returnStdout: true, script: 'echo $(date +%Y%m%d)').trim()
                    imageTag = "${tagTime}.${BUILD_NUMBER}"
                }
                sh 'yarn'
                sh 'yarn prebuild'
                sh 'yarn build:prod'
                sh 'yarn test'
            }
        }
        stage('docker image') {
            steps {
                sh "docker build -t nexus.vubiquity.com:8445/portal:${imageTag} ."
                sh "docker push nexus.vubiquity.com:8445/portal:${imageTag}"
            }
        }
        stage('kubernetes') {
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
            steps {
                if(PROMOTE_QA){
                    echo "Triggering promote-qa--portal"
                    build job: 'promote-qa--portal'
                }
                mail to: 'petrosde@amdocs.com;antonia.nikolaou@amdocs.com', subject: "Build ${currentBuild.fullDisplayName} SUCCEEDED", body: "Please go to ${env.BUILD_URL}/consoleText for more details."
            }
        }
        failure {
            mail to: 'petrosde@amdocs.com;antonia.nikolaou@amdocs.com', subject: "Build ${currentBuild.fullDisplayName} FAILED", body: "Please go to ${env.BUILD_URL}/consoleText for more details."
        }
    }  // Post
}
