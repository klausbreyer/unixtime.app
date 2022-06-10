start:
	yarn start

magic:
	yarn dist
	make upload

upload:
	xcrun altool --validate-app -f dist/mas-universal/unixtime-0.1.0-universal.pkg -u ${APPLE_ID} -p ${APPLE_PASSWORD} --type macos
	xcrun altool --upload-app -f dist/mas-universal/unixtime-0.1.0-universal.pkg -u ${APPLE_ID} -p ${APPLE_PASSWORD} --type macos
