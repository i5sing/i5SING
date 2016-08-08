/**
 * Created by zhaofeng on 2016/8/1.
 */
import React from 'react';

export default class WebView extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        return (
            <div>
                <webview id="web" src={this.props.location.query.url} style={{height: 565}}/>
            </div>
        );
    }
}