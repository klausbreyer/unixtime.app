universal:
	yarn electron-forge package --arch x64
	yarn electron-forge package --arch arm64
	node universal.js
	sh sign.sh
