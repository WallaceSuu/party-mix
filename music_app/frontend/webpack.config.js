const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js", // Entry file for the React app
  output: {
    path: path.resolve(__dirname, "build"), // Output to the 'build' folder
    filename: "frontend/main.js", // Output as main.js in the static/js folder
    publicPath: "/static/", // Serve static files from /static/
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
    minimize: true, // Minify the output for production
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
    new HtmlWebpackPlugin({
      template: "./templates/frontend/index.html", // Path to your HTML template
      filename: "index.html", // Output file name for the generated HTML
      minify: false, // Prevent minification of HTML
    }),
  ],
};
