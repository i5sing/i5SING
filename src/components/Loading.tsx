import * as React from 'react';
import { Spin } from 'antd';

export interface ILoadingProps {
    loading?: boolean;
    nodata?: boolean;
}

export class Loading extends React.Component<ILoadingProps> {
    render() {
        const loading = this.props.loading;
        return <div style={ {
            visibility: loading ? 'visible' : 'hidden',
            textAlign: 'center',
            paddingBottom: 20,
            color: '#9a9999'
        } }>
            <Spin size="small" spinning={ loading } style={ { color: '#9a9999' } }/> 正在加载中...
        </div>
    }
}
