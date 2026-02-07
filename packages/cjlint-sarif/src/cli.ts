import { readFileSync, writeFileSync } from 'fs';
import { program } from 'commander';
import { z } from 'zod';
import { convert, parseCangjieResults } from './index';

const packageJson = { version: '2.0.0' };

program
  .version(packageJson.version)
  .description('Convert cjlint JSON to SARIF format')
  .requiredOption('-i, --input <path>', 'Input JSON file path')
  .option('-o, --output <path>', 'Output SARIF file path', 'output.sarif')
  .parse();

const options = program.opts();

try {
  const rawData = readFileSync(options.input, 'utf-8');
  let jsonData: unknown;

  try {
    jsonData = JSON.parse(rawData);
  } catch {
    console.error('Error: Invalid JSON format in input file');
    process.exit(1);
  }

  const inputData = parseCangjieResults(jsonData);
  const sarifReport = convert(inputData);

  writeFileSync(options.output, JSON.stringify(sarifReport, null, 2));

  console.log(`Successfully converted to ${options.output}`);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('Validation Error: Invalid cjlint output format');
    for (const issue of error.issues) {
      const path = issue.path.join('.');
      console.error(`  - ${path}: ${issue.message}`);
    }
    process.exit(1);
  }

  console.error('Error:', error instanceof Error ? error.message : error);
  process.exit(1);
}
