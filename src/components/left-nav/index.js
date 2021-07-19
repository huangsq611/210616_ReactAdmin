import React, { Component } from 'react'
import {Link, withRouter} from 'react-router-dom'
import { Menu } from 'antd';

import menuList from '../../config/menuConfig';
import './index.less'
import logo from '../../assets/images/logo.png';

const { SubMenu } = Menu;
/* 
左侧导航的组件
*/
class LeftNav extends Component {
    /* 
        根据menu的数据数组生成对应的标签数组
        使用 map() + 递归调用
    */
    getMenuNode_map = (menuList) => {
        return menuList.map((item)=>{
            /* 
            { 
                title: '首页', // 菜单标题名称 
                key: '/home', // 对应的path 
                icon: 'home', // 图标名称 
                children: // 子菜单列表 ,可能有，可能没有
            }
            */
            if(!item.children){
                return (
                    <Menu.Item key={item.key} icon={item.icon}>
                        <Link to={item.key}>
                            {/* <Icon type={item.icon} /> */}
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            }else {
                return(
                    <SubMenu key={item.key} icon={item.icon} title={item.title}>
                        {this.getMenuNode(item.children)}
                    </SubMenu>
                )
            }

        })
    }
    /* 
        根据menu的数据数组生成对应的标签数组
        使用 reduce() + 递归调用
        reduce   累计累加  两个参数：第一个参数-遍历函数(上次统计的结果，要统计的数) ，第二个参数-初始值
    */
    getMenuNode = (menuList) => {
        // 得到当前请求的路由路径
        const path = this.props.location.pathname
        return menuList.reduce((pre, item)=>{
            // 向pre中添加<Menu.Item>或<SubMenu>
            if(!item.children){
                pre.push((
                    <Menu.Item key={item.key} icon={item.icon}>
                        <Link to={item.key}>
                            {/* <Icon type={item.icon} /> */}
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                ))
            }else{
                // 查找一个与当前路径匹配的子Item
                const cItem = item.children.find(cItem => cItem.key === path)
                // 如果存在，说明当前item的子列表需要打开
                if(cItem){
                    this.openKey = item.key
                }
                pre.push((
                    <SubMenu key={item.key} icon={item.icon} title={item.title}>
                        {this.getMenuNode(item.children)}
                    </SubMenu>
                ))
            }
            return pre
        } ,[])
    }
    // 在第一次render前执行,为第一个render()准备数据（必须同步的）
    componentWillMount(){
        this.menuNodes = this.getMenuNode(menuList)
    }


    render() {
        // 得到当前请求的路由路径
        let path = this.props.location.pathname
        // 得到需要打开菜单项的key
        const openKey = this.openKey //得到当前请求的路由路径
        return (
            <div>
                <Link to='/' className="left-nav">
                    <header className="left-nav-header">
                        <img src={logo} alt="logo" />
                        <h1>硅谷后台</h1>
                    </header>
                </Link>
                <Menu
                    mode="inline"
                    theme="dark"
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                    >
                    {/* <Menu.Item key="1" icon={<PieChartOutlined />}>
                        <Link to='/home'>
                            <span>首页</span>
                        </Link>
                    </Menu.Item> 

                    <SubMenu key="sub1" icon={<MailOutlined />} title="商品">                        
                        <Menu.Item key="3" icon={<PieChartOutlined />}>
                        <Link to='/category'>
                            <span>品类管理</span>
                        </Link>
                        </Menu.Item>
                        <Menu.Item key="4" icon={<PieChartOutlined />}>
                        <Link to='/product'>
                            <span>商品管理</span>
                        </Link>
                        </Menu.Item>                       
                    </SubMenu> */}

                    {
                        this.menuNodes
                        // this.getMenuNode(menuList)
                    }
                </Menu>
            </div>
            
        )
    }
}

export default withRouter(LeftNav)
