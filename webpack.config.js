const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

const BASE_JS = "./src/client/js/";

module.exports = {
  entry: {
    main: BASE_JS + "main.js",
    videoPlayer: BASE_JS + "videoPlayer.js",
    recorder: BASE_JS + "recorder.js",
    commentSection: BASE_JS + "commentSection.js",
  },
  //모든 webpack 파일의 시작점을 나타낸다.
  mode: "development",
  watch: true,
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
    //MiniCssExtractPlugin는 css파일을 별개로 분리해서 만드는 프로그램이다.
  ],
  output: {
    filename: "js/[name].js",
    //다른 이름의 파일이 생성되게 []를 사용함.
    path: path.resolve(__dirname, "assets"),
    //파일의 절대경로를 출력한다.
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        //loader는 오른쪽에서 왼쪽 순으로 실행된다.
      },
    ],
  },
};
