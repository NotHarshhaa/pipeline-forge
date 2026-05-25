"use client";

import { useState, useCallback, useEffect } from "react";
import { generatePipeline, type PipelineConfig } from "@/lib/generate-pipeline";
import { DEFAULT_PIPELINE_CONFIG } from "../constants/default-config";
import { presets, presetLabels } from "../constants/presets";
import { steps } from "../constants/options";
import { analyzeBestPractices } from "../utils/analyze-best-practices";
import { estimatePipelineCost } from "../utils/estimate-cost";
import type { PipelineGeneratorContext } from "../types";

export function usePipelineGenerator(): PipelineGeneratorContext {
  const [config, setConfig] = useState<PipelineConfig>(DEFAULT_PIPELINE_CONFIG);
  const [output, setOutput] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [savedConfigs, setSavedConfigs] = useState<Record<string, PipelineConfig>>({});
  const [currentConfigName, setCurrentConfigName] = useState<string>("");
  const [history, setHistory] = useState<PipelineConfig[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([0]));
  const suggestions = analyzeBestPractices(config);
  const costEstimate = estimatePipelineCost(config);

  useEffect(() => {
    const saved = localStorage.getItem("pipeline-forge-configs");
    if (saved) {
      try {
        setSavedConfigs(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved configs:", e);
      }
    }
    setHistory([DEFAULT_PIPELINE_CONFIG]);
    setHistoryIndex(0);
  }, []);

  useEffect(() => {
    if (currentConfigName) {
      const updated = { ...savedConfigs, [currentConfigName]: config };
      setSavedConfigs(updated);
      localStorage.setItem("pipeline-forge-configs", JSON.stringify(updated));
    }
  }, [config, currentConfigName]);

  const handleSaveConfig = useCallback(() => {
    const name = prompt(
      "Enter a name for this configuration:",
      currentConfigName || "my-config"
    );
    if (name) {
      const updated = { ...savedConfigs, [name]: config };
      setSavedConfigs(updated);
      localStorage.setItem("pipeline-forge-configs", JSON.stringify(updated));
      setCurrentConfigName(name);
    }
  }, [config, savedConfigs, currentConfigName]);

  const handleLoadConfig = useCallback(
    (name: string) => {
      const loaded = savedConfigs[name];
      if (loaded) {
        setConfig(loaded);
        setCurrentConfigName(name);
      }
    },
    [savedConfigs]
  );

  const handleDeleteConfig = useCallback(
    (name: string) => {
      if (confirm(`Delete configuration "${name}"?`)) {
        const updated = { ...savedConfigs };
        delete updated[name];
        setSavedConfigs(updated);
        localStorage.setItem("pipeline-forge-configs", JSON.stringify(updated));
        if (currentConfigName === name) {
          setCurrentConfigName("");
        }
      }
    },
    [savedConfigs, currentConfigName]
  );

  const handleResetConfig = useCallback(() => {
    if (confirm("Reset to default configuration?")) {
      setConfig(DEFAULT_PIPELINE_CONFIG);
      setCurrentConfigName("");
      setOutput("");
    }
  }, []);

  const handleApplyPreset = useCallback((presetKey: string) => {
    const preset = presets[presetKey];
    if (
      preset &&
      confirm(
        `Apply preset "${presetLabels[presetKey].label}"? This will replace your current configuration.`
      )
    ) {
      setConfig((prev) => ({ ...prev, ...preset }));
      setCurrentConfigName("");
      setOutput("");
    }
  }, []);

  const handleExportConfig = useCallback(() => {
    const configJson = JSON.stringify(config, null, 2);
    const blob = new Blob([configJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${config.projectName}-pipeline-config.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [config]);

  const handleImportConfig = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const imported = JSON.parse(event.target?.result as string);
            if (
              confirm(
                "Import this configuration? This will replace your current configuration."
              )
            ) {
              setConfig(imported);
              setCurrentConfigName("");
              setOutput("");
            }
          } catch {
            alert(
              "Failed to parse JSON file. Please ensure it is a valid configuration."
            );
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, []);

  const updateConfig = useCallback(
    <K extends keyof PipelineConfig>(key: K, value: PipelineConfig[K]) => {
      setConfig((prev) => {
        const newConfig = { ...prev, [key]: value };
        setHistory((hist) => {
          const newHistory = hist.slice(0, historyIndex + 1);
          newHistory.push(newConfig);
          if (newHistory.length > 50) {
            newHistory.shift();
          }
          setHistoryIndex(newHistory.length - 1);
          return newHistory;
        });
        return newConfig;
      });
    },
    [historyIndex]
  );

  useEffect(() => {
    const defaults: Record<string, string> = {
      nodejs: "npm",
      python: "pip",
      java: "maven",
      go: "",
      rust: "",
      dotnet: "",
    };
    const defaultPm = defaults[config.projectType];
    if (defaultPm && config.packageManager !== defaultPm) {
      updateConfig("packageManager", defaultPm as PipelineConfig["packageManager"]);
    }
  }, [config.projectType, config.packageManager, updateConfig]);

  const handleGenerate = useCallback(() => {
    const yaml = generatePipeline(config);
    setOutput(yaml);
  }, [config]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handleDownload = useCallback(() => {
    const filenameMap: Record<PipelineConfig["ciProvider"], string> = {
      "github-actions": ".github/workflows/ci.yml",
      "gitlab-ci": ".gitlab-ci.yml",
      jenkins: "Jenkinsfile",
      circleci: ".circleci/config.yml",
      "azure-pipelines": "azure-pipelines.yml",
    };
    const filename = filenameMap[config.ciProvider] || "pipeline.yml";
    const blob = new Blob([output], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, [output, config.ciProvider]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setConfig(history[newIndex]);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setConfig(history[newIndex]);
    }
  }, [history, historyIndex]);

  const toggleStep = useCallback((stepIndex: number) => {
    setExpandedSteps((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(stepIndex)) {
        newExpanded.delete(stepIndex);
      } else {
        newExpanded.add(stepIndex);
      }
      return newExpanded;
    });
  }, []);

  const goToStep = useCallback((stepIndex: number) => {
    setCurrentStep(stepIndex);
    setExpandedSteps(new Set([stepIndex]));
  }, []);

  const completeStep = useCallback(
    (stepIndex: number) => {
      if (stepIndex < steps.length - 1) {
        goToStep(stepIndex + 1);
      }
    },
    [goToStep]
  );

  return {
    config,
    updateConfig,
    output,
    copied,
    savedConfigs,
    currentConfigName,
    historyIndex,
    historyLength: history.length,
    currentStep,
    expandedSteps,
    suggestions,
    costEstimate,
    handleSaveConfig,
    handleLoadConfig,
    handleDeleteConfig,
    handleResetConfig,
    handleApplyPreset,
    handleExportConfig,
    handleImportConfig,
    handleGenerate,
    handleCopy,
    handleDownload,
    handleUndo,
    handleRedo,
    toggleStep,
    goToStep,
    completeStep,
    setExpandedSteps,
    setCurrentStep,
  };
}
