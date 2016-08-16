/**
 * Created by zhaofeng on 7/12/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

const mapStateToProps = state => ({
    common: state.common
});

const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators({}, dispatch),
    dispatch
});

class Lrc extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: 'lrc'
        }
    }

    switchTab(tabName) {
        this.setState({
            tab: tabName
        });
    }

    render() {
        let lrc = this.props.common.currentSong ? this.props.common.currentSong.data.SW : '';
        let msg = this.props.common.currentSong ? this.props.common.currentSong.data.M : '';
        lrc = lrc || '';
        msg = msg || '';

        return (
            <div>
                <div className="elsa-panel elsa-panel-no-margin elsa-list elsa-list-3 relative">
                    <h3 className="title">
                        <span onClick={this.switchTab.bind(this, 'lrc')}>歌词</span> |
                        <span onClick={this.switchTab.bind(this, 'message')}>灵感</span>
                    </h3>
                    {this.state.tab == 'lrc' &&
                        <div className="elsa-panel-body elsa-list-body clear-fix lrc-body"
                             style={{overflowY: 'auto', height: 545}}>
                            <div dangerouslySetInnerHTML={{__html: lrc.replace(/\r\n/g, '<br/>')}}/>
                        </div>
                    }
                    {this.state.tab == 'message' &&
                        <div className="elsa-panel-body elsa-list-body clear-fix lrc-body"
                             style={{overflowY: 'auto', height: 545}}>
                            <div dangerouslySetInnerHTML={{__html: msg.replace(/\r\n/g, '<br/>')}}/>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Lrc);