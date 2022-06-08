module.exports = {
    "packagerConfig": {
        "appBundleId": "app.unixtime"
      },
      "makers": [
        {
          "name": "@electron-forge/maker-zip",
          "platforms": [
            "darwin"
          ]
        },
        {
          "name": "@electron-forge/maker-pkg",
          "config": {}
        }
      ]
    }
