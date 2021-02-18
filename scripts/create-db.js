const sqlite3 = require('sqlite3').verbose()
const fs = require('fs')
const path = require('path')
const util = require('./util')
const { DOCSET_NAME } = require('./constants')
const { capitalCase } = require('capital-case')

const dbFilePath = path.join(
  __dirname,
  '..',
  DOCSET_NAME,
  'Contents/Resources/docSet.dsidx'
)
try {
  fs.unlinkSync(dbFilePath)
} catch {}
const db = new sqlite3.Database(dbFilePath)

db.serialize(() => {
  db.run(
    'CREATE TABLE searchIndex(id INTEGER PRIMARY KEY, name TEXT, type TEXT, path TEXT)'
  )
  db.run('CREATE UNIQUE INDEX anchor ON searchIndex (name, type, path);')

  const stmt = db.prepare(
    'INSERT OR IGNORE INTO searchIndex(name, type, path) VALUES (?, ?, ?)'
  )
  util.uncategorisedNames.forEach((name) => {
    stmt.run(util.getTitle(`/docs/${name}.md`), 'Guide', `docs/${name}.html`)
  })
  util.advancedFeaturesNames.forEach((name) => {
    stmt.run(
      util.getTitle(`/docs/advanced-features/${name}.md`),
      'Guide',
      `docs/advanced-features/${name}.html`
    )
  })
  util.advancedFeaturesAmpSupportNames.forEach((name) => {
    stmt.run(
      util.getTitle(`/docs/advanced-features/amp-support/${name}.md`),
      'Guide',
      `docs/advanced-features/amp-support/${name}.html`
    )
  })
  util.apiReference.forEach((name) => {
    stmt.run(
      util.getTitle(`/docs/api-reference/${name}.md`),
      'Guide',
      `docs/api-reference/${name}.html`
    )
  })
  util.apiReferenceDataFetching.forEach((name) => {
    stmt.run(
      util.getTitle(`/docs/api-reference/data-fetching/${name}.md`),
      'Guide',
      `docs/api-reference/data-fetching/${name}.html`
    )
  })
  util.apiReferenceNext.forEach((name) => {
    stmt.run(
      util.getTitle(`/docs/api-reference/next/${name}.md`),
      'Module',
      `docs/api-reference/next/${name}.html`
    )
  })
  util.apiReferenceNextConfigJs.forEach((name) => {
    stmt.run(
      util.getTitle(`/docs/api-reference/next.config.js/${name}.md`),
      'Environment',
      `docs/api-reference/next.config.js/${name}.html`
    )
  })
  util.basicFeatures.forEach((name) => {
    stmt.run(
      util.getTitle(`/docs/basic-features/${name}.md`),
      'Guide',
      `docs/basic-features/${name}.html`
    )
  })
  util.migrating.forEach((name) => {
    stmt.run(
      util.getTitle(`/docs/migrating/${name}.md`),
      'Guide',
      `docs/migrating/${name}.html`
    )
  })
  util.routing.forEach((name) => {
    stmt.run(
      util.getTitle(`/docs/routing/${name}.md`),
      'Guide',
      `docs/routing/${name}.html`
    )
  })
  util.errorsNames.forEach((name) => {
    stmt.run(capitalCase(name), 'Error', `errors/${name}.html`)
  })
  stmt.finalize()
})

db.close()
