'use strict';

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

// const VERSION = process.env.npm_package_version;
const PRODUCTION_PATH = path.resolve('production');
const RESOURCE_PATH = path.resolve('src');
const NODE_MODULES_PATH = path.resolve('node_modules');
// const VERSION_PATH = path.join(PRODUCTION_PATH, '/version_' + VERSION);
const VERSION_PATH = path.join(PRODUCTION_PATH, 'webapp');

const isForProduction = (process.env.NODE_ENV === 'development');

try {
    fs.accessSync(PRODUCTION_PATH);
} catch (e) {
    fs.mkdirSync(PRODUCTION_PATH);
}

try {
    fs.accessSync(VERSION_PATH);
} catch (e) {
    fs.mkdirSync(VERSION_PATH);
}

module.exports = {

    context: path.resolve(RESOURCE_PATH),

    entry: [
        'babel-polyfill',
        path.posix.join('js', 'webapp', 'main.js'),
        path.posix.join('scss', 'webapp', 'main.scss')
    ],

    output: {
        path: VERSION_PATH,
        publicPath: './../',
        filename: 'assets/[name].js'
    },

    module: {

        rules: [
            // PRE LOADERS
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                include: RESOURCE_PATH,
                enforce: 'pre',
                loader: `jshint-loader`
            },

            // POST LOADERS
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|templates|images|scss|fonts)/,
                include: /(js)/,
                enforce: 'post',
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    presets: [
                        ['env', {
                            'loose': true
                        }],
                        'stage-0',
                        'react'
                    ]
                }
            },
            {
                test: /\.scss$/,
                exclude: /(node_modules|js|templates|images)/,
                include: /(scss|fonts)/,
                enforce: 'post',
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader',
                        options: {
                            cache: true,
                            debug: true,
                            root: path.resolve(__dirname, '..', RESOURCE_PATH)
                        }
                    }, {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                autoprefixer({
                                    cascade: true,
                                    browsers: ['last 10 versions', 'IE 9']
                                })
                            ]
                        }
                    },
                        'sass-loader'
                    ]
                })
            },
            {
                test: /\.html$/,
                exclude: /(node_modules|scss|images|fonts)/,
                include: /(templates|js)/,
                enforce: 'post',
                use: [{
                    loader: 'html-loader'
                }, {
                    loader: 'preprocess-loader'
                }]
            },
            {
                test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                exclude: /(node_modules|scss|js|images|templates)/,
                include: /(fonts)/,
                enforce: 'post',
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    path: './fonts',
                    name: 'assets/fonts/[name].[ext]?[hash]'
                }
            },
            {
                test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
                exclude: /(node_modules|scss|js|images|templates)/,
                include: /(fonts)/,
                enforce: 'post',
                loader: 'file-loader',
                options: {
                    path: './fonts',
                    name: 'assets/fonts/[name].[ext]?[hash]'
                }
            },
            {
                test: /\.(svg|jpg|png|bmp|gif)?$/,
                exclude: /(js|templates|scss|fonts)/,
                include: /(images|node_modules)/,
                enforce: 'post',
                use: [{
                    loader: 'file-loader',
                    options: {
                        path: './images',
                        name: 'assets/images/[name].[ext]?[hash]'
                    }
                }]
            }
        ]
    },

    resolve: {
        modules: [
            RESOURCE_PATH,
            NODE_MODULES_PATH
        ],
        extensions: ['.html', '.scss', '.js', '.jsx']
    },

    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProgressPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.LoaderOptionsPlugin({
            options: {
                htmlLoader: {
                    root: path.resolve('assets'),
                    attrs: ['img:src', 'link:href']
                },
                babel: {
                    presets: ['env', 'stage-0', {
                        'modules': false
                    }],
                    plugins: [
                        ['transform-runtime', {
                            helpers: false,
                            polyfill: true,
                            regenerator: true,
                            moduleName: 'babel-runtime'
                        }]
                    ]
                }
            }
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.ProvidePlugin({
            jQuery: 'jquery'
        }),
        new ExtractTextPlugin({
            filename: 'assets/[name].css',
            allChunks: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            comments: false,
            dropConsole: true,
            compress: {
                sequences: true,
                booleans: true,
                loops: true,
                unused: true,
                warnings: false,
                unsafe: true
            }
        }),
        new HtmlWebpackPlugin({
            template: path.posix.join(RESOURCE_PATH, 'templates', 'index.html'),
            favicon: path.posix.join(RESOURCE_PATH, 'favicon.ico'),
            filename: 'index.html',
            inject: true,
            hash: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new CompressionPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.(js|html)$/,
            threshold: 10240,
            minRatio: 0.8
        })
    ]
};