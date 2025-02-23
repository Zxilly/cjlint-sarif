import * as core from '@actions/core';
import { readFileSync, writeFileSync } from 'fs';
import { convert } from './index';

async function run(): Promise<void> {
  try {
    const inputFile = core.getInput('input-file', { required: true });
    const outputFile = core.getInput('output-file', { required: true });

    core.info(`Reading CJLint output from ${inputFile}`);
    const inputJson = JSON.parse(readFileSync(inputFile, 'utf8'));

    core.info('Converting to SARIF format');
    const sarifOutput = convert(inputJson);

    core.info(`Writing SARIF output to ${outputFile}`);
    writeFileSync(outputFile, JSON.stringify(sarifOutput, null, 2));

    core.info('Conversion completed successfully');
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed('An unexpected error occurred');
    }
  }
}

run(); 