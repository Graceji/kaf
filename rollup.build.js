import path from 'path';
import * as fs from 'fs';
import babel from '@rollup/plugin-babel';
import chalk from 'chalk';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';

const tag = process.env.NODE_TAG || process.env.NODE_ENV;

function createConfig(fileName = 'index', inputFile, externals, aliasEntries) {
  const outputFile = inputFile.replace('src/', '');
  const cfg = {
    es6: {output: [{file: `lib/es6/${outputFile}${fileName}.js`, format: 'esm'}], mainFields: ['module', 'main']},
    es5: {
      output: [
        {file: `lib/es5/${outputFile}${fileName}.js`, format: 'esm'},
        //{file: `lib/cjs/${outputFile}${fileName}.js`, format: 'cjs'},
      ],
      mainFields: ['main', 'module'],
    },
  };
  const env = cfg[tag];
  const extensions = ['.js', '.ts', '.tsx'];
  const pkgResult = {include: {}, external: {}};

  const config = {
    input: inputFile,
    output: env.output,
    external: (id) => {
      const hit = externals.some((mod) => mod === id || id.startsWith(`${mod}/`));
      if (hit) {
        if (!pkgResult.external[id]) {
          pkgResult.external[id] = true;
          console.warn(chalk.red('external: '), id);
        }
      } else if (!pkgResult.include[id]) {
        pkgResult.include[id] = true;
        console.warn(chalk.green('include: '), id);
      }
      return hit;
    },
    plugins: [
      aliasEntries &&
        alias({
          entries: aliasEntries,
        }),
      process.env.NODE_ENV === 'production' && replace({'process.env.NODE_ENV': '"production"'}),
      resolve({extensions, mainFields: env.mainFields}),
      babel({
        exclude: 'node_modules/**',
        extensions,
        babelHelpers: 'runtime',
        skipPreflightCheck: true,
        // externalHelpers: true,
      }),
      commonjs(),
    ].filter(Boolean),
  };
  return config;
}

export default function (root, aliasEntries) {
  const inputFiles = ['src/'];
  const libsDir = path.resolve(root, './src/lib/');
  if (fs.existsSync(libsDir)) {
    const libs = fs.readdirSync(libsDir);
    libs.forEach((item) => {
      inputFiles.push(`src/lib/${item}/`);
    });
  }
  const pkg = require(path.resolve(root, './package.json'));
  const externals = Object.keys(pkg.externals ? pkg.externals : {...pkg.dependencies, ...pkg.peerDependencies});
  return inputFiles.map((bundle) => createConfig(undefined, bundle, externals, aliasEntries));
}
