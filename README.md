# Nginx Deployment using GitHub Actions

This project demonstrates how to automatically deploy website files from GitHub to an AWS EC2 server running Nginx.

## 🚀 Project Flow

```text
Developer
   ↓
Git Push
   ↓
GitHub Repository
   ↓
GitHub Actions
   ↓
SCP over SSH
   ↓
AWS EC2
   ↓
/var/www/html
   ↓
Nginx
   ↓
Website
```

## 🛠️ Technologies Used

* Git
* GitHub
* GitHub Actions
* AWS EC2
* SSH
* SCP
* Nginx
* Linux

## 📁 GitHub Actions Workflow

The workflow is triggered whenever code is pushed to the repository.

```yaml
name: nginx-deploy

on:
  push:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Copy files via SSH
        uses: appleboy/scp-action@v1
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.KEY }}
          source: "."
          target: "/var/www/html"
```

## 🔐 GitHub Secrets

The SSH connection information is stored securely using GitHub Secrets.

| Secret     | Purpose               |
| ---------- | --------------------- |
| `HOST`     | EC2 public IP address |
| `USERNAME` | EC2 login username    |
| `KEY`      | SSH private key       |

Sensitive information such as the private SSH key should **not** be written directly inside the workflow file.

## ⚙️ How It Works

### 1. Push code to GitHub

```bash
git add .
git commit -m "update website"
git push
```

### 2. GitHub Actions starts

The workflow runs automatically after the push.

### 3. Checkout repository

```yaml
uses: actions/checkout@v4
```

This downloads the repository files to the GitHub Actions runner.

### 4. Copy files to EC2

```yaml
uses: appleboy/scp-action@v1
```

The SCP action securely copies the repository files to:

```text
/var/www/html
```

### 5. Nginx serves the files

Nginx uses `/var/www/html` as the web directory, so the updated files can be accessed through the EC2 server's public IP.

## 🎯 What I Learned

* How GitHub Actions workflows work
* How to trigger a workflow using `push`
* How to use `actions/checkout`
* How to deploy files from GitHub to EC2
* How SCP works with SSH
* How to use GitHub Secrets
* How Nginx serves website files
* Basic Continuous Deployment (CD)

## 🔄 Continuous Deployment

Whenever I push new changes:

```text
git push
   ↓
GitHub Actions
   ↓
SCP
   ↓
EC2
   ↓
Nginx
   ↓
Updated Website
```

This means the deployment process is automated instead of manually copying files to the EC2 server.
