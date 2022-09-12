import * as React from 'react';
import { Layout } from "../../components";
import * as styles from './webview.m.less';

export const WebView = ({ location }) => {
    return <Layout>
        <iframe className={styles.iframe}
                id="web"
                src={location.search.replace('?url=', '')}
        />
    </Layout>;
}
