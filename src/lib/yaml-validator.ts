/**
 * YAML Validator for Pipeline Configuration
 * Validates generated YAML for syntax errors and common issues
 */

export interface ValidationError {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

/**
 * Basic YAML syntax validation
 * Note: This is a simplified validator. For production, consider using a full YAML parser library
 */
export function validateYAML(yaml: string): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  const lines = yaml.split('\n');

  // Check for basic YAML syntax issues
  let inMultilineString = false;
  let multilineChar = '';
  let currentIndent = 0;
  const indentStack: number[] = [0];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNumber = i + 1;

    // Skip empty lines and comments
    if (!line.trim() || line.trim().startsWith('#')) {
      continue;
    }

    // Handle multiline strings
    if (inMultilineString) {
      if (line.trim().endsWith(multilineChar)) {
        inMultilineString = false;
        multilineChar = '';
      }
      continue;
    }

    if (line.includes('|') || line.includes('>')) {
      inMultilineString = true;
      multilineChar = line.includes('|') ? '' : '>';
      continue;
    }

    // Check indentation consistency
    const indent = line.search(/\S|$/);
    if (indent > 0 && line.trim().startsWith('- ')) {
      // List item
      const expectedIndent = indentStack[indentStack.length - 1];
      if (indent < expectedIndent && indentStack.length > 1) {
        // Dedent
        while (indentStack.length > 1 && indentStack[indentStack.length - 1] > indent) {
          indentStack.pop();
        }
      }
    } else if (indent > 0) {
      // Nested property
      const lastIndent = indentStack[indentStack.length - 1];
      if (indent > lastIndent) {
        indentStack.push(indent);
      } else if (indent < lastIndent) {
        while (indentStack.length > 1 && indentStack[indentStack.length - 1] > indent) {
          indentStack.pop();
        }
      }
    }

    // Check for tabs (YAML should use spaces)
    if (line.includes('\t')) {
      errors.push({
        line: lineNumber,
        column: line.indexOf('\t') + 1,
        message: 'Tabs are not allowed in YAML. Use spaces instead.',
        severity: 'error'
      });
    }

    // Check for invalid characters in keys
    const keyMatch = line.match(/^(\s*)([\w\-]+):/);
    if (keyMatch) {
      const key = keyMatch[2];
      if (!/^[a-zA-Z_][a-zA-Z0-9_\-]*$/.test(key) && !key.startsWith('${{')) {
        warnings.push({
          line: lineNumber,
          column: keyMatch[1].length + 1,
          message: `Key "${key}" may contain invalid characters`,
          severity: 'warning'
        });
      }
    }

    // Check for missing colons in key-value pairs
    if (line.trim() && !line.includes(':') && !line.trim().startsWith('- ') && !line.trim().startsWith('>')) {
      warnings.push({
        line: lineNumber,
        column: 1,
        message: 'Line may be missing a colon (:) for key-value pair',
        severity: 'warning'
      });
    }

    // Check for trailing spaces
    if (line !== line.trimEnd()) {
      warnings.push({
        line: lineNumber,
        column: line.trimEnd().length + 1,
        message: 'Trailing spaces detected',
        severity: 'warning'
      });
    }
  }

  // GitHub Actions specific validations
  validateGitHubActions(yaml, errors, warnings);

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * GitHub Actions specific validations
 */
function validateGitHubActions(yaml: string, errors: ValidationError[], warnings: ValidationError[]) {
  const lines = yaml.split('\n');

  // Check for required fields
  if (!yaml.includes('name:')) {
    errors.push({
      line: 1,
      column: 1,
      message: 'Missing required field "name"',
      severity: 'error'
    });
  }

  if (!yaml.includes('on:') && !yaml.includes('trigger:')) {
    errors.push({
      line: 1,
      column: 1,
      message: 'Missing required trigger configuration (on:)',
      severity: 'error'
    });
  }

  if (!yaml.includes('jobs:')) {
    errors.push({
      line: 1,
      column: 1,
      message: 'Missing required field "jobs"',
      severity: 'error'
    });
  }

  // Check for common action versions
  const deprecatedActions = [
    'actions/checkout@v1',
    'actions/checkout@v2',
    'actions/setup-node@v1',
    'actions/setup-node@v2',
    'actions/setup-python@v1',
    'actions/setup-python@v2',
    'actions/cache@v1',
    'actions/cache@v2',
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const action of deprecatedActions) {
      if (line.includes(action)) {
        warnings.push({
          line: i + 1,
          column: line.indexOf(action) + 1,
          message: `Using deprecated action version: ${action}. Consider updating to v3 or v4.`,
          severity: 'warning'
        });
      }
    }
  }

  // Check for secrets usage
  if (yaml.includes('${{ secrets.') && !yaml.includes('env:') && !yaml.includes('with:')) {
    warnings.push({
      line: 1,
      column: 1,
      message: 'Secrets are used but may not be properly configured in env or with sections',
      severity: 'warning'
    });
  }
}

/**
 * Validate pipeline configuration for best practices
 */
export function validatePipelineConfig(config: any): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check for required fields
  if (!config.projectName || config.projectName.trim() === '') {
    errors.push({
      line: 0,
      column: 0,
      message: 'Project name is required',
      severity: 'error'
    });
  }

  if (!config.projectType) {
    errors.push({
      line: 0,
      column: 0,
      message: 'Project type is required',
      severity: 'error'
    });
  }

  if (!config.ciProvider) {
    errors.push({
      line: 0,
      column: 0,
      message: 'CI provider is required',
      severity: 'error'
    });
  }

  // Check for version compatibility
  if (config.projectType === 'nodejs' && !config.nodeVersion) {
    errors.push({
      line: 0,
      column: 0,
      message: 'Node version is required for Node.js projects',
      severity: 'error'
    });
  }

  if (config.projectType === 'python' && !config.pythonVersion) {
    errors.push({
      line: 0,
      column: 0,
      message: 'Python version is required for Python projects',
      severity: 'error'
    });
  }

  // Check for Docker configuration
  if (config.enableDocker && !config.dockerImageName) {
    errors.push({
      line: 0,
      column: 0,
      message: 'Docker image name is required when Docker is enabled',
      severity: 'error'
    });
  }

  // Check for deployment configuration
  if (config.deployTarget !== 'none' && !config.enableBuild) {
    errors.push({
      line: 0,
      column: 0,
      message: 'Build step should be enabled for deployment',
      severity: 'warning'
    });
  }

  return errors;
}
