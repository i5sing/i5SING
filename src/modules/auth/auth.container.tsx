import * as React from 'react';
import { Form, Input, Button } from 'antd';
import * as styles from './auth.m.less';
import { instance } from '../../helpers';
import { useState } from "react";
import { UserOutlined, LockOutlined } from '@ant-design/icons';

let timer;

export const Auth = () => {
    const [error, setError] = useState<string | boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [form] = Form.useForm();
    const handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                setError(false);
                setLoading(true);
                const response = await instance.post('http://127.0.0.1:56562/auth', {
                    username: values.username,
                    password: values.password
                });

                if (!response.data.success) {
                    setError(response?.data?.message);
                    setLoading(false);
                    if (timer) {
                        clearTimeout(timer);
                    }
                    timer = setTimeout(() => setError(false), 1000);
                } else {
                    setError(false);
                    setLoading(false);
                }
            }
        });
    };

    return (
        <div className={styles.auth}>
            <Form onFinish={handleSubmit} className={styles.login_form} form={form}>
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
                    <span style={{ color: '#f00' }}>{error ? error : ''}</span>
                    <a className={styles.login_form_forgot} href="">忘记密码</a>
                    <Button
                        loading={loading}
                        type="primary"
                        htmlType="submit"
                        className={styles.login_form_button}>
                        登录{loading ? '中...' : ''}
                    </Button>
                    <a href="">立即注册</a>
                </Form.Item>
            </Form>
        </div>
    );
}
