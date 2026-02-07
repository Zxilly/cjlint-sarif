import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { execSync } from 'child_process';
import { writeFileSync, unlinkSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

const CLI_PATH = join(__dirname, '../dist/cli.js');
const TEST_INPUT = join(__dirname, '../test-input.json');
const TEST_OUTPUT = join(__dirname, '../test-output.sarif');

describe('CLI Integration', () => {
  beforeEach(() => {
    // Clean up any existing test files
    if (existsSync(TEST_INPUT)) unlinkSync(TEST_INPUT);
    if (existsSync(TEST_OUTPUT)) unlinkSync(TEST_OUTPUT);
  });

  afterEach(() => {
    // Clean up test files
    if (existsSync(TEST_INPUT)) unlinkSync(TEST_INPUT);
    if (existsSync(TEST_OUTPUT)) unlinkSync(TEST_OUTPUT);
  });

  it('should convert valid cjlint JSON to SARIF', () => {
    const input = [
      {
        file: 'src/main.cj',
        line: 1,
        column: 1,
        endLine: 1,
        endColumn: 10,
        analyzerName: 'cangjieCodeCheck',
        description: 'G.PKG.01: Test warning',
        defectLevel: 'SUGGESTIONS',
        defectType: 'G_PKG_01_test',
        language: 'cangjie'
      }
    ];

    writeFileSync(TEST_INPUT, JSON.stringify(input));

    const result = execSync(`node ${CLI_PATH} -i ${TEST_INPUT} -o ${TEST_OUTPUT}`, {
      encoding: 'utf-8'
    });

    expect(result).toContain('Successfully converted');
    expect(existsSync(TEST_OUTPUT)).toBe(true);

    const sarif = JSON.parse(readFileSync(TEST_OUTPUT, 'utf-8'));
    expect(sarif.version).toBe('2.1.0');
    expect(sarif.runs[0].results).toHaveLength(1);
    expect(sarif.runs[0].results[0].level).toBe('note');
  });

  it('should handle MANDATORY level as error', () => {
    const input = [
      {
        file: 'src/main.cj',
        line: 5,
        column: 1,
        description: 'G.OTH.03: Critical issue',
        defectLevel: 'MANDATORY',
        defectType: 'G_OTH_03_test'
      }
    ];

    writeFileSync(TEST_INPUT, JSON.stringify(input));
    execSync(`node ${CLI_PATH} -i ${TEST_INPUT} -o ${TEST_OUTPUT}`);

    const sarif = JSON.parse(readFileSync(TEST_OUTPUT, 'utf-8'));
    expect(sarif.runs[0].results[0].level).toBe('error');
  });

  it('should fail on invalid JSON', () => {
    writeFileSync(TEST_INPUT, 'not valid json');

    expect(() => {
      execSync(`node ${CLI_PATH} -i ${TEST_INPUT} -o ${TEST_OUTPUT}`, {
        encoding: 'utf-8',
        stdio: 'pipe'
      });
    }).toThrow();
  });

  it('should fail on invalid cjlint format', () => {
    writeFileSync(TEST_INPUT, JSON.stringify([{ invalid: 'data' }]));

    expect(() => {
      execSync(`node ${CLI_PATH} -i ${TEST_INPUT} -o ${TEST_OUTPUT}`, {
        encoding: 'utf-8',
        stdio: 'pipe'
      });
    }).toThrow();
  });

  it('should fail on invalid defectLevel', () => {
    const input = [
      {
        file: 'src/main.cj',
        line: 1,
        column: 1,
        description: 'Test',
        defectLevel: 'INVALID_LEVEL',
        defectType: 'TEST'
      }
    ];

    writeFileSync(TEST_INPUT, JSON.stringify(input));

    expect(() => {
      execSync(`node ${CLI_PATH} -i ${TEST_INPUT} -o ${TEST_OUTPUT}`, {
        encoding: 'utf-8',
        stdio: 'pipe'
      });
    }).toThrow();
  });

  it('should use default output file when not specified', () => {
    const input = [
      {
        file: 'src/main.cj',
        line: 1,
        column: 1,
        description: 'Test',
        defectLevel: 'SUGGESTIONS',
        defectType: 'TEST'
      }
    ];

    writeFileSync(TEST_INPUT, JSON.stringify(input));

    const defaultOutput = join(__dirname, '../output.sarif');
    if (existsSync(defaultOutput)) unlinkSync(defaultOutput);

    try {
      execSync(`node ${CLI_PATH} -i ${TEST_INPUT}`, {
        cwd: join(__dirname, '..'),
        encoding: 'utf-8'
      });

      expect(existsSync(defaultOutput)).toBe(true);
    } finally {
      if (existsSync(defaultOutput)) unlinkSync(defaultOutput);
    }
  });

  it('should handle empty input array', () => {
    writeFileSync(TEST_INPUT, JSON.stringify([]));
    execSync(`node ${CLI_PATH} -i ${TEST_INPUT} -o ${TEST_OUTPUT}`);

    const sarif = JSON.parse(readFileSync(TEST_OUTPUT, 'utf-8'));
    expect(sarif.runs[0].results).toHaveLength(0);
    expect(sarif.runs[0].tool.driver.rules).toHaveLength(0);
  });

  it('should handle multiple results with same rule', () => {
    const input = [
      {
        file: 'src/a.cj',
        line: 1,
        column: 1,
        description: 'G.PKG.01: First',
        defectLevel: 'SUGGESTIONS',
        defectType: 'G_PKG_01'
      },
      {
        file: 'src/b.cj',
        line: 2,
        column: 2,
        description: 'G.PKG.01: Second',
        defectLevel: 'SUGGESTIONS',
        defectType: 'G_PKG_01'
      }
    ];

    writeFileSync(TEST_INPUT, JSON.stringify(input));
    execSync(`node ${CLI_PATH} -i ${TEST_INPUT} -o ${TEST_OUTPUT}`);

    const sarif = JSON.parse(readFileSync(TEST_OUTPUT, 'utf-8'));
    expect(sarif.runs[0].results).toHaveLength(2);
    expect(sarif.runs[0].tool.driver.rules).toHaveLength(1);
  });
});
