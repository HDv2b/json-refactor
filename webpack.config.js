// For instructions about this file refer to
// webpack and webpack-hot-middleware documentation

var webpack = require('webpack');
var path = require('path');

module.exports = {
    debug: true,
    devtool: '#eval-source-map',
    context: path.join(__dirname, 'src'),
    resolve: {
        root: path.resolve('./src'),
        extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx'],
    },
    entry: [
        'webpack/hot/dev-server',
        'webpack-hot-middleware/client',
        './index',
    ],
    output: {
        path: path.join(__dirname, 'src'),
        publicPath: '/',
        filename: 'bundle.js',
    },

    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
    ],

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: ['react-hot', 'babel']
            },
            {
                test: /\.scss$/,
                loaders: ['style', 'css', 'sass']
            }
        ],
        rules: []
    }
}