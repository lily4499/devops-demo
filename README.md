
---

```markdown
# DevOps Beginner Project – Node.js CI/CD with Jenkins, Docker, and Kubernetes

This project demonstrates how to build, containerize, push, and deploy a simple Node.js web application using a complete DevOps pipeline. It integrates GitHub for source control, Jenkins for automation, Docker for containerization, and Kubernetes (via Minikube) for orchestration.

---

---

### ✅ Step 1: Create a Basic Node.js App

📁 **Directory Structure**:
```
devops-demo/
│
├── app.js
├── Dockerfile
├── package.json
├── index.html
├── about.html
└── Jenkinsfile
```

📄 **app.js**
```js
const express = require('express');
const app = express();
const path = require('path');

app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname+'/index.html'));  
});

app.get('/about', (req,res) => {
    res.sendFile(path.join(__dirname+'/about.html'));  
  });

app.listen(3000, () => {
    console.log('Listening on port 3000');
});

```

📄 **package.json**
```json
{
  "name": "devops-demo",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "express": "^5.1.0"
  }
}
```

📄 **Dockerfile**
```Dockerfile
# Base Image
FROM node:lts-alpine3.17

# Set the working Directory
WORKDIR /app

# Copy Package.json
COPY package*.json ./

# Install Dependencies
RUN npm install

# Copy source code to the container work directory
COPY . .

# Expose Port
EXPOSE 3000

# Entry for CMD 
CMD [ "node", "app.js" ]
```

📄 **index.html**
```html
<!DOCTYPE html>
<html>
<head>
  <title>DevOps Demo App</title>
</head>
<body>
  <h1>Hello from DevOps Demo!</h1>
</body>
</html>
```

---

### 💻 Step 2: Git & GitHub Setup

🖥️ **CLI Commands**:
```bash
git init
git remote add origin https://github.com/YOUR_USERNAME/devops-demo.git
git add .
git commit -m "Initial commit"
git push -u origin main
```

---

### ⚙️ Step 3: Run Jenkins in Docker

🖥️ **CLI**:
```bash
docker run -d --name jenkins-devops \
  -p 9090:8080 \
  -v jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts
```

🔑 Access Jenkins at: [http://localhost:9090](http://localhost:9090)

---

### 📝 Step 4: Create Jenkinsfile

📄 **Jenkinsfile**
```groovy
pipeline {
    agent any

    environment {
        IMAGE_NAME = "laly9999/devops-demo:${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/YOUR_USERNAME/devops-demo.git'
            }
        }

        stage('Build Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Push to DockerHub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh 'docker push $IMAGE_NAME'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl set image deployment/devops-demo devops-demo=$IMAGE_NAME || kubectl create deployment devops-demo --image=$IMAGE_NAME'
                sh 'kubectl expose deployment devops-demo --type=LoadBalancer --port=80 --target-port=3000 || echo "Service exists"'
            }
        }
    }
}
```

---

### ☸️ Step 5: Start Minikube

🖥️ **CLI**:
```bash
minikube start
```

---

### 🔗 Step 6: Connect Docker with Minikube

```bash
eval $(minikube docker-env)
```

---

### 📦 Step 7: Test Locally (Optional)

```bash
docker build -t devops-demo:latest .
docker run -d -p 3000:3000 devops-demo:latest
```

Then open: `http://localhost:3000`

---

### ☁️ Step 8: Deploy Manually to Kubernetes (if not via Jenkins)

```bash
kubectl create deployment devops-demo --image=laly9999/devops-demo:1
kubectl expose deployment devops-demo --type=LoadBalancer --port=80 --target-port=3000
minikube service devops-demo
```

---

### 📌 Step 9: View in Browser

```bash
minikube service devops-demo
```

This will open your deployed app in the browser using a LoadBalancer URL (like `http://192.168.49.2:30001`).

---

## ✅ Done!

You’ve now created a full DevOps CI/CD pipeline that:
- Builds a Node.js app
- Pushes the Docker image to DockerHub
- Deploys it to Kubernetes using Jenkins


---
```

