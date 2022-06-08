const { makeUniversalApp } = require ('@electron/universal')

async function make() {
await makeUniversalApp({
  x64AppPath: '/Users/kb1/versioned/unixtimeapp/out/unixtime-darwin-arm64/unixtime.app',
  arm64AppPath: '/Users/kb1/versioned/unixtimeapp/out/unixtime-darwin-x64/unixtime.app',
    outAppPath: '/Users/kb1/versioned/unixtimeapp/out/unixtime-darwin-universal/unixtime.app',
});

}

make()
