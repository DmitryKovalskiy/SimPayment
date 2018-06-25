'use strict';

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const DEVELOPMENT_PATH = path.resolve('development');
const RESOURCE_PATH = path.resolve('src');
const NODE_MODULES_PATH = path.resolve('node_modules');

const isForProduction = (process.env.NODE_ENV === 'development');

if (isForProduction) {
    try {
        fs.accessSync(DEVELOPMENT_PATH);
    } catch (e) {
        fs.mkdirSync(DEVELOPMENT_PATH);
    }
}

module.exports = {

    devtool: 'source-map',
    context: path.resolve(__dirname, '..', RESOURCE_PATH),
    
    devServer: {
        historyApiFallback: false,
        hot: false,
        https: false,
        compress: true,
        inline: true
    },
    
    entry: [
        'babel-polyfill',
        path.posix.join('js', 'webapp', 'main.js'),
        path.posix.join('scss', 'webapp', 'main.scss')
    ],

    output: {
        filename: 'assets/[name].js',
        path: path.posix.join(__dirname, '..', DEVELOPMENT_PATH, 'LK'),
        publicPath: isForProduction ? './../' : '/'
    },

    module: {

        rules: [
            // PRE LOADERS
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                enforce: 'pre',
                use: {
                    loader: 'eslint-loader',
                    options: {
                        eslint: {
                            configFile: './../.eslintrc', // this is my helper for resolving paths
                            cache: false,
                        }
                    }
                }
            },
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                include: RESOURCE_PATH,
                enforce: 'pre',
                loader: 'jshint-loader'
            },
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                include: RESOURCE_PATH,
                enforce: 'pre',
                loader: `preprocess-loader?${isForProduction ? '+' : '-'}DEVELOPMENT_INTEGRATION&NODE_ENV=development`
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
            NODE_MODULES_PATH,
            RESOURCE_PATH
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
                'NODE_ENV': JSON.stringify('development')
            }
        }),
        new webpack.DefinePlugin({
            'NODE_ENV': 'development'
        }),
        new webpack.ProvidePlugin({
            jQuery: 'jquery'
        }),
        new HtmlWebpackPlugin({
            template: path.posix.join(RESOURCE_PATH, 'templates', 'index.html'),
            favicon: path.posix.join(RESOURCE_PATH, 'favicon.ico'),
            filename: 'index.html',
            inject: true,
            hash: true
        }),
        new ExtractTextPlugin({
            filename: 'assets/[name].css',
            allChunks: true
        })
    ]
};