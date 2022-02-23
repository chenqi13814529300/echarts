// 1.创建koa对象
const Koa = require('koa')
const app = new Koa()

// 2.编写相应函数（中间件）
// ctx:上下文,web容器，ctx.request ctx.response
// next:下一个中间件，下一层中间件是否能得到执行，取决于next这个函数是否被调用
app.use((ctx, next) => {

    console.log('1');
    ctx.response.body = "hello"
    next()
    console.log('*1*');

})
app.use(async (ctx, next) => {

    console.log('2');
    // const ret = await next()
    // console.log(ret);
    next()
    console.log('*2*');


})
app.use((ctx, next) => {

    console.log('3');
    // return 'i love'
})
// 3.绑定端口号 3000
app.listen(3000)