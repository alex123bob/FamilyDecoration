const webpack = require('webpack');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (webpackConfig, env) => {
    webpackConfig.entry = {
        app: './src/index.js',
        vendor: ['lodash', 'dva', 'react', 'react-redux', 'redux']
    };

    webpackConfig.output = {
        filename: '[name].bundle.js',
        path: __dirname + '/dist',
        publicPath: env === 'production' ? './' : '/' // publicPath could be configured to any other address especially for CDN distribution in the future if needed.
    };

    webpackConfig.plugins = webpackConfig.plugins.concat(
        [
            new HtmlWebpackPlugin(
                {
                    template: 'src/index.ejs',
                    minify: env === 'production' ? {
                        collapseWhitespace: true
                    } : false,
                    hash: false // this determines wheter to append hash to the end of each linked resources, start with a question mark.
                }
            ),

            new webpack.optimize.CommonsChunkPlugin(
                {
                    names: ['vendor'],
                    filename: 'vendor.js',
                    minChunks: Infinity
                }
            ),

            // this is just for generating bundle report. for future analysis.
            // new BundleAnalyzerPlugin({
            //     analyzerMode: 'static'
            // })
        ]
    );

    return webpackConfig;
}