import * as React from 'react';
import { Button, Input, Form } from "antd";

export interface IEditorProps {
    onChange: (comment: string) => void;
    onSubmit: (comment: string) => void;
    loading?: boolean;
    comment: string;
}

export class Editor extends React.Component<IEditorProps> {
    render() {
        const { loading, onSubmit, comment } = this.props;
        return <div>
            <Form.Item>
                <Input.TextArea
                    prefix={ 'reply to test' }
                    rows={ 4 }
                    onChange={ e => {
                        const value = e.target.value;
                        this.props.onChange(value);
                    } }
                    value={ comment }/>
            </Form.Item>
            <Form.Item>
                <Button htmlType="submit"
                        loading={ loading }
                        onClick={ () => onSubmit(comment) }
                        type="primary">
                    评论
                </Button>
            </Form.Item>
        </div>
    }
}
