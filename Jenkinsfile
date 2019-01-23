pipeline {
     agent { label 'usla-jknd-p002' }
     stages {
         stage('build') {
             steps {
               script {
                 tagTime = sh(returnStdout: true, script: 'echo $(date +%Y%m%d)').trim()
                 imageTag = "${tagTime}.${BUILD_NUMBER}"
               }
               sh 'yarn'
               sh 'yarn build:prod'
             }
         }
         stage('docker build') {
             steps {
               sh "docker build -t nexus.vubiquity.com:8445/portal:${imageTag} ."
             }
         }
         stage('docker push') {
             steps {
               sh "docker push nexus.vubiquity.com:8445/portal:${imageTag}"
             }
         }
         stage('kubernetes') {
           steps {
             dir('kubernetes') {
               git url: 'git@github-us.production.tvn.com:Nexus/kubernetes.git'
             }
             dir('kubernetes/nexus-avails/portal') {
               sh "./deploy.sh dev nexus-avails ${imageTag}"
             }
           }
         }
     }

     post {
       success {
         mail to: 'sjalali@vubiquity.com', subject: "Jenkins Build ${currentBuild.fullDisplayName} SUCCEEDED", body: "${JOB_NAME} from ${JOB_BASE_NAME}"
       }
       failure {
         mail to: 'sjalali@vubiquity.com', subject: "Jenkins Build ${currentBuild.fullDisplayName} FAILED", body: "${JOB_NAME} from ${JOB_BASE_NAME}"
       }
     }  // Post
 }
