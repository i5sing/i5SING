import * as React from 'react';
import { message } from 'antd';
import { useSelector } from 'react-redux';
import { Button, Card, Form, Input } from "antd";
import { Layout, Tool } from "../../components";
import { ICloud } from "../../interfaces";

export const Setting = () => {
    const cloud = useSelector<any, ICloud>(state => state.cloud);
    const [form] = Form.useForm();

    const formItemLayout = {
        labelCol: {
            span: 3
        },
        wrapperCol: {
            span: 12
        },
    };

    const confirm = async () => {
        await form.validateFields();
        const values = form.getFieldsValue();
        this.props.actions.cloud.updateConfig({
            accessKey: values.accessKey,
            secretKey: values.secretKey,
            domain: values.domain,
            bucket: values.bucket,
            zone: values.zone,
        });
        message.success('修改成功');
    }

    return <Layout>
        <Card
            style={{ marginLeft: -31, marginRight: -31 }}
            size="small"
            title="我的音乐云盘"
            extra={<span style={{ fontSize: 12 }}>目前只支持七牛云存储</span>}>
            <Form {...formItemLayout}>
                <Form.Item
                    label="域名"
                    name="domain"
                    initialValue={cloud.domain}
                    rules={[{ required: true, message: '请输入网盘域名', }]}>
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="Access Key"
                    name="accessKey"
                    initialValue={cloud.accessKey}
                    rules={[{ required: true, message: '请输入网盘 Access Key' }]}>
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="Secret Key"
                    name="secretKey"
                    initialValue={cloud.secretKey}
                    rules={[{ required: true, message: '请输入网盘 Secret Key' }]}>
                    <Input type="password"/>
                </Form.Item>
                <Form.Item
                    label="存储桶"
                    name="bucket"
                    initialValue={cloud.bucket}
                    rules={[{ required: true, message: '请输入网盘存储桶' }]}>
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="地区"
                    name="zone"
                    initialValue={cloud.zone}
                    rules={[{ required: true, message: '请输入网盘所在地区' }]}>
                    <Input/>
                </Form.Item>
            </Form>
        </Card>
        <Tool>
            <Button type="primary" onClick={() => confirm()}>确认</Button>
        </Tool>
    </Layout>;
}
