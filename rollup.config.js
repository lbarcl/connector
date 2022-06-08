import typescript from 'rollup-plugin-typescript2'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { terser } from 'rollup-plugin-terser'

export default [
  // ES Modules
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.es.js', format: 'es',
    },
    plugins: [
      typescript(),
      babel({ extensions: ['.ts'] }),
      nodePolyfills(),
    ],
  },

  /*// UMD
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.umd.min.js',
      format: 'umd',
      name: 'Connector',
      indent: false,
    },
    plugins: [
      typescript(),
      babel({ extensions: ['.ts'], exclude: 'node_modules/**' }),
      terser(),
      nodePolyfills(),
    ],
    }, */
  
    // CommonJS
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/index.cjs.min.js',
            format: 'cjs',
            indent: false,
        },
        plugins: [
            typescript(),
            babel({ extensions: ['.ts'], exclude: 'node_modules/**' }),
            commonjs(),
            nodePolyfills(),

        ],
    }
]