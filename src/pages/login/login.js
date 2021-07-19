import React, { Component } from 'react';
import { Form, Input, Button, Checkbox , message} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Redirect } from 'react-router-dom'

import './login.less'
import logo from '../../assets/images/logo.png'
import {reqLogin} from '../../api'
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';

const Item = Form.Item;//不能写在Import之前
/* 
    登录的路由组件
*/
class Login extends Component {
    onFinish = (values) => {
        const {username,password} = values;
        reqLogin(username,password).then(res=>{
            console.log(res,'res')
            if(res.status===0) {//登录成功
                message.success("登录成功")
                // 保存user
                const user = res.data
                memoryUtils.user = user //保存到内存中
                storageUtils.saveUser(user) //保存到local中
                // 跳转到管理界面,不需要再回退回来用replace
                this.props.history.replace('/admin')
            } else {
                message.error(res.msg)
            }
        });


    }

    /* 
    对密码进行自定义验证
    */
    validatePwd = (_, value) => {
        if(!value){
            // callback('密码不能为空');
            return Promise.reject(new Error("密码不能为空"));
        }else if(value.length<=4){
            // callback('密码不能少于4位');
            return Promise.reject(new Error("密码不能少于4位"));
        }else if(value.length>12){
            // callback('密码不能大于12位');
            return Promise.reject(new Error("密码不能大于12位"));
        }else {
            // callback();//验证通过
            return Promise.resolve();
        }
        // callback('xxxxx');//验证失败
    }
    render() {
        // 如果用户已经登录，自动跳转到管理界面
        const user = memoryUtils.user
        if(user && user._id){
            return <Redirect to='/admin'/>
        }

        return (    
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo"/>
                    <h1>React项目: 后台管理系统</h1>
                </header>
                <section className="login-section">
                    <h2>用户登录</h2>
                    {/* 
                        用户名/密码的的合法性要求
                        1). 必须输入 
                        2). 必须大于等于 4 位 
                        3). 必须小于等于 12 位 
                        4). 必须是英文、数字或下划线组成
                    */}
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={this.onFinish}
                        >
                        <Form.Item
                            name="username"
                            // 声明式验证：直接使用别人定义好的验证规则进行验证 
                            rules={[
                            {
                                required: true,
                                whitespace: true,
                                message: '请输入用户名',
                            },
                            {
                                min: 4,
                                message: '用户名最少4位',
                            },
                            {
                                max: 12,
                                message: '用户名最多12位',
                            },
                            {
                                pattern: /^[a-zA-Z0-9]+$/,
                                message: '用户名必须是英文、数字或下划线组成',
                            },
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                            {
                                validator: this.validatePwd,
                            },
                            ]}
                        >
                            <Input
                            prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="密码"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                            </Button>
                        </Form.Item>
                        </Form>
                </section>
            </div>
        );
    }
}

/*
1. 高阶函数
    1). 一类特别的函数
        a. 接受函数类型的参数
        b. 返回值是函数
    2). 常见
        a. 定时器: setTimeout()/setInterval()
        b. Promise: Promise(() => {}) then(value => {}, reason => {})
        c. 数组遍历相关的方法: forEach()/filter()/map()/reduce()/find()/findIndex()
        d. 函数对象的bind()
        e. Form.create()() / getFieldDecorator()()
    3). 高阶函数更新动态, 更加具有扩展性

2. 高阶组件
    1). 本质就是一个函数
    2). 接收一个组件(被包装组件), 返回一个新的组件(包装组件), 包装组件会向被包装组件传入特定属性
    3). 作用: 扩展组件的功能
    4). 高阶组件也是高阶函数: 接收一个组件函数, 返回是一个新的组件函数
 */

/* 
包装Form组件，生成新的组件：Form(Login)
新组件会向Form组件传递一个强大的对象属性：form
*/
/* 
    1、前台表单验证
    2、搜集表单数据
*/
export default Login;