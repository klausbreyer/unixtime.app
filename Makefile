start:
	rm -rf dist-parcel
	yarn run parcel src/index.html

magic:
	rm -rf dist-parcel && yarn run parcel build src/index.html --public-url / --dist-dir dist-parcel && cp src/images/* dist-parcel/images/ && cp src/favicon.ico dist-parcel
