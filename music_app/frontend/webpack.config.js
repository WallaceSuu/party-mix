const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "build"), // Output to 'build' folder
    filename: "static/js/bundle.js", // Store in static/js/
    publicPath: "/static/", // Serve from /static/
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/, // Handle CSS files
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/, // Handle image files
        type: "asset/resource",
        generator: {
          filename: "static/media/[hash][ext][query]", // Store images in static/media/
        },
      },
    ],
  },
  optimization: {
    minimize: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
    new HtmlWebpackPlugin({
      template: "./templates/frontend/index.html", // Path to your HTML template
      filename: "index.html", // Output file name for the generated HTML
      minify: false,
    }),
  ],
};
