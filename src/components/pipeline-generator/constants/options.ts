import {
  IconBrandNodejs,
  IconBrandPython,
  IconBrandJavascript,
  IconBrandGolang,
  IconBrandRust,
  IconCode,
  IconBrandGithub,
  IconBrandGitlab,
  IconServer,
  IconRefresh,
  IconCloud,
  IconCloudOff,
  IconBrandAws,
  IconBrandDocker as IconKubernetes,
  IconBrandVercel,
  IconWorld,
  IconWorldWww,
  IconBrandAzure,
  IconBrandGoogle,
  IconRocket,
  IconSettings,
  IconTerminal,
} from "@tabler/icons-react";

export const projectTypes = [
  { value: "nodejs", label: "Node.js", icon: IconBrandNodejs },
  { value: "python", label: "Python", icon: IconBrandPython },
  { value: "java", label: "Java", icon: IconBrandJavascript },
  { value: "go", label: "Go", icon: IconBrandGolang },
  { value: "rust", label: "Rust", icon: IconBrandRust },
  { value: "dotnet", label: ".NET", icon: IconCode },
] as const;

export const ciProviders = [
  { value: "github-actions", label: "GitHub Actions", icon: IconBrandGithub },
  { value: "gitlab-ci", label: "GitLab CI", icon: IconBrandGitlab },
  { value: "jenkins", label: "Jenkins", icon: IconServer },
  { value: "circleci", label: "CircleCI", icon: IconRefresh },
  { value: "azure-pipelines", label: "Azure Pipelines", icon: IconCloud },
] as const;

export const deployTargets = [
  { value: "none", label: "No Deployment", icon: IconCloudOff },
  { value: "aws", label: "AWS (ECS)", icon: IconBrandAws },
  { value: "kubernetes", label: "Kubernetes", icon: IconKubernetes },
  { value: "vercel", label: "Vercel", icon: IconBrandVercel },
  { value: "netlify", label: "Netlify", icon: IconWorld },
  { value: "heroku", label: "Heroku", icon: IconWorldWww },
  { value: "azure", label: "Azure App Service", icon: IconBrandAzure },
  { value: "gcp", label: "Google Cloud Platform", icon: IconBrandGoogle },
  { value: "fly-io", label: "Fly.io", icon: IconCloud },
  { value: "railway", label: "Railway", icon: IconRocket },
  { value: "cloudflare-pages", label: "Cloudflare Pages", icon: IconCloud },
  { value: "digitalocean", label: "DigitalOcean", icon: IconServer },
] as const;

export const steps = [
  { id: "project", title: "Project Details", icon: IconSettings },
  { id: "provider", title: "CI/CD Provider", icon: IconBrandGithub },
  { id: "pipeline", title: "Pipeline Steps", icon: IconTerminal },
  { id: "deployment", title: "Deployment", icon: IconCloud },
  { id: "advanced", title: "Advanced Features", icon: IconSettings },
] as const;
