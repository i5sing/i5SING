import * as React from 'react';
import { Layout } from "../../components/Layout";

export class WebView extends React.Component<any> {
    render() {
        return <Layout>
            <webview id="web"
                     src={ this.props.location.search.replace('?url=', '') }
                     style={ { height: 524, margin: '0 -30px -30px -30px' } }/>
        </Layout>;
    }
}
