var bundler = require("nativescript-dev-webpack");

module.exports = bundler.getConfig({
    // TODO: add project-specific webpack settings here...

   module: {
        loaders: [
            { test: /\.js$/, loader: __dirname + "/extendfixer.js" }
        ]
    }
});
