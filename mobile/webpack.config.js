const webpack = require('webpack');

module.exports = (webpackConfig, env) => {
    // webpackConfig.output.chunkFilename = '[name].[chunkhash].js';

    webpackConfig.output.filename = '[name].bundle.[hash].js';

    return webpackConfig;
}