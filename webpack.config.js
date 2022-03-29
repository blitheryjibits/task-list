const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");
module.exports = {
    mode: 'development',
    entry: {
        index: "./src/index.js",
        // projects: "./src/modules/projects.js"
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, 'dist'),
        // clean: true,
        publicPath: '/',
    },

    // plugins: [
    //     new HtmlWebpackPlugin({
    //         template: "./src/index.html",
    //         filename: "./index.html"
    //     })
    // ],
}