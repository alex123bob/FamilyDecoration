const webpack = require('webpack');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (webpackConfig, env) => {
    // webpackConfig.output.chunkFilename = '[name].[chunkhash].js';

    // webpackConfig.output.filename = '[name].bundle.[hash].js';

    webpackConfig.plugins = webpackConfig.plugins.concat(
        [
            new BundleAnalyzerPlugin({
                analyzerMode: 'static'
            })
        ]
    );

    return webpackConfig;
}