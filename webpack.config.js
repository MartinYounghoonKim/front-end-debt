const path = require("path");
module.exports = {
  mode: "development",
  entry: {
    main: "./src/app.js"
  },
  output: {
    path: path.resolve("./dist"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // js 파일 안에서 해석된 css 파일을 DOM 에 동적으로 추가해주는 loader
          // 해석된 css 파일들을 style 태그로 만들어 head 태그 안에 추가해준다.
          // 만약 css 파일로 만들 경우, mini-css-extract-plugin 를 사용하면 된다.
          "style-loader",
          // js 파일 안에서 css 파일을 해석할 수 있도록 해주는 loader
          "css-loader"
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        // 위의 확장자를 가진 파일을 처리할 수 있도록 해주며, 파일을 그대로 내보내주는 역할을 한다.
        // loader: "file-loader",
        loader: "url-loader",
        options: {
          publicPath: "./dist/", // file-loader 가 file 을 처리했을 때, 경로 앞에 추가될 경로
          name: "[name].[ext]?[hash]",
          // 60KB 해당 용량 이하로는 url-loader 가 Base64 형태로 변환하며, 그 이상은 file-loader 를 통해 그대로 반환한다.
          limit: 60000
        },
      },
      {
        test: /\.js$/,
        use: [
          path.resolve("./custom-webpack-loader.js")
        ]
      }
    ]
  }
}
