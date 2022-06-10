start:
	yarn start

magic:
	rm -rf dist
	# yarn version --patch
	yarn dist
	make upload

upload:
	xcrun altool --validate-app -f ${shell find dist/mas-universal -name "*.pkg" | head -n 1} -u ${APPLE_ID} -p ${APPLE_PASSWORD} --type macos
	xcrun altool --upload-app -f ${shell find dist/mas-universal -name "*.pkg" | head -n 1} -u ${APPLE_ID} -p ${APPLE_PASSWORD} --type macos
