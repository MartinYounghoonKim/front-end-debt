const path = require("path");
const CustomWebpackPlugin = require("./CustomWebpackPlugin");
const webpack = require("webpack");
const childProcess = require("child_process");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const apiMocker = require("connect-api-mocker");
const OptimizeCSSAssertsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const mode = process.env.NODE_ENV || "development";

/**
 * @description
 * mode가 development 일 경우, 아래의 두개의 플러그인을 사용
 * 1. NamedChunksPlugin
 * 2. NamedModulesPlugin
 *
 * mode가 production 일 경우, 아래의 일곱개의 플러그인을 사용
 * 1. FlagDependencyUsagePlugin
 * 2. FlagIncludedChunksPlugin
 * 3. ModuleConcatenationPlugin
 * 4. NoEmitOnErrorsPlugin
 * 5. OccurrenceOrderPlugin
 * 6. SideEffectsFalgPlugin
 * 7. TerserPlugin (javascript 를 난독화 하고, debugger 구문을 제거 및 콘솔 제거 옵션도 제공)
 */
module.exports = {
  mode,
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
    before: app => {
      app.use(apiMocker("/api", "mocks/api"));
    },
    proxy: {
      "/api": "http://localhost:8081",
    },
    hot: true,
  },
  optimization: {
    minimizer:
      mode === "production"
        ? [
            new OptimizeCSSAssertsPlugin(),
            new TerserPlugin({
              terserOptions: {
                compress: {
                  drop_console: true, // console.log 제거
                },
              },
            }),
          ]
        : [],
    splitChunks: {
      chunks: "all",         // 중복 코드 제거 (vendor 안으로 모아버림)
      // chunks: "async",    // 동적 임포트 코드만 분할하도록 설정
      // minSize: 30 * 1000, // 파일 크기가 30kb 이상일 경우 chunking 대상이 된다.
      // minChunks: 1,       // 1 개 이상의 청크에 포함되어야 함
      cacheGroups: {         // 캐시 그룹은 2개로 나뉨 외부 모듈(defaultVendors)와 내부모듈(default)
        default: {          
          minChunks: 2,
          priority: -20,
          resuseExistingChunk: true,
        }
      }
    },
  },
  /**
   * @description
   * axios 라이브러리와 같은 써드파티는 이미 빌드 결과물을 제공하기 때문에 빌드 과정을 거칠 필요가 없음.
   * 이런 파일은 빌드 과정에서 제외
   */
  externals: {
    axios: "axios",
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
    new CopyPlugin({
      patterns: [
        {
          from: "./node_modules/axios/dist/axios.min.js",
          to: "./axios.min.js",
        },
      ],
    }),
  ],
};
