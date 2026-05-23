1. 第一次先跑：

  npm run ios

  把 dev client 安装到 iPhone。

  2. 之后日常开发只改 JS/TS/样式时，跑：

  npm start

  3. 在 iPhone 上打开已安装的 App，它会连接 npm start 启动的服务器。

  什么时候需要 npm run ios：

  第一次安装到真机
  改了 ios/ 原生代码
  加了新的原生库
  改了 app.json 里影响原生工程的配置
  需要重新签名/重新安装

  什么时候只需要 npm start：

  改 app/ 页面
  改 components/
  改普通 JS/TS 逻辑
  改样式
  调试业务功能

  一句话：npm run ios 负责“装壳到手机”，npm start 负责“给壳喂 JS 开发代码”。