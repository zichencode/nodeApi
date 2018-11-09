const router = require('koa-router')()

const userModel = require('../lib/mysql.js');
const md5 = require('md5')
const checkNotLogin = require('../middlewares/check.js').checkNotLogin
const checkLogin = require('../middlewares/check.js').checkLogin
const moment = require('moment');
const fs = require('fs')
// 注册页面
router.get('/login', async (ctx, next) => {
    console.log(ctx.session, 'haha ')
    await checkNotLogin(ctx)
    await ctx.render('signup', {
        session: ctx.session,
    })
})

// post 登录
router.post('/login', async (ctx, next) => {
    let user = {
        name: ctx.request.body.userName,
        pass: ctx.request.body.password
    }
    await userModel.findDataByName(user.name)
        .then((result) => {
            if (user.name === result[0]['name'] && md5(user.pass) === result[0]['pass']) {
                ctx.body = {
                    success: true,
                    name: result[0]['name'],
                    user_id: result[0]['id'],
                    access: ['super_admin'],
                    token: 'axposdsa123asdqweqwe',
                    message: '登录成功'
                }
                ctx.session.user = result[0]['name']
                ctx.session.id = result[0]['id']
                console.log('session', ctx.session)
            } else {
                ctx.body = {
                    success: false,
                    message: '用户名或密码错误'
                }
            }
        })
        
    
})


module.exports = router;