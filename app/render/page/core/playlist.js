/**
 * Created by zhaofeng on 7/12/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {
    PlayList,
    Button
} from '../../components';
import {
    play,
    pause,
    clear,
    resume,
    readPlayList,
    succeed
} from '../../redux/action/common';

const mapStateToProps = state => ({
    common: state.common
});

const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators({
        play,
        pause,
        clear,
        resume,
        readPlayList,
        succeed
    }, dispatch),
    dispatch
});

class Playlist extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        setTimeout(() => {
            this.props.action.readPlayList();
        }, 800);
    }

    clear() {
        this.props.action.clear();
    }

    /*
     <Button type="default" size="large">
         <i className="fa fa-download"/>下载
     </Button>
     */
    render() {
        let songs = this.props.common.playlist || [];
        return (
            <div>
                <div className="elsa-panel elsa-panel-no-margin elsa-list elsa-list-3 relative">
                    <h3 className="title">播放列表</h3>
                    <div className="bar">
                        <div className="btn-group">
                            <Button type="primary" size="large" onClick={this.clear.bind(this)}>
                                <i className="fa fa-trash"/>清空
                            </Button>
                        </div>
                    </div>
                    <div className="elsa-panel-body elsa-list-body clear-fix"
                         style={{overflowY: 'auto', height: 545}}>
                        <PlayList songs={songs.map(song => {
                            return {
                                ID: song.id,
                                SN: song.name,
                                SongType: song.type,
                                user: {
                                    ID: song.singId,
                                    NN: song.singer,
                                    I: song.singerImg
                                }
                            }
                        })}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Playlist);