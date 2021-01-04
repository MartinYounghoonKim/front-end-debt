module.exports = {
  presets: [
    // "./customBabelPreset.js",
    [
      "@babel/preset-env",
      {
        targets: {
          chrome: "79",
          ie: "11",
        },
        useBuiltIns: "usage", // "entry", false 바벨이 처리하지 못하는 것들은 폴리필로 사용하도록
        corejs: {
          // 해당 폴리필의 버전은 2 버전으로 사용
          version: 2,
        },
      },
    ],
  ],
};
