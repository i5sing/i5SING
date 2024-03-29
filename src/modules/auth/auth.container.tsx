import * as React from 'react';
import { Form, Input, Button } from 'antd';
import type { FormInstance } from 'antd/es/form';
import * as styles from './auth.m.less';
import { instance } from '../../helpers';
import { LockOutlined, UserOutlined } from "@ant-design/icons";

export class Auth extends React.Component<any, any> {
    formRef = React.createRef<FormInstance>();

    public state = {
        error: false,
        loading: false,
    };

    private timer;

    handleSubmit = async () => {
        await this.formRef.current!.validateFields();
        const values = this.formRef.current!.getFieldsValue();
        this.setState({ error: false, loading: true });
        const response = await instance.post('http://127.0.0.1:56562/auth', {
            username: values.username,
            password: values.password
        });

        if (!response.data.success) {
            this.setState({ error: response.data.message, loading: false });
            if (this.timer) {
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(() => this.setState({
                error: false,
            }), 5000);
        } else {
            this.setState({ error: false, loading: false });
        }
    };

    render() {
        return <div className={styles.auth}>
            <Form onFinish={() => this.handleSubmit()} className={styles.login_form} ref={this.formRef}>
                <Form.Item rules={[{ required: true, message: '请输入通行证/邮箱/手机号码' }]} name="username">
                    <Input
                        prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }}/>}
                        placeholder="通行证/邮箱/手机号码"
                    />
                </Form.Item>
                <Form.Item rules={[{ required: true, message: '请输入密码' }]} name="password">
                    <Input
                        prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }}/>}
                        type="password"
                        placeholder="密码"
                    />
                </Form.Item>
                <Form.Item>
                    <span style={{ color: '#f00' }}>
                        {this.state.error ? this.state.error : ''}
                    </span>
                    <a className={styles.login_form_forgot} href="">忘记密码</a>
                    <Button
                        loading={this.state.loading}
                        type="primary"
                        htmlType="submit"
                        className={styles.login_form_button}>
                        登录{this.state.loading ? '中...' : ''}
                    </Button>
                    <a href="">立即注册</a>
                </Form.Item>
            </Form>
        </div>
    }
}
