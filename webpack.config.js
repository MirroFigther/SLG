var webpack = require('webpack');
var path = require('path');


var commonsPlugin = new webpack.optimize.CommonsChunkPlugin({
            name:'vendor', // 注意不要.js后缀
            chunks:['jquery','cookie']
        });
//var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('vendor.js');
var providePlugin = new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery"
});

module.exports = {
    entry: {
        main_min: './main.js',
        dom_min:'./dom.js',
        vendor: ['jquery',  'cookie','bootstrap','table'],
    },
    output: {
        filename: '[name].js'
    },
    resolve: {
        alias: {
            'jquery': __dirname + "/js/jquery.js",
            'global': __dirname + "/classes/global.js",
            'cookie': __dirname + '/js/jquery.cookie.js',
            'bootstrap': __dirname + '/js/bootstrap.js',
            'table': __dirname + '/js/bootstrap-table.min.js',
        },
       extensions: ['', '.js', '.es6']
    },
    module: {
      loaders: [{
        test: /\.css$/,
        loaders: ['style', 'css']
      },
      // {
      //   test: /\.js$/,
      //   loaders: ['babel'],
      //   include: path.join(__dirname, 'src'),
      //   query: {
      //     presets: ['es2015']
      //   }
      // },
      // {
      //     test: /\.js$/,
      //     loader: 'babel-loader',
      //     include: path.join(__dirname, 'src'),
      //     exclude: path.resolve(__dirname, 'node_modules'), //编译时，不需要编译哪些文件*/
      //     /*include: path.resolve(__dirname, 'src'),//在config中查看 编译时，需要包含哪些文件*/
      //     query: {
      //         presets: ['es2015'] //按照最新的ES6语法规则去转换
      //     }
      // }
    ]
    },
    plugins: [commonsPlugin, providePlugin]
};
