import 'source-map-support/register';
import { readFileSync, writeFileSync } from 'fs';
import { program } from 'commander';
import { convertToSarif } from './index';

program
  .version('1.0.0')
  .description('Convert Cangjie JSON to SARIF format')
  .requiredOption('-i, --input <path>', 'Input JSON file path')
  .option('-o, --output <path>', 'Output SARIF file path', 'output.sarif')
  .parse();

const options = program.opts();

try {
  const inputData = JSON.parse(readFileSync(options.input, 'utf-8'));
  
  const sarifReport = convertToSarif(inputData);
  
  writeFileSync(options.output, JSON.stringify(sarifReport, null, 2));
  
  console.log(`Successfully converted to ${options.output}`);
} catch (error) {
  console.error('Error:', error instanceof Error ? error.message : error);
  process.exit(1);
}
