import type { Log, ReportingDescriptor, Result, Region } from 'sarif';
import {
  CangjieResult,
  DefectLevel,
  parseCangjieResults,
  safeParseCangjieResults,
  CangjieResultSchema,
  CangjieResultArraySchema,
  DefectLevelSchema,
} from './schemas';

export {
  parseCangjieResults,
  safeParseCangjieResults,
  CangjieResultSchema,
  CangjieResultArraySchema,
  DefectLevelSchema,
};
export type { CangjieResult, DefectLevel };

/**
 * Extract rule ID prefix from description
 * e.g., "G.PKG.01: Avoid wildcard import 'std.ast'." => "G.PKG.01"
 */
function extractRuleIdPrefix(description: string): string {
  const match = description.match(/^([A-Z]+\.[A-Z]+\.\d+):/);
  return match ? match[1] : '';
}

/**
 * Extract generic description (remove quoted specific values)
 * e.g., "G.PKG.01: Avoid wildcard import 'std.ast'." => "Avoid wildcard import"
 */
function extractGenericDescription(description: string): string {
  const withoutPrefix = description.replace(/^[A-Z]+\.[A-Z]+\.\d+:\s*/, '');
  return withoutPrefix
    .replace(/'[^']*'/g, '')  // Remove quoted values
    .replace(/\.$/, '')       // Remove trailing period
    .replace(/\s+/g, ' ')     // Normalize whitespace
    .trim();                  // Trim leading/trailing
}

/**
 * Convert file path to file:// URI scheme
 * Windows: "T:\path\file.cj" => "file:///T:/path/file.cj"
 * Unix: "/path/file.cj" => "file:///path/file.cj"
 */
function toFileUri(filePath: string): string {
  const normalized = filePath.replace(/\\/g, '/');

  // Windows absolute path (e.g., "C:/..." or "T:/...")
  if (/^[A-Za-z]:/.test(normalized)) {
    return `file:///${normalized}`;
  }

  // Unix absolute path
  if (normalized.startsWith('/')) {
    return `file://${normalized}`;
  }

  // Relative path - keep as is
  return normalized;
}

export function convert(input: CangjieResult[]): Log {
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

  // Build unique rules with index mapping
  const uniqueRuleTypes = new Set(input.map(r => r.defectType));
  const ruleIdToIndex = new Map<string, number>();

  const uniqueRules: ReportingDescriptor[] = Array.from(uniqueRuleTypes).map((ruleType, index) => {
    const rule = input.find(r => r.defectType === ruleType)!;
    ruleIdToIndex.set(ruleType, index);

    const ruleIdPrefix = extractRuleIdPrefix(rule.description);
    const genericDesc = extractGenericDescription(rule.description);

    // Build shortDescription: "G.PKG.01: Avoid wildcard import" or just generic if no prefix
    const shortText = ruleIdPrefix ? `${ruleIdPrefix}: ${genericDesc}` : genericDesc;

    return {
      id: rule.defectType,
      shortDescription: { text: shortText },
      fullDescription: { text: rule.description },
      defaultConfiguration: { level: getSarifLevel(rule.defectLevel) }
    };
  });

  log.runs[0].tool.driver.rules = uniqueRules;
  log.runs[0].results = input.map(result => createSarifResult(result, ruleIdToIndex));

  return log;
}

function createSarifResult(result: CangjieResult, ruleIdToIndex: Map<string, number>): Result {
  const region: Region = {
    startLine: result.line,
    startColumn: result.column,
  };

  if (result.endLine !== undefined) {
    region.endLine = result.endLine;
  }
  if (result.endColumn !== undefined) {
    region.endColumn = result.endColumn;
  }

  return {
    ruleId: result.defectType,
    ruleIndex: ruleIdToIndex.get(result.defectType),
    message: { text: result.description },
    level: getSarifLevel(result.defectLevel),
    locations: [{
      physicalLocation: {
        artifactLocation: { uri: toFileUri(result.file) },
        region
      }
    }]
  };
}

function getSarifLevel(level: DefectLevel): 'note' | 'warning' | 'error' {
  switch (level) {
    case 'MANDATORY': return 'error';
    case 'SUGGESTIONS': return 'note';
  }
}
