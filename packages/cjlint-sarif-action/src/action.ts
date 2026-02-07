import * as core from '@actions/core';
import { readFileSync, writeFileSync } from 'fs';
import { convert, parseCangjieResults } from 'cjlint-sarif';
import { z } from 'zod';

async function run(): Promise<void> {
  try {
    const inputFile = core.getInput('input-file', { required: true });
    const outputFile = core.getInput('output-file', { required: true });

    core.info(`Reading CJLint output from ${inputFile}`);
    const rawData = readFileSync(inputFile, 'utf8');

    let jsonData: unknown;
    try {
      jsonData = JSON.parse(rawData);
    } catch {
      throw new Error('Invalid JSON format in input file');
    }

    core.info('Validating and converting to SARIF format');
    const inputJson = parseCangjieResults(jsonData);
    const sarifOutput = convert(inputJson);

    core.info(`Writing SARIF output to ${outputFile}`);
    writeFileSync(outputFile, JSON.stringify(sarifOutput, null, 2));

    core.info('Conversion completed successfully');
  } catch (error) {
    if (error instanceof z.ZodError) {
      const details = error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ');
      core.setFailed(`Validation error: ${details}`);
    } else if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed('An unexpected error occurred');
    }
  }
}

run();
