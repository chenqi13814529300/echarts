// 处理业务逻辑中间件，读取某个json文件的数据
const { log } = require('console');
const path = require('path');
const fileUtils = require('../utils/file_utils');

module.exports = async (ctx, next) => {
  const url = ctx.request.url;
  console.log("-----"+url);
// /api/seller
  let filePath = url.replace('/api', '');
  // console.log(filePath);   /seller
  filePath = '../data' + filePath + '.json';
  // console.log(filePath);   ../data/seller.json
  filePath = path.join(__dirname, filePath);
  // console.log(filePath);  /Users/project/vueProject/koa2_echarts/server/data/favicon.ico.json
  try {
    const ret = await fileUtils.getFileJsonData(filePath);
    ctx.response.body = ret;
    console.log(ret);
  } catch (error) {
    const errorMsg = {
      message: '读取文件内容失败！',
      status: 404,
    };
    ctx.response.body = JSON.stringify(errorMsg);
  }

  await next();
};
