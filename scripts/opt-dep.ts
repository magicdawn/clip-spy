#!/usr/bin/env ts-node-script

// "prepublishOnly": "./scripts/opt-dep.ts --add",
// "postpublish": "./scripts/opt-dep.ts --remove",

import fse from 'fs-extra'
import path from 'path'

const pkgJsonFile = path.join(__dirname, '../package.json')

function add() {
  const pkg = fse.readJsonSync(pkgJsonFile)

  const moreOptDeps = {}
  const dirs = [__dirname + '../npm/darwin-arm64/', __dirname + '../npm/darwin-x64/']
  for (let d of dirs) {
    const pkgJsonFile = path.join(d, 'package.json')
    const pkg = require(pkgJsonFile)
    moreOptDeps[pkg.name] = pkg.version
  }

  pkg.optionalDependencies = {...pkg.optionalDependencies, ...moreOptDeps}
  fse.writeJSONSync(pkgJsonFile, pkg, {spaces: 2})
}

function remove() {
  const pkg = fse.readJsonSync(pkgJsonFile)
  delete pkg.optionalDependencies
  fse.writeJSONSync(pkgJsonFile, pkg, {spaces: 2})
}

function main() {
  if (process.argv.includes('--add')) {
    return add()
  }

  if (process.argv.includes('--remove')) {
    return remove()
  }
}

main()
