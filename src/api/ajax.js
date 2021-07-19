/* 
能发送异步ajax请求的的函数模块
封装axios库
函数的返回值是promise对象
1.优化1：统一处理请求异常？
    在外层包一个自己创建的promise对象
    在请求出错时，不reject(error),而是显示措施提示
2.优化2：异步得到不是response，而是response.data
    在请求成功resolve(response.data)
*/

import axios from 'axios'
import {message} from 'antd'


export default function ajax(url,data={},type='GET'){
    return new Promise((resolve, reject) => {
        let promise
        // 1.执行异步ajax请求
        if(type==='GET'){//发GET请求
            promise = axios.get(url,{  //配置对象
                params: data  //指定请求参数
            });
        }else{// 发送POST请求
            promise = axios.post(url,data);
        }
        // 2.请求成功,代用resolve(value)
        promise.then(response => {
            resolve(response.data)
            console.log('请求成功：',response);
        }).catch(error => {// 3.请求失败,不调用reject(error),而是提示异常信息
            message.error('请求出错了:'+error.message)
        })
        
        
    })
}

//  请求登录接口
// ajax('/login',{usename: 'admin', password: 'admin'}, 'POST').then()