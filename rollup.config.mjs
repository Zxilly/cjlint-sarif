import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default [
  {
    input: 'src/cli.ts',
    output: {
      file: 'dist/cli.js',
      format: 'esm',
      banner: '#!/usr/bin/env node',
      sourcemap: true
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({
        sourceMap: true,
        inlineSources: true
      }),
    ]
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
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({
        sourceMap: true,
        inlineSources: true
      }),
    ]
  }
];
