# 🚀 **Pipeline Forge**

> Generate production-ready CI/CD pipelines in seconds.

Pipeline Forge is a developer-first tool that helps you create optimized, secure, and scalable CI/CD pipelines for modern applications without writing YAML from scratch.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

---

## ✨ **Features**

* ⚡ **Instant Generation** — Generate CI/CD pipelines in seconds, not hours
* 🧩 **Multi-Stack Support** — Node.js, Python, Java, Go, Rust, and .NET
* 🔄 **Multiple CI Providers**:
  * GitHub Actions ✅
  * GitLab CI ✅
  * Jenkins ✅
  * CircleCI ✅
  * Azure Pipelines ✅
* 🐳 **Built-in Docker Support** — Docker build and push configurations
* ☁️ **Deployment-Ready** — AWS ECS and Kubernetes deployment configs
* 🔐 **Security Best Practices** — Security scanning and audit steps included
* 📄 **Clean YAML Output** — Copy or download your pipeline instantly
* ⚙️ **Environment Variables** — Add custom env vars to your pipelines
* 🔧 **Custom Scripts** — Insert pre-build, pre-test, and post-build commands
* 🔔 **Smart Notifications** — Slack and email notifications for pipeline status
* 🔀 **Matrix Builds** — Test across multiple versions simultaneously with parallel jobs
* 📦 **Artifact Management** — Upload and store build artifacts with configurable retention
* ⏰ **Scheduled Pipelines** — Run pipelines on a schedule with cron expressions

---

## 🖥️ **Demo**

Visit the live site: **[Pipeline Forge](http://localhost:3000)** (when running locally)

---

## 🧠 **How It Works**

1. **Select your project type** (Node.js, Python, Java, Go, Rust, .NET)
2. **Choose your CI/CD provider** (GitHub Actions, GitLab CI, Jenkins, CircleCI, Azure Pipelines)
3. **Configure build, test, and deploy steps** (linting, tests, Docker, deployment)
4. **Add advanced features** (environment variables, custom scripts, notifications)
5. **Generate your pipeline YAML instantly** (copy or download)

---

## 🚀 **Advanced Features**

### Environment Variables ⚙️
Add custom environment variables to your pipeline configuration. Perfect for:
- API keys and secrets (use CI provider's secret management)
- Feature flags
- Configuration values
- Environment-specific settings

### Custom Scripts 🔧
Insert custom commands at specific points in your pipeline:
- **Pre-Build Script**: Runs before build (e.g., code generation)
- **Pre-Test Script**: Runs before tests (e.g., database seeding)
- **Post-Build Script**: Runs after build (e.g., bundle analysis)

### Smart Notifications 🔔
Configure Slack and/or Email notifications for pipeline status updates:
- **Slack**: Via webhook URL integration
- **Email**: Via CI provider's email notification system
- Get alerts on build success/failure

### Matrix Builds 🔀
Test your application across multiple versions simultaneously:
- **Parallel Testing**: Run tests on multiple Node.js, Python, or Java versions
- **Version Matrix**: Specify versions like 18, 20, 22 for comprehensive testing
- **Faster Feedback**: Catch version-specific issues early

### Artifact Management 📦
Upload and store build artifacts with full control:
- **Custom Paths**: Specify which files/folders to upload (dist/, build/, *.zip)
- **Retention Policy**: Configure how long artifacts are stored (default: 30 days)
- **Download Artifacts**: Access build outputs from previous runs

### Scheduled Pipelines ⏰
Run pipelines automatically on a schedule:
- **Cron Expressions**: Use standard cron syntax (e.g., `0 2 * * *` for daily at 2 AM)
- **Timezone Support**: Configure timezone for accurate scheduling
- **Automated Testing**: Run nightly builds, weekly security scans, etc.

---

## 🏗️ **Tech Stack**

### Frontend
* **Next.js 16** — React framework with App Router
* **Tailwind CSS v4** — Utility-first CSS framework
* **shadcn/ui** — Beautiful, accessible component library (radix-luma preset)
* **Tabler Icons** — Modern icon library

### Backend
* **TypeScript** — Type-safe pipeline generation logic
* **YAML Generation Engine** — Supports multiple CI providers and languages

---

## ⚙️ **Installation**

### Prerequisites
* Node.js 18+ and npm

### Clone the repository

```bash
git clone https://github.com/NotHarshhaa/pipeline-forge.git
cd pipeline-forge
```

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

### Build for production

```bash
npm run build
npm start
```

---

## 🧪 **Example Output**

### GitHub Actions (Node.js)

```yaml
name: my-app CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [20]

    steps:
      - uses: actions/checkout@v4

      - name: Cache node_modules
        uses: actions/cache@v4
        with:
          path: ~/.npm
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
```

---

## 🛣️ **Roadmap**

* [x] GitLab CI support
* [x] Jenkins pipeline generation
* [x] CircleCI support
* [x] Azure Pipelines support
* [x] Environment variables configuration
* [x] Custom scripts support
* [x] Notification settings (Slack/Email)
* [ ] Travis CI support
* [ ] Bitbucket Pipelines support
* [ ] Kubernetes deployment templates (advanced)
* [ ] AI-powered pipeline optimization
* [ ] Pipeline visualization (graph view)
* [ ] Cost estimation per pipeline
* [ ] Template customization and export

---

## 🤝 **Contributing**

Contributions are welcome!

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 **License**

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 💡 **Inspiration**

Built to simplify DevOps workflows and eliminate repetitive pipeline setup. Pipeline Forge helps developers focus on building features, not writing YAML.

---

## ⭐ **Support**

If you like this project:
* Give it a **star** ⭐ on GitHub
* Share it with your team
* Contribute to make it better!

---

## 🔗 * *Links**

* **GitHub**: [NotHarshhaa/pipeline-forge](https://github.com/NotHarshhaa/pipeline-forge)
* **Issues**: [Report a bug or request a feature](https://github.com/NotHarshhaa/pipeline-forge/issues)

---

**Made with ❤️ by developers, for developers.**
