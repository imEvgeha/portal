pipeline {
     agent { label 'usla-jknd-p002' }
     stages {
         stage('build') {
           when { expression { GIT_COMMIT != GIT_PREVIOUS_SUCCESSFUL_COMMIT } }
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
            when { expression { GIT_COMMIT != GIT_PREVIOUS_SUCCESSFUL_COMMIT } }
             steps {
               sh "docker build -t nexus.vubiquity.com:8445/portal:${imageTag} ."
             }
         }
         stage('docker push') {
           when { expression { GIT_COMMIT != GIT_PREVIOUS_SUCCESSFUL_COMMIT } }
             steps {
               sh "docker push nexus.vubiquity.com:8445/portal:${imageTag}"
             }
         }
         stage('kubernetes') {
           steps {
             dir('kubernetes') {
               git url: 'git@github-us.production.tvn.com:Nexus/kubernetes.git'
               imageTag = imageTag || sh("./image-versions.sh dev nexus-avails portal").trim()
             }
             dir('kubernetes/nexus-avails/portal') {
               sh "./deploy.sh dev nexus-avails ${imageTag}"
             }
           }
         }  // kubernetes
     }

     post {
       success {
         mail to: 'sjalali@vubiquity.com', subject: "Build ${currentBuild.fullDisplayName} SUCCEEDED", body: "Please go to ${env.BUILD_URL}/consoleText for more details."
       }
       failure {
         mail to: 'sjalali@vubiquity.com', subject: "Build ${currentBuild.fullDisplayName} FAILED", body: "Please go to ${env.BUILD_URL}/consoleText for more details."
       }
     }  // Post
 }
