import * as React from 'react';
import { Layout } from "../../components/Layout";
import * as styles from './WebView.module.less';

export class WebView extends React.Component<any> {
    render() {
        console.log(this.props.location.search.replace('?url=', ''));
        return <Layout>
            <iframe className={styles.iframe}
                    id="web"
                    src={this.props.location.search.replace('?url=', '')}/>
        </Layout>;
    }
}
