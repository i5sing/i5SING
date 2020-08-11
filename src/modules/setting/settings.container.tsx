import * as React from 'react';
import { message } from 'antd';
import { connect } from 'react-redux';
import { createForm } from 'rc-form';
import { Button, Card, Form, Input } from "antd";
import { FIELD_DATA_PROP, FIELD_META_PROP } from "antd/lib/form/constants";
import { IState } from "../../reducers";
import { bindActionCreators } from "redux";
import { CloudAction } from "../../actions";
import { actions } from "../../helpers";
import { Layout, Tool } from "../../components";
import { ICloud } from "../../interfaces";

export interface ISettingProps {
    form: any;
    cloud?: ICloud;
    actions?: {
        cloud: typeof CloudAction;
    };
}

@connect(
    (state: IState) => ({
        cloud: state.cloud,
    }),
    dispatch => ({
        actions: {
            cloud: bindActionCreators(actions(CloudAction), dispatch),
        }
    })
)
@createForm({ fieldMetaProp: FIELD_META_PROP, fieldDataProp: FIELD_DATA_PROP })
export class Setting extends React.Component<ISettingProps> {
    confirm() {
        const { validateFields } = this.props.form;
        validateFields((err, values) => {
            if (err) {
                return;
            }
            this.props.actions.cloud.updateConfig({
                accessKey: values.accessKey,
                secretKey: values.secretKey,
                domain: values.domain,
                bucket: values.bucket,
                zone: values.zone,
            });
            message.success('修改成功');
        })
    }

    render() {
        const { cloud } = this.props;
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: {
                span: 3
            },
            wrapperCol: {
                span: 12
            },
        };

        return <Layout>
            <Card
                style={{ marginLeft: -31, marginRight: -31 }}
                size="small"
                title="我的音乐云盘"
                extra={<span style={{ fontSize: 12 }}>目前只支持七牛云存储</span>}>
                <Form {...formItemLayout}>
                    <Form.Item label="域名">
                        {getFieldDecorator('domain', {
                            initialValue: cloud.domain,
                            rules: [{
                                required: true, message: '请输入网盘域名',
                            }],
                        })(
                            <Input/>
                        )}
                    </Form.Item>
                    <Form.Item label="Access Key">
                        {getFieldDecorator('accessKey', {
                            initialValue: cloud.accessKey,
                            rules: [{
                                required: true, message: '请输入网盘 Access Key',
                            }],
                        })(
                            <Input/>
                        )}
                    </Form.Item>
                    <Form.Item label="Secret Key">
                        {getFieldDecorator('secretKey', {
                            initialValue: cloud.secretKey,
                            rules: [{
                                required: true, message: '请输入网盘 Secret Key',
                            }],
                        })(
                            <Input type="password"/>
                        )}
                    </Form.Item>
                    <Form.Item label="存储桶">
                        {getFieldDecorator('bucket', {
                            initialValue: cloud.bucket,
                            rules: [{
                                required: true, message: '请输入网盘存储桶',
                            }],
                        })(
                            <Input/>
                        )}
                    </Form.Item>
                    <Form.Item label="地区">
                        {getFieldDecorator('zone', {
                            initialValue: cloud.zone,
                            rules: [{
                                required: true, message: '请输入网盘所在地区',
                            }],
                        })(
                            <Input/>
                        )}
                    </Form.Item>
                </Form>
            </Card>
            <Tool>
                <Button type="primary" onClick={() => this.confirm()}>确认</Button>
            </Tool>
        </Layout>;
    }
}
