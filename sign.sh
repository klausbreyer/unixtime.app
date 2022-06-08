signID='Developer ID Installer: klaus breyer (F9C2G96HYP)'

productbuild --component '/Users/kb1/versioned/unixtimeapp/out/unixtime-darwin-universal/unixtime.app' /Applications --sign "$signID" --product '/Users/kb1/versioned/unixtimeapp/out/unixtime-darwin-universal/unixtime.app/Contents/Info.plist' /Users/kb1/versioned/unixtimeapp/out/build.pkg

echo "productbuild success"

productsign --sign "$signID" /Users/kb1/versioned/unixtimeapp/out/build.pkg  /Users/kb1/versioned/unixtimeapp/out/success.pkg

echo "productsign success"
