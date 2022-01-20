#!/usr/bin/env ts-node-script

import path from 'path'
import fse from 'fs-extra'
import {execSync, ExecSyncOptions} from 'child_process'

const projectRoot = path.join(__dirname, '..')

const exec = (cmd: string, options: ExecSyncOptions = {cwd: projectRoot}) => {
  console.log(`[exec]: %s`, cmd)
  execSync(cmd, {stdio: 'inherit', ...options})
}

async function main() {
  // exec('git status')

  exec('yarn build:addon --target=x86_64-apple-darwin')
  exec('yarn build:addon --target=aarch64-apple-darwin')

  // 需要 msvc link.exe
  // note: the msvc targets depend on the msvc linker but `link.exe` was not found
  // note: please ensure that VS 2013, VS 2015, VS 2017 or VS 2019 was installed with the Visual C++ option
  // exec('yarn build:addon --target=x86_64-pc-windows-msvc')

  // = note: ld: unknown option: --version-script=/var/folders/p3/8x7mfff1475dbphhtx3vtp500000gn/T/rustcpz78M3/list
  // clang: error: linker command failed with exit code 1 (use -v to see invocation)
  // exec('yarn build:addon --target=x86_64-unknown-linux-gnu')

  fse.moveSync(
    projectRoot + '/clip-spy.darwin-x64.node',
    projectRoot + '/npm/darwin-x64/clip-spy.darwin-x64.node'
  )
  fse.moveSync(
    projectRoot + '/clip-spy.darwin-arm64.node',
    projectRoot + '/npm/darwin-arm64/clip-spy.darwin-arm64.node'
  )
  const dirs = [projectRoot + '/npm/darwin-arm64/', projectRoot + '/npm/darwin-x64/']

  const latest = require(dirs[0] + 'package.json').version.split('.')[2]
  const newVersion = `0.0.${Number(latest) + 1}`
  const optionalDependencies: Record<string, string> = {}

  // patch version number
  for (let d of dirs) {
    const pkgJsonFile = d + 'package.json'
    const pkg = fse.readJSONSync(pkgJsonFile)
    pkg.version = newVersion
    optionalDependencies[pkg.name] = newVersion
    fse.writeJSONSync(pkgJsonFile, pkg, {spaces: 2})
  }

  // switch to npm
  exec('nrm use npm')

  // publish new version
  for (let d of dirs) {
    process.chdir(d)
    exec('npm publish --access public', {cwd: d})
  }
}

main()
