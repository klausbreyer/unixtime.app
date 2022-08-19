start:
	make start-electron & make start-parcel

start-electron:
	yarn run electron-forge start

start-parcel:
	rm -rf dist-parcel
	yarn run parcel src/index.html

patch:
	yarn version --patch
	make magic

minor:
	yarn version --minor
	make magic

magic:
	make build-parcel
	make magic-electron

build-parcel:
	rm -rf dist-parcel
	yarn run parcel  build src/index.html --public-url . --dist-dir dist-parcel

magic-electron:
	make build-electron
	make upload

build-electron:
	rm -rf dist
	rm -rf out
	make icons
	yarn run electron-builder

upload:
	xcrun altool --validate-app -f ${shell find dist/mas-universal -name "*.pkg" | head -n 1} -u ${APPLE_ID} -p ${APPLE_PASSWORD} --type macos
	xcrun altool --upload-app -f ${shell find dist/mas-universal -name "*.pkg" | head -n 1} -u ${APPLE_ID} -p ${APPLE_PASSWORD} --type macos

icons:
	cp build/512x512@2x.png build/icon.png
	cp build/Artwork.png src/favicon.png

# local
package-electron:
	rm -rf dist
	rm -rf out
	yarn run electron-forge package

# just to create the favicon.ico
icon:
	convert -resize x16 -gravity center -crop 16x16+0+0 src/images/logo.png -flatten -colors 256 -background transparent src/favicon.ico
	convert src/images/logo.png  -resize 512x512 src/images/logo-512x512.png
	convert src/images/logo.png  -resize 192x192 src/images/logo-192x192.png
	convert src/images/logo.png  -resize 256x256 src/images/logo-256x256.png
	convert src/images/logo.png  -resize 384x384 src/images/logo-384x384.png



#unused
# yarn run electron-builder --dir
