import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { swc, defineRollupSwcOption } from 'rollup-plugin-swc3';
import dts from 'rollup-plugin-dts';

const swcConfig = defineRollupSwcOption({
  include: /\.[jt]sx?$/,
  exclude: /node_modules/,
  tsconfig: 'tsconfig.json',
  minify: true,
  jsc: { minify: { sourceMap: true } },
  sourceMaps: true,
});

const plugins = [nodeResolve(), commonjs(), json(), swc(swcConfig)];

export default [
  {
    input: 'src/cli.ts',
    output: {
      file: 'dist/cli.js',
      format: 'esm',
      sourcemap: true
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      json(),
      swc(swcConfig),
      {
        name: 'add-shebang',
        renderChunk(code) {
          return '#!/usr/bin/env node\n' + code;
        }
      }
    ]
  },
  {
    input: 'src/index.ts',
    output: [
      { file: 'dist/index.cjs', format: 'cjs', sourcemap: true },
      { file: 'dist/index.mjs', format: 'esm', sourcemap: true }
    ],
    plugins
  },
  {
    input: 'src/index.ts',
    output: { file: 'dist/index.d.ts', format: 'esm' },
    plugins: [dts()]
  }
];
