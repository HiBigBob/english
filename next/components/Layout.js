import Link from 'next/link'
import Head from 'next/head'

import { Layout, Menu, Progress, Icon, Breadcrumb } from 'antd';

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
                {this.state.collapsed ? '' : 'English'}
            </div>
          <Menu theme="light" mode="inline" defaultSelectedKeys={['1']}>
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

const old = ({ children, title = 'This is the default title' }) => (
    <Layout className="layout">
        <Head>
            <title>{title}</title>
            <meta charSet='utf-8' />
            <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        </Head>
        <Header>
            <div className="logo">
                English
            </div>
            <Menu
                mode="horizontal"
                style={{ 
                    lineHeight: '62px', 
                    float: 'right',
                }}
            >
                <Menu.Item disabled={true}>
                    <Progress type="circle" percent={75} width={20} strokeWidth={10} showInfo={false} />
                </Menu.Item>
                <Menu.Item key="1">
                    <Link href='/'>
                        <a>Home</a>
                    </Link>
                </Menu.Item>
                <Menu.Item key="2">
                    <Link href='/about'>
                        <a>About</a>
                    </Link>
                </Menu.Item>
            </Menu>
        </Header>
        <Layout>
            <Sider>Sider</Sider>
            <Content>
                <div className="container">
                    {children}
                </div>
            </Content>
        </Layout>
    </Layout>
)
