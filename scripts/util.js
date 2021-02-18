const path = require('path')
const fs = require('fs')
const manifest = require('../docs/manifest.json')

const docsDir = path.join(__dirname, '../docs')
const errorsDir = path.join(__dirname, '../errors')
const advancedFeaturesDir = path.join(docsDir, 'advanced-features')
const advancedFeaturesAmpSupportDir = path.join(
  advancedFeaturesDir,
  'amp-support'
)
const apiReference = path.join(docsDir, 'api-reference')
const apiReferenceDataFetching = path.join(apiReference, 'data-fetching')
const apiReferenceNext = path.join(apiReference, 'next')
const apiReferenceNextConfigJs = path.join(apiReference, 'next.config.js')
const apiRoutes = path.join(docsDir, 'api-routes')
const basicFeatures = path.join(docsDir, 'basic-features')
const migrating = path.join(docsDir, 'migrating')
const routing = path.join(docsDir, 'routing')

exports.uncategorisedNames = getBasenamesOn(docsDir)
exports.advancedFeaturesNames = getBasenamesOn(advancedFeaturesDir)
exports.advancedFeaturesAmpSupportNames = getBasenamesOn(
  advancedFeaturesAmpSupportDir
)
exports.apiReference = getBasenamesOn(apiReference)
exports.apiReferenceDataFetching = getBasenamesOn(apiReferenceDataFetching)
exports.apiReferenceNext = getBasenamesOn(apiReferenceNext)
exports.apiReferenceNextConfigJs = getBasenamesOn(apiReferenceNextConfigJs)
exports.apiRoutes = getBasenamesOn(apiRoutes)
exports.basicFeatures = getBasenamesOn(basicFeatures)
exports.migrating = getBasenamesOn(migrating)
exports.routing = getBasenamesOn(routing)
exports.errorsNames = getBasenamesOn(errorsDir)

/**
 *
 * @param {string} dirPath
 * @returns {string[]}
 */
function getBasenamesOn(dirPath) {
  return fs
    .readdirSync(dirPath)
    .filter((name) => {
      return (
        fs.statSync(path.join(dirPath, name)).isFile() && name.endsWith('.md')
      )
    })
    .map((filename) => path.basename(filename, '.md'))
}

/**
 *
 * @param {string} pathname
 * @returns {string} title like breadcrumb
 */
exports.getTitle = (pathname) => {
  const collect = (routes, _titles) => {
    return routes.map((route) => {
      let titles = [..._titles]
      if (typeof route.title === 'string') {
        titles.push(route.title)
      }

      if (typeof route.path === 'string') {
        return {
          titles,
          path: route.path
        }
      }

      if (Array.isArray(route.routes)) {
        return collect(route.routes, titles)
      }
    })
  }

  const collection = collect(manifest.routes, []).flat(Infinity)

  const target = collection.find((item) => item.path === pathname)
  if (target === undefined) {
    throw new Error(`unknown path: ${pathname}`)
  }

  return target.titles.join(' / ')
}
