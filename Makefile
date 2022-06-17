local:
	rm -rf dist
	rm -rf out
	yarn package

start:
	yarn start

magic:
	make release
	make upload

upload:
	xcrun altool --validate-app -f ${shell find dist/mas-universal -name "*.pkg" | head -n 1} -u ${APPLE_ID} -p ${APPLE_PASSWORD} --type macos
	xcrun altool --upload-app -f ${shell find dist/mas-universal -name "*.pkg" | head -n 1} -u ${APPLE_ID} -p ${APPLE_PASSWORD} --type macos

icons:
	cp build/512x512@2x.png build/icon.png
	cp build/Artwork.png src/favicon.png

release:
	rm -rf dist
	rm -rf out
	make icons
	yarn dist

patch:
	yarn version --patch
	make magic

minor:
	yarn version --minor
	make magic
