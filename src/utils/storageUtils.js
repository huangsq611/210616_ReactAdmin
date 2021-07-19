/* 
进行local数据存储管理的工作模块
*/
import store from 'store'

const USER_KEY = 'user_key'

// localStorage   原生语法封装----有些浏览器不兼容
// store库   基本兼容所有浏览器且写法简洁

export default {
    /* 
    保存user
    */
    saveUser(user){
        // JSON.stringify(user)  转化为JSON格式的字符串，如果不调用，则默认调用toString方法，转化为[object,object],没有可用信息
        // localStorage.setItem(USER_KEY,JSON.stringify(user));
        store.set(USER_KEY,user);
    },
    /* 
    读取user
    */
    getUser(){
        // 如果有值则为JSON格式的字符串，如果没有值，则为null，防止引起报错所以提前传一个空对象{}
        // JSON.parse()---将JSON字符串转化为JSON对象
        // return JSON.parse(localStorage.getItem(USER_KEY) || '{}')//同时判空
        return store.get(USER_KEY) || {}
        
    },
    /* 
    删除user
    */
    removeUser(){
        // localStorage.removeItem(USER_KEY)
        store.remove(USER_KEY)
    }
}

