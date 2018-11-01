pipeline {
    agent { label 'usla-jknd-p002' }
    stages {
        stage('build prod') {
            steps {
                sh 'yarn build prod'
            }
        }
    }
}