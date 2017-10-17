var webpack = require('webpack');

module.exports = {
    entry: {
        app: './assets/js/app.js'
    },
    output: {
        filename: './bundle.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel',
            exclude: /node_modules/
        }]
    }
}