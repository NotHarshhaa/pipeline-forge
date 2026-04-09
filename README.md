# 🚀 **Pipeline Forge**

> Generate production-ready CI/CD pipelines in seconds.

Pipeline Forge is a developer-first tool that helps you create optimized, secure, and scalable CI/CD pipelines for modern applications without writing YAML from scratch.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

---

## ✨ **Features**

### Core Features
* ⚡ **Instant Generation** — Generate CI/CD pipelines in seconds, not hours
* 🧩 **Multi-Stack Support** — Node.js, Python, Java, Go, Rust, and .NET
* 🔄 **Multiple CI Providers**:
  * GitHub Actions ✅
  * GitLab CI ✅
  * Jenkins ✅
  * CircleCI ✅
  * Azure Pipelines ✅
* � **Clean YAML Output** — Copy or download your pipeline instantly

### Pipeline Steps
* 🧪 **Unit Tests** — Run automated unit tests with coverage reporting
* 🎭 **E2E Testing** — End-to-end testing with Playwright, Cypress, or Selenium
* 🎨 **Code Formatting** — Prettier, Black, or language-specific formatters
* 📝 **Linting** — ESLint, Pylint, Checkstyle, and more
* 🔍 **Type Checking** — TypeScript, mypy, or language-specific type checkers
* 🏗️ **Build** — Compile and bundle your application
* 💾 **Caching** — Speed up builds with dependency caching
* 🔐 **Security Scan** — Vulnerability scanning with Snyk, Trivy, or OWASP
* 📦 **Dependency Audit** — Check for vulnerable dependencies
* 🐳 **Docker Build** — Build and push Docker images
* 🔒 **Container Scan** — Scan Docker images for vulnerabilities
* 📊 **SonarQube Analysis** — Code quality and security analysis

### Deployment Options
* ☁️ **AWS (ECS)** — Deploy to Amazon ECS with container orchestration
* ⚓ **Kubernetes** — Deploy to any Kubernetes cluster
* ▲ **Vercel** — Deploy to Vercel with automatic preview deployments
* 🌐 **Netlify** — Deploy to Netlify with continuous deployment
* 🟣 **Heroku** — Deploy to Heroku with Git-based deployment
* 🔷 **Azure App Service** — Deploy to Azure with CI/CD integration
* 🌩️ **Google Cloud Platform** — Deploy to GCP with Cloud Run

### Advanced Features
* ⚙️ **Environment Variables** — Add custom env vars to your pipelines
* 🔧 **Custom Scripts** — Insert pre-build, pre-test, and post-build commands
* 🔔 **Smart Notifications** — Slack and email notifications for pipeline status
* 🔀 **Matrix Builds** — Test across multiple versions simultaneously with parallel jobs
* 📦 **Artifact Management** — Upload and store build artifacts with configurable retention
* ⏰ **Scheduled Pipelines** — Run pipelines on a schedule with cron expressions
* 📊 **Code Quality & Coverage** — Set coverage thresholds and quality gates
* 🚀 **Performance Testing** — Load testing and performance benchmarks
* 🗄️ **Database & Services** — Configure PostgreSQL, MySQL, MongoDB, Redis, Elasticsearch

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

## 🚀 **Pipeline Steps Guide**

### Testing & Quality Assurance 🧪

#### Unit Tests
Run automated unit tests with coverage reporting:
- **Framework Support**: Jest, Mocha, Pytest, JUnit, Go test, Cargo test
- **Coverage Reports**: Generate and upload coverage reports
- **Parallel Execution**: Run tests in parallel for faster feedback

#### E2E Testing 🎭
End-to-end testing for complete user workflows:
- **Frameworks**: Playwright, Cypress, Selenium, Puppeteer
- **Browser Testing**: Test across multiple browsers
- **Visual Regression**: Catch UI changes automatically

#### Code Formatting 🎨
Ensure consistent code style across your project:
- **Node.js**: Prettier
- **Python**: Black, autopep8
- **Java**: Google Java Format
- **Go**: gofmt
- **Rust**: rustfmt

