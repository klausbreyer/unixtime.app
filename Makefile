wails:
	wails build -platform darwin/arm64 -clean

sign:
	./build/tools/gon -log-level=info -log-json ./build/darwin/gon-sign.json

pkg:
	pkgbuild  --component ./build/bin/unixtime.app ./build/arm64/unixtime.pkg

upload:
	xcrun altool --upload-app -f ./build/arm64/unixtime.pkg -t macos -u kb@v01.io -p ${APPLE_PASSWORD}
