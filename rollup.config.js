import typescript from 'rollup-plugin-typescript2'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
//import nodePolyfills from 'rollup-plugin-polyfill-node';
import { terser } from 'rollup-plugin-terser'

export default [
  // ES Modules
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/es/index.es.js', format: 'es',
    },
    plugins: [
      typescript(),
      babel({ extensions: ['.ts'] }),
    ],
  },

  // UMD
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/umd/index.umd.min.js',
      format: 'umd',
      name: 'Connector',
      indent: false,
    },
    plugins: [
      typescript(),
      babel({ extensions: ['.ts'], exclude: 'node_modules/**' }),
      terser(),
      //nodePolyfills(),
    ],
    },
  
    // CommonJS
  
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/cjs/index.cjs.min.js',
            format: 'cjs',
            indent: false,
        },
        plugins: [
            typescript(),
            babel({ extensions: ['.ts'], exclude: 'node_modules/**' }),
            commonjs()

        ],
    },

    {
      input: 'src/index.ts',
      output: {
          file: 'dist/index.min.js',
          indent: false,
      },
      plugins: [
          typescript(),
          babel({ extensions: ['.ts'], exclude: 'node_modules/**' }),
      ],
    } 
]