pipeline {
     agent { label 'usla-jknd-p002' }
     stages {
         stage('build') {
             steps {
               script {
                 tagTime = sh(returnStdout: true, script: '$(date +%Y%m%d)').trim()
               }
               sh 'yarn'
               sh 'yarn build:prod'
             }
         }
         stage('docker build') {
             steps {
               sh "docker build -t nexus.vubiquity.com:8445/portal:${tagTime} ."
             }
         }
         stage('docker push') {
             steps {
               sh "docker push nexus.vubiquity.com:8445/portal:${tagTime}"
             }
         }
     }
 }
