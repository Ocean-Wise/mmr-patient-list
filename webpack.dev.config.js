module.exports = {
  entry:  './wrapper.js',
  output: {
      libraryTarget: 'var',
      library: 'PatientList',
      path:     '/Users/ethan/Projects/reactEmbed/builds',
      filename: 'patientList.js',
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
      ],
  },
};
