import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
var pkg = require('./package.json')

export default {
  input: 'src/y-indexeddb.js',
  nameame: 'extendYIndexedDBPersistence',
  sourcemap: true,
  output: {
    file: 'y-indexeddb.node.js',
    format: 'cjs'
  },
  plugins: [
    nodeResolve({
      main: true,
      module: true,
      browser: true
    }),
    commonjs()
  ],
  banner: `
/**
 * ${pkg.name} - ${pkg.description}
 * @version v${pkg.version}
 * @license ${pkg.license}
 */
`
}
