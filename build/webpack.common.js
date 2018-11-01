const path = require("path");
const pkg = require("../package.json");

const libName = pkg.name.replace(/[^a-z][a-z0-9]{1}/gi, (n, i, s) =>
  s[i + 1].toUpperCase()
);

const plugins = [];

module.exports = {
  entry: {
    [libName]: "./src/ServiceContainer.js"
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "[name].js",
    library: libName,
    libraryTarget: "umd",
    libraryExport: "default"
  },
  plugins,
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, "../src")],
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  externals: [
    // Everything that starts with "lodash/"
    // /^lodash\/.+$/
  ]
};
