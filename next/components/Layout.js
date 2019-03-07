import Link from 'next/link'
import Head from 'next/head'

import { Layout, Menu, Progress, Icon, Breadcrumb, Avatar, Dropdown } from 'antd';

const { Header, Content, Footer, Sider } = Layout;

export default class SiderDemo extends React.Component {
    state = {
        collapsed: false,
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    render() {

        const menu = (
          <Menu style={{width: '135px'}}>
            <Menu.Item style={{width: '135px'}}>
                <Link href='/login'>
                    <a>
                        <Icon type="login" />
                        <span style={{marginLeft: '10px'}}>Sign out</span>
                    </a>
                </Link>
            </Menu.Item>
          </Menu>
        );

        return (
            <Layout>
                <Sider
                    trigger={null}
                    collapsible
                    theme="light"
                    collapsed={this.state.collapsed}
                    style={{ 
                        backgroundColor: '#fff' ,
                    }}
                >
                    <div className={this.state.collapsed ? 'logosmall' : 'logo'}>
                        <img src="/static/english.svg" className="logo-img"/>
                        {this.state.collapsed ? '' : 'English'}
                    </div>
                    <Menu 
                        theme="light" 
                        mode="inline" 
                    >
                        <Menu.Item key="1">
                            <Link href='/'>
                                <a>
                                    <Icon type="user" />
                                    <span>Home</span>
                                </a>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Link href='/about'>
                                <a>
                                    <Icon type="video-camera" />
                                    <span>About</span>
                                </a>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Link href='/login'>
                                <a>
                                    <Icon type="login" />
                                    <span>Login</span>
                                </a>
                            </Link>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{ background: '#fff', padding: 0 }}>
                        <Icon
                            className="trigger"
                            type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.toggle}
                        />
                        <div
                            style={{
                                float: 'right',
                                width: '120px'
                            }}
                        >
                            <Dropdown overlay={menu}>
                                <div>
                                    <span style={{paddingRight: '10px'}}>Hi Adrien</span>
                                    <Avatar style={{ marginRight: '10px', backgroundColor: '#0094ff' }} icon="user" />
                                </div>
                            </Dropdown>
                        </div>
                    </Header>
                    <Breadcrumb
                        style={{
                            padding: '20px 20px 0px'
                        }}
                    >
                        <Breadcrumb.Item>
                            <Icon type="home" /> Dashboard
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <Content style={{
                        height: '92vh',
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                >
                    <div className="container" style={{
                        margin: '24px',
                        background: '#fff',
                    }}>
                        {this.props.children}
                    </div>
                </Content>
            </Layout>
        </Layout>
        );
    }
}
