import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { swc, defineRollupSwcOption } from 'rollup-plugin-swc3';

const swcConfig = defineRollupSwcOption({
  include: /\.[jt]sx?$/,
  exclude: /node_modules/,
  tsconfig: 'tsconfig.json',
  minify: true,
  jsc: { minify: { sourceMap: true } },
  sourceMaps: true,
});

export default {
  input: 'src/action.ts',
  output: {
    file: 'dist/action.js',
    format: 'esm',
    sourcemap: true
  },
  plugins: [nodeResolve(), commonjs(), json(), swc(swcConfig)]
};
