/**
 * Created by zhaofeng on 7/13/16.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

const mapStateToProps = state => ({
    singer: state.singer
});

const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators({}, dispatch),
    dispatch
});

class WebView extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log(this);
    }

    render() {
        return (
            <div>
                <webview id="web" src={this.props.location.query.url} style={{height: 565}}/>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WebView);