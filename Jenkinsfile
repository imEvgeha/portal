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
     }
 }
