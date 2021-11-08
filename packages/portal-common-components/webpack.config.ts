import path from 'path';
import * as webpack from 'webpack';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

const baseConfig: webpack.Configuration = {
  mode: 'production',
  target: 'web',
  entry: {
    index: path.resolve('src'),
  },
  output: {
    filename: '[name].js',
    path: path.resolve('lib'),
    library: 'NexusUi',
    libraryTarget: 'umd',
    globalObject: 'this',
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.svg$/,
        oneOf: [
          {
            resourceQuery: /external/,
            use: [{
              loader: 'url-loader',
              options: {
                limit: 10000,
              },
            }],
          },
          {
            use: ['@svgr/webpack'],
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        oneOf: [
          {
            resourceQuery: /external/,
            use: [{
              loader: 'file-loader',
              options: {
                name: 'static/[name].[ext]',
              },
            }],
          },
          {
            use: [{
              loader: 'url-loader',
              options: {
                limit: 10000,
                name: 'static/images/[contenthash].[ext]',
              },
            }],
          },
        ],
      },
      {
        exclude: [
          /\.[tj]sx?$/,
          /\.css$/,
          /\.svg$/,
          /\.(jpe?g|png|gif)$/i,
          /\.json$/,
          /\.html$/,
          /\.ejs$/,
        ],
        use: [{
          loader: 'file-loader',
          options: { name: 'static/[name].[ext]' },
        }],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
    plugins: [
      new TsconfigPathsPlugin() as any,
    ],
    alias: {
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    }
  },
  externals: {
    react: {
      commonjs: "react",
      commonjs2: "react",
      amd: "React",
      root: "React"
    },
    "react-dom": {
      commonjs: "react-dom",
      commonjs2: "react-dom",
      amd: "ReactDOM",
      root: "ReactDOM"
    }
  }
};

module.exports = baseConfig;
