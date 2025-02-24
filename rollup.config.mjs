import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { swc, defineRollupSwcOption } from 'rollup-plugin-swc3';
import dts from 'rollup-plugin-dts';

const swcConfig = defineRollupSwcOption({
  include: /\.[mc]?[jt]sx?$/,
  exclude: /node_modules/,
  tsconfig: 'tsconfig.json',
  minify: true,
  jsc: { minify: { sourceMap: true } },
  sourceMaps: true,
});

const commonPlugins = [
  nodeResolve(),
  commonjs(),
  json(),
  swc(swcConfig),
];

export default [
  {
    input: 'src/cli.ts',
    output: {
      file: 'dist/cli.js',
      format: 'esm',
      banner: '#!/usr/bin/env node',
      sourcemap: true
    },
    plugins: commonPlugins
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.cjs',
        format: 'cjs',
        sourcemap: true
      },
      {
        file: 'dist/index.mjs',
        format: 'esm',
        sourcemap: true
      }
    ],
    plugins: commonPlugins
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'esm'
    },
    plugins: [dts()]
  },
  {
    input: 'src/action.ts',
    output: {
      file: 'action/action.js',
      format: 'esm',
      sourcemap: true
    },
    plugins: commonPlugins
  }
];
