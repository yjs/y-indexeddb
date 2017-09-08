var pkg = require('./package.json')

export default {
  entry: 'src/y-indexeddb.js',
  moduleName: 'yIndexeddb',
  format: 'umd',
  dest: 'y-indexeddb.node.js',
  sourceMap: true,
  banner: `
/**
 * ${pkg.name} - ${pkg.description}
 * @version v${pkg.version}
 * @license ${pkg.license}
 */
`
}
