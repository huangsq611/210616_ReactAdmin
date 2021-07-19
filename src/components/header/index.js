import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import { formateDate } from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import { reqWeather } from '../../api/index'
import menuList from '../../config/menuConfig'
import './index.less'
import logo from '../../assets/images/logo.png'


/* 
头部组件
*/
class Header extends Component {
    state = {
        currentTime: formateDate(Date.now()), //当前时间字符串
        weaImg: '',//天气图片
        wea: '',//天气
    }

    getTime = () => {
        // 每隔一秒获取当前时间，并更新状态数据currentTime
        setInterval(()=>{
            const currentTime = formateDate(Date.now())
            this.setState({currentTime})
        },1000)
    }


    getWeather = () => {
        // 调用接口请求异步获取数据
        reqWeather('深圳').then(res=>{
            // console.log(res,'res')
            // 更新状态
            const {weaImg, wea} = res
            this.setState({weaImg, wea})
        }).catch(err=>{
            
        })
        
    }

    getTitle = () => {
        // 得到当前请求路径
        const path = this.props.location.pathname
        let title
        // 遍历查找
        menuList.forEach(item => {
            if(item.key === path) { //如果当前item对象的key与path一样，item的title就是需要显示的title
                title = item.title
            }else if(item.children) {
                // 在所有的子item中查找匹配
                const cItem = item.children.find(cItem => cItem.key === path)
                // 如果有值才说明有匹配的
                if(cItem) {
                    // 取出title
                    title = cItem.title
                }
            }
        })
        return title
    }
    // 退出登陆 
    logout = () => {
        // 显示确认框
        Modal.confirm({
            title: '确定退出吗？',
            icon: <ExclamationCircleOutlined />,
            // content: 'Some descriptions',
            onOk() {
              console.log('OK');
            },
            onCancel() {
              console.log('Cancel');
            },
          });
    }
    /* 
    第一次render()之后执行一次
    一般在此执行异步操作：发ajax请求/启动定时器
     */
    componentDidMount(){
        // 获取当前的时间
        this.getTime()
        // 获取当前天气
        this.getWeather()
    }

    render() {
        const {currentTime, weaImg, wea } = this.state
        const username = memoryUtils.user.username

        // 得到当前需要显示的title
        const title = this.getTitle()
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎，{username}</span>
                    <a href="javascript:" onClick={this.logout}>退出</a>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src={logo} alt="logo"/>
                        <span>{wea}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)