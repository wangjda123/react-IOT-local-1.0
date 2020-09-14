/*包含 n 个接口请求函数的模块 每个函数返回 promise */
import ajax from './ajax'

// 展示用户
export const reqShowUser = () =>
    ajax('/user/all', {},'GET')

// 登陆
export const reqLogin = (username, password) =>
    ajax('/login', {username, password}, 'POST')

// 添加用户
export const reqAddRole = (role) =>
    ajax('/user/add',role, 'POST')

// 删除用户
export const reqDeleteUser = (username) =>
    ajax('/user/delete', {username}, 'GET')