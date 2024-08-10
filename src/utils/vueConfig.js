export default function(ucName){
    return `
    const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack');


module.exports = defineConfig({
  publicPath: 'auto',
  configureWebpack: {
    optimization: {
      splitChunks: false
    },
    plugins: [
      new webpack.container.ModuleFederationPlugin({
        name: '${ucName}',
        filename: 'remote-entry.js',
        library: { type: 'var', name: '${ucName}' },
        exposes: {
          './usecase': './src/UseCase/${ucName}/${ucName}.js'
        },

        shared : require("./shared.json")

      }),

    ],


  },
  transpileDependencies: true,
});

    `;
}