pipeline {
     agent { label 'usla-jknd-p002' }
     stages {
         stage('build') {
             steps {
               sh 'yarn'
               sh 'yarn build:prod'
             }
         }
         stage('docker build') {
             steps {
               sh 'docker build -t nexus.vubiquity.com:8445/portal:1.1 .'
             }
         }
         stage('docker push') {
             steps {
               sh 'docker push nexus.vubiquity.com:8445/portal:1.1'
             }
         }
     }
 }
