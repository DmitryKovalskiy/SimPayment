'use strict';

const path = require('path');
const RESOURCE_PATH = path.resolve('resource');
const NODE_MODULES_PATH = path.resolve('node_modules');

module.exports = {

    devtool: 'source-map',
    context: path.resolve(__dirname, '..', RESOURCE_PATH),
    
    stats: {
        colors: true,
        reasons: true
    },
    
    module: {
        loaders: [
            // PRE LOADERS
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                include: RESOURCE_PATH,
                enforce: 'pre',
                loader: `preprocess-loader?+DEVELOPMENT_INTEGRATION&NODE_ENV=development`
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
                test: /\.html$/,
                exclude: /(node_modules|scss|images|fonts)/,
                include: /(templates|js)/,
                enforce: 'post',
                use: [{
                    loader: 'html-loader'
                }, {
                    loader: 'preprocess-loader'
                }]
            }
        ]
    },
    
    resolve: {
        modules: [
            NODE_MODULES_PATH,
            RESOURCE_PATH
        ],
        extensions: ['.js', '.jsx']
    }
};