
import React from 'react'
import { connect } from 'react-redux'
import fetch from 'isomorphic-unfetch'
import qs from 'qs'
import {
  Form, Icon, Input, Button, Checkbox, Layout
} from 'antd';
import "../static/styles.css"
import { login } from '../utils/auth'
import { setToken, loadUser, getToken } from '../store/actions'

const { Header, Content, Footer, Sider } = Layout;

class NormalLoginForm extends React.Component {
  constructor (props) {
    super(props)

    this.state = { error: '' }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        console.log('DO NOT Received values of form: ', err);
      }

      this.props.dispatch(getToken(values));
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.token !== nextProps.token && nextProps.token != null) {
      login({ token: nextProps.token })
    }
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
              {getFieldDecorator('email', {
                rules: [{ required: true, message: 'Please input your email!' }],
                })(
                  <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />
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

export default connect(state => ({
    token: state.token
}))(WrappedNormalLoginForm)
