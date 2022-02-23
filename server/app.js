// 服务器点入口文件
// 1.koa的对象
const koa = require('koa')
const app = new koa()
// 2.绑定中间件
const durarionMiddleware = require('./middleware/response_duration')
app.use(durarionMiddleware);

const headerMiddleware = require('./middleware/response_header')
app.use(headerMiddleware);

const dataMiddleware = require('./middleware/response_data')
app.use(dataMiddleware);



// 3.绑定端口号 8888
app.listen(8888);

// // 开启服务端的监听，监听客户端的连接
// // 当某个客户端连接成功后，对这个客户端进行message事件的监听
const webSocketService = require('./service/web_socket_service')
// 开启服务端的监听, 监听客户端的连接
// 当某一个客户端连接成功之后, 就会对这个客户端进行message事件的监听
webSocketService.listen()