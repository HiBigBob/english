
import React from 'react'
import { connect } from 'react-redux'
import fetch from 'isomorphic-unfetch'
import qs from 'qs'
import {
  Form, Icon, Input, Button, Checkbox, Layout
} from 'antd';
import "../static/styles.css"
import { login } from '../utils/auth'
import { setToken, loadUser } from '../store/actions'

const { Header, Content, Footer, Sider } = Layout;

class NormalLoginForm extends React.Component {
  static getInitialProps ({ctx}) {
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const { store } = ctx
    return { apiUrl: 'http://localhost:5000' }
  }

  constructor (props) {
    super(props)

    this.state = { error: '' }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async handleSubmit (e) {

    // console.log('props', this.props);
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (err) {
        console.log('DO NOT Received values of form: ', err);
      } else {
        console.log('Received values of form: ', values);
      }

      const url = `${this.props.apiUrl}/oauth/token`

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ZW5nbGlzaC1hcHA6cHBhLWhzaWxnbmU='
          },
          body: qs.stringify({
            grant_type: 'password',
            scope: 'practice',
            username: 'hibigbob@gmail.com',
            password: 'test'
          })
        })

        if (response.ok) {
          const token = await response.json()
          const set = await this.props.dispatch(setToken(token.access_token))
          const getUser = await this.props.dispatch(loadUser())
          login({ token: token.access_token })
        } else {
          console.log('Login failed.')
          // https://github.com/developit/unfetch#caveats
          let error = new Error(response.statusText)
          error.response = response
          throw error
        }
      } catch (error) {
        console.error(
          'You have an error in your code or there are Network issues.',
          error
        )
        this.setState({ error: error.message })
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

export default connect()(WrappedNormalLoginForm)
