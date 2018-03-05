const webpack = require('webpack');

module.exports = {
  entry:  './wrapper.js',
  stats: {
    warnings: false,
    errors: false,
  },
  output: {
      libraryTarget: 'var',
      library: 'PatientList',
      path:     './builds',
      filename: 'patientList.min.js',
  },
  module: {
      loaders: [
          {
              test:   /\.js/,
              loader: 'babel',
              include: __dirname,
          },
          {
            test: /\.css$/,
            loaders: ['style-loader', 'css-loader']
          },
          {
            test: /\.(png|jpg|svg)$/,
            loader: 'url-loader'
          },
      ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ],
};
