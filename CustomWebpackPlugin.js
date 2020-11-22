const { ConcatSource } = require("webpack-sources");

class CustomWebpackPlugin {
  apply (compiler) {
    // compiler.hooks.done.tap("Custom plugin", stats => {
    //   console.log("Custom plugin: done");
    // })

    compiler.hooks.compilation.tap("emit", compilation => {
      compilation.hooks.processAssets.tap("CustomWebpackPlugin", () => {
        for (const chunk of compilation.chunks) {
          for (const file of chunk.files) {
            const banner = [
              "/**",
              " * webpack 내장 플러그인인 BannerPlugin 이 처리한 결과 ",
              " */"
            ].join("\n");
            const comment = compilation.getPath(banner, {
              chunk,
              filename: file
            });
            compilation.updateAsset(
              file,
              old => new ConcatSource(comment, "\n", old)
            )
          }
        }
      })
    })
    // webpack 4 버전에서는 아래와 같이 사용한다.
    // compiler.plugin("emit", (compilation, callback) => {
    //   const source = compilation.assets["main.js"].source();
    //   compilation.assets["main.js"].source = () => {
    //     const banner = [
    //       "/**",
    //       " * webpack 내장 플러그인인 BannerPlugin 이 처리한 결과 ",
    //       " */"
    //     ].join("\n");
    //
    //     return banner + "\n\n" + source;
    //   }
    // })
  }
}

module.exports = CustomWebpackPlugin;
