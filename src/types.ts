export interface CangjieResult {
  file: string;
  line: number;
  column: number;
  endLine: number;
  endColumn: number;
  analyzerName: string;
  description: string;
  defectLevel: string;
  defectType: string;
  language: string;
}

export interface SarifResult {
  ruleId: string;
  message: { text: string };
  level: 'note' | 'warning' | 'error';
  locations: Array<{
    physicalLocation: {
      artifactLocation: { uri: string };
      region: {
        startLine: number;
        startColumn: number;
        endLine?: number;
        endColumn?: number;
      };
    };
  }>;
}
