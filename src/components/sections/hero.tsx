"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconBolt, IconArrowRight } from "@tabler/icons-react";

const examplePipelines = [
  {
    id: "github-actions",
    label: "GitHub Actions",
    filename: ".github/workflows/ci.yml",
    code: `name: CI Pipeline

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - run: npm ci
      - run: npm test
      - run: npm run build`,
  },
  {
    id: "gitlab-ci",
    label: "GitLab CI",
    filename: ".gitlab-ci.yml",
    code: `stages:
  - build
  - test

variables:
  NODE_VERSION: "20"

image: node:20-alpine

build:
  stage: build
  script:
    - npm ci
    - npm run build

test:
  stage: test
  script:
    - npm ci
    - npm test`,
  },
  {
    id: "jenkins",
    label: "Jenkins",
    filename: "Jenkinsfile",
    code: `pipeline {
  agent any

  tools {
    nodejs 'NodeJS 20'
  }

  stages {
    stage('Install') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Test') {
      steps {
        sh 'npm test'
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }
  }
}`,
  },
  {
    id: "circleci",
    label: "CircleCI",
    filename: ".circleci/config.yml",
    code: `version: 2.1

orbs:
  node: circleci/node@5.2

jobs:
  build-and-test:
    docker:
      - image: cimg/node:20.0
    steps:
      - checkout
      - node/install-packages
      - run:
          name: Run tests
          command: npm test
      - run:
          name: Build
          command: npm run build

workflows:
  build-test:
    jobs:
      - build-and-test`,
  },
  {
    id: "azure-pipelines",
    label: "Azure Pipelines",
    filename: "azure-pipelines.yml",
    code: `trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: '20'

  - script: npm ci
    displayName: 'Install dependencies'

  - script: npm test
    displayName: 'Run tests'

  - script: npm run build
    displayName: 'Build'`,
  },
];

export function Hero() {
  const [selectedPipeline, setSelectedPipeline] = useState(0);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20 md:py-32 text-center">
        <Badge variant="secondary" className="mb-4 sm:mb-6 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium">
          Open Source CI/CD Pipeline Generator
        </Badge>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
          Generate Production-Ready
          <br />
          <span className="text-primary">CI/CD Pipelines</span>
          <br />
          in Seconds
        </h1>
        <p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed px-2">
          Pipeline Forge is a developer-first tool that helps you create
          optimized, secure, and scalable CI/CD pipelines for modern
          applications — without writing YAML from scratch.
        </p>
        <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <a href="#generator">
            <Button size="lg" className="gap-2 text-base font-semibold px-8">
              <IconBolt className="h-5 w-5" />
              Start Building
            </Button>
          </a>
          <a href="#how-it-works">
            <Button variant="outline" size="lg" className="gap-2 text-base px-8">
              Learn More
              <IconArrowRight className="h-4 w-4" />
            </Button>
          </a>
        </div>

        {/* Example output preview with tabs */}
        <div className="mt-8 sm:mt-12 md:mt-16 mx-auto max-w-3xl px-2">
          <div className="rounded-xl border bg-card shadow-lg overflow-hidden">
            {/* Terminal header with tabs */}
            <div className="border-b bg-muted/50">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-border/50">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <span className="ml-2 text-xs text-muted-foreground font-mono">
                  {examplePipelines[selectedPipeline].filename}
                </span>
              </div>
              {/* Tabs */}
              <div className="flex gap-1 px-2 py-1.5 overflow-x-auto scrollbar-hide">
                {examplePipelines.map((pipeline, index) => (
                  <button
                    key={pipeline.id}
                    onClick={() => setSelectedPipeline(index)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                      selectedPipeline === index
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                    }`}
                  >
                    {pipeline.label}
                  </button>
                ))}
              </div>
            </div>
            {/* Code display */}
            <pre className="p-3 sm:p-4 text-left text-xs sm:text-sm font-mono text-foreground/80 overflow-auto max-h-64 sm:max-h-80 md:max-h-96 leading-relaxed">
              <code>{examplePipelines[selectedPipeline].code}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
