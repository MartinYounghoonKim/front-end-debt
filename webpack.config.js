const path = require("path");
const CustomWebpackPlugin = require("./CustomWebpackPlugin");
const webpack = require("webpack");
const childProcess = require("child_process");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
module.exports = {
  mode: "development",
  entry: {
    main: "./src/app.js",
  },
  output: {
    path: path.resolve("./dist"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // js 파일 안에서 해석된 css 파일을 DOM 에 동적으로 추가해주는 loader
          // 해석된 css 파일들을 style 태그로 만들어 head 태그 안에 추가해준다.
          // 만약 css 파일로 만들 경우, mini-css-extract-plugin 를 사용하면 된다.
          process.env.NODE_ENV === "production"
            ? MiniCssExtractPlugin.loader
            : "style-loader",
          // js 파일 안에서 css 파일을 해석할 수 있도록 해주는 loader
          "css-loader",
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        // 위의 확장자를 가진 파일을 처리할 수 있도록 해주며, 파일을 그대로 내보내주는 역할을 한다.
        // loader: "file-loader",
        loader: "url-loader",
        options: {
          // publicPath: "./dist/", // file-loader 가 file 을 처리했을 때, 경로 앞에 추가될 경로
          name: "[name].[ext]?[hash]",
          // 60KB 해당 용량 이하로는 url-loader 가 Base64 형태로 변환하며, 그 이상은 file-loader 를 통해 그대로 반환한다.
          limit: 60000,
        },
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        // use: [
        //   path.resolve("./custom-webpack-loader.js")
        // ]
      },
    ],
  },
  devServer: {
    // 정적 파일을 제공할 경로 (default: webpack 의 output)
    // contentBase: path.join(__dirname, "dist"),
    // 브라우저를 통해 접근하는 경로. (default: "/")
    // publicPath: "/",
    // 도메인 설정
    // host: "local.martin.com",
    // port: 8080,
    // 노출될 메시지 레벨, "none", "errors-only", "normal", verbose"
    stats: "errors-only",
    // 404 발생 시, index.html 리다이렉트
    // historyApiFallback: true,
    overlay: true,
  },
  plugins: [
    // new CustomWebpackPlugin(),
    new ESLintPlugin({
      files: "src/**/*.js",
    }),
    new webpack.BannerPlugin({
      banner: `
        Build Date: ${new Date().toLocaleString()}
        Commit Version: ${childProcess.execSync("git rev-parse --short HEAD")}
        Written by. ${childProcess.execSync("git config user.name")}
      `,
    }),
    new webpack.DefinePlugin({
      FOO1: JSON.stringify("FOO"),
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      templateParameters: {
        env: process.env.NODE_ENV === "development" ? "(개발용)" : "",
      },
      minify:
        process.env.NODE_ENV === "production"
          ? { collapseWhitespace: true, removeComments: true }
          : false,
    }),
    new CleanWebpackPlugin(),
    ...(process.env.NODE_ENV === "production"
      ? [new MiniCssExtractPlugin({ filename: "[name].css" })]
      : []),
  ],
};
