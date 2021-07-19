/* 
包含应用中所有接口请求函数的模块
每个函数的返回值都是promise
*/

import ajax from "./ajax";
import jsonp from 'jsonp'
import {message} from 'antd'
// 登录
/* 
export function reqLogin(username, password){
    return ajax('/login', { username, password }, 'POST');
} */

export const reqLogin = (username, password)=> ajax('/login',{ username, password }, 'POST' );

// 添加用户
export const reqAddUser = (user)=> ajax('/manager/user/add',user, 'POST' );


/* 
json请求的接口请求函数
 */
export const reqWeather = (city) => {

    return new Promise((resolve, reject) => {
        const url = `https://tianqiapi.com/api?version=v6&appid=15991749&appsecret=3Ck5IKrt&city=${city}`
        jsonp(url, {}, (err,data)=>{
            // console.log('jsonp()',err,data)
            // 如果成功
            if(!err){
                // 取出需要的数据
                    // const {wea, wea_img } = data
                    resolve(data)
            }else{
                // 如果失败
                message.error('获取天气信息失败')
            }  
        })
    })
    
}
// reqWeather('深圳')

