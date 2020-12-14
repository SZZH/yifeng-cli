const express = require('express');
const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.dev');

const app = express();
const complier = webpack(config);

const port = 3333;

const devMiddleware = webpackDevMiddleware(complier, {
  publicPath: config.output.publicPath
})

app.use(devMiddleware)
app.use(webpackHotMiddleware(complier))

devMiddleware.waitUntilValid(() => {
  console.log('listen at localhost:' + port);
  require('opn')('http://localhost:' + port);
})

app.listen(port, (err) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log(`服务启动成功，端口为: ${port}`)
})