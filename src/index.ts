import { CangjieResult } from './types';
import * as path from 'path';
import { Log, ReportingDescriptor, Result } from 'sarif';

export function convert(input: CangjieResult[]): Log {
  // 创建 SARIF Log
  const log: Log = {
    version: '2.1.0',
    $schema: 'https://json.schemastore.org/sarif-2.1.0.json',
    runs: [{
      tool: {
        driver: {
          name: 'cjlint',
          version: '1.0.0',
          rules: []
        }
      },
      results: []
    }]
  };

  const uniqueRuleTypes = new Set(input.map(r => r.defectType));
  const uniqueRules = Array.from(uniqueRuleTypes).map(ruleType => {
    const rule = input.find(r => r.defectType === ruleType)!;
    return {
      id: rule.defectType,
      shortDescription: { text: rule.description },
      defaultConfiguration: { level: getSarifLevel(rule.defectLevel) }
    };
  });

  log.runs[0].tool.driver.rules = uniqueRules.map(rule => ({
    id: rule.id,
    shortDescription: rule.shortDescription,
    defaultConfiguration: rule.defaultConfiguration
  } as ReportingDescriptor));

  log.runs[0].results = input.map(result => createSarifResult(result));

  return log;
}

function normalizeFilePath(filePath: string): string {
  const normalized = path.normalize(filePath);
  const parts = normalized.split(/[\\/]/);
  
  const srcIndex = parts.lastIndexOf('src');
  if (srcIndex !== -1) {
    return parts.slice(srcIndex - 1).join('/');
  }

  return parts.join('/');
}

function createSarifResult(result: CangjieResult): Result {
  return {
    ruleId: result.defectType,
    message: { text: result.description },
    level: getSarifLevel(result.defectLevel),
    locations: [{
      physicalLocation: {
        artifactLocation: { uri: normalizeFilePath(result.file) },
        region: {
          startLine: result.line,
          startColumn: result.column,
          endLine: result.endLine,
          endColumn: result.endColumn
        }
      }
    }]
  };
}

function getSarifLevel(level: string): 'note' | 'warning' | 'error' {
  switch (level) {
    case 'MANDATORY': return 'error';
    case 'SUGGESTIONS': return 'note';
    default: return 'warning';
  }
}
