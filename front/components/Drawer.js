
import { connect } from 'react-redux'
import {
  Drawer, Form, Button, Col, Row, Input, Select, DatePicker, Icon, Card
} from 'antd';

const { Option } = Select;

let id = 0;

let iterator = {
  en: 0,
  fr: 0
};

class DynamicFieldSet extends React.Component {
  constructor (props) {
    super(props)

    if (props.data != null && Object.keys(props.data).length > 0) {
      this.state = props.data;
    } else {
      this.state = { en: [], fr: [] };
    }
  }

  remove = (k, key) => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue(key);
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      [key]: keys.filter(item => item !== k),
    });
  }

  add = (key) => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue(key);
    const nextKeys = keys.concat(keys.length);

    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      [key]: nextKeys,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  render() {
    const { getFieldDecorator, getFieldValue, setFieldsValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };

    getFieldDecorator('en', { initialValue: this.state.en.map((e, i) => (i)) });
    const keysEn = getFieldValue('en');

    const formItemsEn = keysEn.map((k, index) => (
      <Form.Item
        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
        label={index === 0 ? 'Verbs' : ''}
        style={{marginBottom: 'unset'}}
        required={false}
        key={k}
      >
        {getFieldDecorator(`names.en[${k}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          initialValue: this.state.en[k] != null ? this.state.en[k] : '' ,
          rules: [{
            required: true,
            whitespace: true,
            message: "Please input verb or delete this field.",
          }],
        })(
          <Input placeholder="verb" style={{ width: '90%', marginRight: 8 }} />
        )}
        {keysEn.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            disabled={keysEn.length === 1}
            onClick={() => this.remove(k, 'en')}
          />
        ) : null}
      </Form.Item>
    ));

    const selectedOptions = [
		  {label: 'bar', value: 'login'}
		]

    getFieldDecorator('fr', { initialValue: this.state.fr.map((e, i) => (i)) });
    const keysFr = getFieldValue('fr');

    const formItemsFr = keysFr.map((k, index) => (
      <Form.Item
        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
        label={index === 0 ? 'Verbs' : ''}
        style={{marginBottom: 'unset'}}
        required={false}
        key={k}
      >
        {getFieldDecorator(`names.fr[${k}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          initialValue: this.state.fr[k] != null ? this.state.fr[k] : '' ,
          rules: [{
            required: true,
            whitespace: true,
            message: "Please input verb or delete this field.",
          }],
        })(
          <Input placeholder="verb" style={{ width: '90%', marginRight: 8 }} />
        )}
        {keysFr.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            disabled={keysFr.length === 1}
            onClick={() => this.remove(k, 'fr')}
          />
        ) : null}
      </Form.Item>
    ));

    return (
      <Form onSubmit={this.handleSubmit}>
          <div>EN</div>
          {formItemsEn}
          <Form.Item {...formItemLayoutWithOutLabel}>
            <Button type="dashed" onClick={this.add.bind(this, 'en')} style={{ width: '90%' }}>
              <Icon type="plus" /> Add field
            </Button>
          </Form.Item>
          <div>FR</div>
          {formItemsFr}
          <Form.Item {...formItemLayoutWithOutLabel}>
            <Button type="dashed" onClick={this.add.bind(this, 'fr')} style={{ width: '90%' }}>
              <Icon type="plus" /> Add field
            </Button>
          </Form.Item>
          <div
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
            }}
          >
              <Button type="primary" htmlType="submit">Submit</Button>
          </div>
      </Form>
    );
  }
}

const WrappedDynamicFieldSet = Form.create({ name: 'dynamic_form_item' })(DynamicFieldSet);

class DrawerForm extends React.Component {
  state = { visible: false };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    console.log('props init', this.props);
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Button type="primary" onClick={this.showDrawer}>
          <Icon type="plus" /> New verb
        </Button>
        <Drawer
          title="Add a new verb"
          width={350}
          onClose={this.onClose}
          visible={this.state.visible}
          style={{
            overflow: 'auto',
            height: 'calc(100% - 108px)',
            paddingBottom: '108px',
          }}
        >
          <WrappedDynamicFieldSet data={this.props.data} />
        </Drawer>
      </div>
    );
  }
}

const App = Form.create()(DrawerForm);

const mapStateToProps = ({ lists, index }) => ({ practice: lists[index] })
export default connect(mapStateToProps)(App)
