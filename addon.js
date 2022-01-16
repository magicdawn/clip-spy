const { existsSync, readFileSync } = require('fs')
const { join } = require('path')

const { platform, arch } = process

let nativeBinding = null
let localFileExisted = false
let loadError = null

function isMusl() {
  // For Node 10
  if (!process.report || typeof process.report.getReport !== 'function') {
    try {
      return readFileSync('/usr/bin/ldd', 'utf8').includes('musl')
    } catch (e) {
      return false
    }
  } else {
    const { glibcVersionRuntime } = process.report.getReport().header
    return !Boolean(glibcVersionRuntime)
  }
}

switch (platform) {
  case 'android':
    if (arch !== 'arm64') {
      throw new Error(`Unsupported architecture on Android ${arch}`)
    }
    localFileExisted = existsSync(join(__dirname, 'clip-spy.android-arm64.node'))
    try {
      if (localFileExisted) {
        nativeBinding = require('./clip-spy.android-arm64.node')
      } else {
        nativeBinding = require('@magicdawn/clip-spy-android-arm64')
      }
    } catch (e) {
      loadError = e
    }
    break
  case 'win32':
    switch (arch) {
      case 'x64':
        localFileExisted = existsSync(
          join(__dirname, 'clip-spy.win32-x64-msvc.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./clip-spy.win32-x64-msvc.node')
          } else {
            nativeBinding = require('@magicdawn/clip-spy-win32-x64-msvc')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'ia32':
        localFileExisted = existsSync(
          join(__dirname, 'clip-spy.win32-ia32-msvc.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./clip-spy.win32-ia32-msvc.node')
          } else {
            nativeBinding = require('@magicdawn/clip-spy-win32-ia32-msvc')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'arm64':
        localFileExisted = existsSync(
          join(__dirname, 'clip-spy.win32-arm64-msvc.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./clip-spy.win32-arm64-msvc.node')
          } else {
            nativeBinding = require('@magicdawn/clip-spy-win32-arm64-msvc')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on Windows: ${arch}`)
    }
    break
  case 'darwin':
    switch (arch) {
      case 'x64':
        localFileExisted = existsSync(join(__dirname, 'clip-spy.darwin-x64.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./clip-spy.darwin-x64.node')
          } else {
            nativeBinding = require('@magicdawn/clip-spy-darwin-x64')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'arm64':
        localFileExisted = existsSync(
          join(__dirname, 'clip-spy.darwin-arm64.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./clip-spy.darwin-arm64.node')
          } else {
            nativeBinding = require('@magicdawn/clip-spy-darwin-arm64')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on macOS: ${arch}`)
    }
    break
  case 'freebsd':
    if (arch !== 'x64') {
      throw new Error(`Unsupported architecture on FreeBSD: ${arch}`)
    }
    localFileExisted = existsSync(join(__dirname, 'clip-spy.freebsd-x64.node'))
    try {
      if (localFileExisted) {
        nativeBinding = require('./clip-spy.freebsd-x64.node')
      } else {
        nativeBinding = require('@magicdawn/clip-spy-freebsd-x64')
      }
    } catch (e) {
      loadError = e
    }
    break
  case 'linux':
    switch (arch) {
      case 'x64':
        if (isMusl()) {
          localFileExisted = existsSync(
            join(__dirname, 'clip-spy.linux-x64-musl.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./clip-spy.linux-x64-musl.node')
            } else {
              nativeBinding = require('@magicdawn/clip-spy-linux-x64-musl')
            }
          } catch (e) {
            loadError = e
          }
        } else {
          localFileExisted = existsSync(
            join(__dirname, 'clip-spy.linux-x64-gnu.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./clip-spy.linux-x64-gnu.node')
            } else {
              nativeBinding = require('@magicdawn/clip-spy-linux-x64-gnu')
            }
          } catch (e) {
            loadError = e
          }
        }
        break
      case 'arm64':
        if (isMusl()) {
          localFileExisted = existsSync(
            join(__dirname, 'clip-spy.linux-arm64-musl.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./clip-spy.linux-arm64-musl.node')
            } else {
              nativeBinding = require('@magicdawn/clip-spy-linux-arm64-musl')
            }
          } catch (e) {
            loadError = e
          }
        } else {
          localFileExisted = existsSync(
            join(__dirname, 'clip-spy.linux-arm64-gnu.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./clip-spy.linux-arm64-gnu.node')
            } else {
              nativeBinding = require('@magicdawn/clip-spy-linux-arm64-gnu')
            }
          } catch (e) {
            loadError = e
          }
        }
        break
      case 'arm':
        localFileExisted = existsSync(
          join(__dirname, 'clip-spy.linux-arm-gnueabihf.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./clip-spy.linux-arm-gnueabihf.node')
          } else {
            nativeBinding = require('@magicdawn/clip-spy-linux-arm-gnueabihf')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on Linux: ${arch}`)
    }
    break
  default:
    throw new Error(`Unsupported OS: ${platform}, architecture: ${arch}`)
}

if (!nativeBinding) {
  if (loadError) {
    throw loadError
  }
  throw new Error(`Failed to load native binding`)
}

const { clipRead, clipWrite, mozjpegTest, test, test2 } = nativeBinding

module.exports.clipRead = clipRead
module.exports.clipWrite = clipWrite
module.exports.mozjpegTest = mozjpegTest
module.exports.test = test
module.exports.test2 = test2