#### Type Checking 🔍
Static type checking for type-safe code:
- **TypeScript**: tsc --noEmit
- **Python**: mypy
- **Java**: Built-in compiler checks
- **Go**: Built-in type system

### Security & Compliance 🔐

#### Security Scan
Comprehensive vulnerability scanning:
- **Tools**: Snyk, Trivy, OWASP Dependency-Check
- **SAST**: Static application security testing
- **License Compliance**: Check for license violations

#### Dependency Audit 📦
Check dependencies for known vulnerabilities:
- **npm audit**: Node.js projects
- **pip-audit**: Python projects
- **OWASP**: Java projects
- **cargo audit**: Rust projects

#### Container Scan 🔒
Scan Docker images for security issues:
- **Trivy**: Comprehensive vulnerability scanner
- **Grype**: Fast vulnerability scanner
- **Clair**: Static analysis for containers
- **Snyk Container**: Container security platform

#### SonarQube Analysis 📊
Advanced code quality and security analysis:
- **Code Smells**: Detect maintainability issues
- **Security Hotspots**: Identify security-sensitive code
- **Technical Debt**: Track code quality metrics
- **Quality Gates**: Enforce quality standards

## 🌐 **Deployment Options**

### Cloud Platforms

#### AWS (ECS) ☁️
Deploy to Amazon Elastic Container Service:
- **Container Orchestration**: Automated scaling and management
- **Load Balancing**: Built-in Application Load Balancer
- **Service Discovery**: AWS Cloud Map integration
- **Blue/Green Deployments**: Zero-downtime deployments

#### Kubernetes ⚓
Deploy to any Kubernetes cluster:
- **kubectl apply**: Declarative deployment
- **Helm Charts**: Package management
- **Rolling Updates**: Zero-downtime deployments
- **Auto-scaling**: Horizontal Pod Autoscaler

#### Vercel ▲
Deploy to Vercel platform:
- **Preview Deployments**: Automatic preview URLs for PRs
- **Edge Network**: Global CDN distribution
- **Serverless Functions**: API routes support
- **Framework Support**: Next.js, React, Vue, Angular

#### Netlify 🌐
Deploy to Netlify:
- **Continuous Deployment**: Auto-deploy on git push
- **Split Testing**: A/B testing support
- **Form Handling**: Built-in form processing
- **Edge Functions**: Serverless at the edge

#### Heroku 🟣
Deploy to Heroku platform:
- **Git-based Deployment**: Push to deploy
- **Add-ons**: Database, caching, monitoring
- **Dyno Management**: Easy scaling
- **Review Apps**: Automatic app creation for PRs

#### Azure App Service 🔷
Deploy to Microsoft Azure:
- **CI/CD Integration**: Azure DevOps integration
- **Auto-scaling**: Scale based on demand
- **Deployment Slots**: Staging environments
- **Monitoring**: Application Insights

#### Google Cloud Platform 🌩️
Deploy to GCP:
- **Cloud Run**: Serverless containers
- **Auto-scaling**: Scale to zero
- **Global Load Balancing**: Multi-region deployment
- **Cloud Build**: Native CI/CD integration

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

### Code Quality & Coverage 📊
Enforce code quality standards in your pipeline:
- **Coverage Threshold**: Set minimum code coverage percentage (e.g., 80%)
- **Quality Gate**: Fail builds that don't meet coverage requirements
- **Automated Checks**: Ensure code quality before deployment

### Performance Testing 🚀
Test your application's performance automatically:
- **Load Testing**: Run stress tests to check application limits
- **Performance Benchmarks**: Track performance metrics over time
- **Regression Detection**: Catch performance degradation early

### Database & Services 🗄️
Configure service dependencies for your pipeline:
- **Database Support**: PostgreSQL, MySQL, MongoDB, Redis
- **Migrations**: Automatically run database migrations
- **Service Containers**: Redis cache, Elasticsearch for testing
- **Integration Testing**: Test with real service dependencies

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
