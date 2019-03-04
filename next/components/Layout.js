import Link from 'next/link'
import Head from 'next/head'

import { Layout, Menu } from 'antd';

const { Header, Content, Footer } = Layout;

export default ({ children, title = 'This is the default title' }) => (
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
        <Content>
            <div className="container">
                {children}
            </div>
        </Content>
        <div
            style={{display: 'none'}}
            id="test"
        >
        </div>
    </Layout>
)
