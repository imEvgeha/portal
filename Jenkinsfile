pipeline {
    agent { label 'usla-jknd-p002' }
    stages {
        stage('test') {
            steps {
                sh './gradlew test'
            }
        }
        stage('build') {
            steps {
                sh './gradlew build'
            }
        }
        stage('build docker') {
            steps {
                sh './gradlew build docker'
            }
        }
    }
}