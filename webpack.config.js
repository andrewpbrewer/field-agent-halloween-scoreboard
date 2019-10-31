const path = require("path");
const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');

module.exports = {
  mode: 'development',

  context: __dirname,

  entry: './js/app',

  output: {
        path: path.resolve('./js/bundles/'),
        filename: "[name].js",
  },

  module: {
    rules: [
        {
            test: /\.vue$/,
            exclude: /node_modules/,
            loader: 'vue-loader'
        },
        {
            test: /\.css$/,
            use: [
              'vue-style-loader',
              'css-loader'
            ]
        },
        {
            test: /\.s(c|a)ss$/,
            use: [
                'vue-style-loader',
                'css-loader',
                {
                    loader: 'sass-loader',
                    options: {
                        implementation: require('sass'),
                        sassOptions: {
                            fiber: require('fibers'),
                            indentedSyntax: true // optional
                        },
                    }
                }
            ]
        }
    ]
  },

  plugins: [
        new CleanWebpackPlugin(),
        new BundleTracker({filename: './webpack-stats.json'}),
        new VuetifyLoaderPlugin(),
        new VueLoaderPlugin(),
  ],

  resolve: {
        modules: ['node_modules'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1
        }
  },
}