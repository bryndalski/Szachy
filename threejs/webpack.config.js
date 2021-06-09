var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: './bundle.js'
    },
    mode: 'development',
    devServer: {
        port: 8080,
        index: './src/index.html',
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            filename: './src/index.html',
            template: './src/index.html',
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jp(e*)g|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8000, // Convert images < 8kb to base64 strings
                        name: 'images/[hash]-[name].[ext]'
                    }
                }]
            },
            {
                test: /\.(glb)$/i,
                type: 'asset/resource',
            },
        ]
    },
};