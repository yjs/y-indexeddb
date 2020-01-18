import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default [{
  input: './tests/index.js',
  output: {
    file: './dist/test.js',
    format: 'iife',
    sourcemap: true
  },
  plugins: [
    resolve({ mainFields: ['module', 'browser', 'main'] }),
    commonjs()
  ]
}, {
  input: './src/y-indexeddb.js',
  output: {
    name: 'Y',
    file: 'dist/y-indexeddb.cjs',
    format: 'cjs',
    sourcemap: true,
    paths: path => {
      if (/^lib0\//.test(path)) {
        return `lib0/dist/${path.slice(5, -3)}.cjs`
      }
      return path
    }
  },
  external: id => /^(lib0|yjs)\//.test(id)
}]
