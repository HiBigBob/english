
import React from 'react'
import {
    Form, Icon, Input, Button, Checkbox, Layout
} from 'antd';
import "../styles.css"

const { Header, Content, Footer, Sider } = Layout;

class NormalLoginForm extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Layout>
                <Content
                    style={{
                        height: '90vh'
                    }}
                >
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <div className="login-logo">
                            <img src="/static/english.svg" className="logo-img"/>
                            <span>English</span>
                        </div>
                        <Form.Item>
                            {getFieldDecorator('userName', {
                                rules: [{ required: true, message: 'Please input your username!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: 'Please input your Password!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Log in
                            </Button>
                        </Form.Item>
                    </Form>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    English ©2019 Created by Adrien Bouttier
                </Footer>
            </Layout>
        );
    }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);

export default () => (
    <WrappedNormalLoginForm />
)
