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
    }

    render() {
        let lrc = this.props.common.currentSong ? this.props.common.currentSong.data.SW : '';
        lrc = lrc || '';

        return (
            <div>
                <div className="elsa-panel elsa-panel-no-margin elsa-list elsa-list-3 relative">
                    <h3 className="title">歌词</h3>
                    <div className="elsa-panel-body elsa-list-body clear-fix lrc-body"
                         style={{overflowY: 'auto', height: 545}}>
                        <div dangerouslySetInnerHTML={{__html: lrc.replace(/\r\n/g, '<br/>')}}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Lrc);