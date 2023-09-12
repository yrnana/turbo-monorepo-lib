import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, type Options } from 'tsup';
import { sassPlugin, postcssModules } from 'esbuild-sass-plugin';
import { spawnSync } from 'child_process';

export const baseConfig = (
  config: {
    esm?: Options;
    cjs?: Options;
  } = {},
) => {
  const pkgPath = path.resolve(process.cwd(), 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8')) as Record<
    string,
    any
  >;
  const libraryName: string = pkg.name.replace(/^@yrnana\//g, '');

  return defineConfig((options) => {
    const commonOptions: Options = {
      ...options,
      entry: {
        [libraryName]: 'src/index.ts',
      },
      target: ['es2020', 'node16'],
      clean: true,
      dts: false,
      esbuildPlugins: [
        sassPlugin({
          filter: /\.module\.scss$/,
          transform: postcssModules({}),
        }),
        sassPlugin({
          filter: /\.scss$/,
        }),
      ],
    };

    return [
      {
        ...commonOptions,
        format: 'esm',
        outExtension: () => ({ js: '.mjs' }),
        onSuccess: () => {
          spawnSync('tsc', [
            '--rootDir',
            'src',
            '--outDir',
            'dist',
            '--declaration',
            '--emitDeclarationOnly',
            '--noEmit',
            'false',
          ]);
        },
        ...config.esm,
      },
      {
        ...commonOptions,
        format: 'cjs',
        outExtension: () => ({ js: '.cjs' }),
        ...config.cjs,
      },
    ] as Options[];
  });
};
