/**
 * Created by zhaofeng on 7/12/16.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {PlayTable, Button} from '../components';
import {
    play,
    pause,
    clear,
    resume,
    readPlayList,
    succeed
} from '../actions/common';

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

class Playlist extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        setTimeout(() => {
            this.props.action.readPlayList();
        }, 500);
    }

    clear() {
        this.props.action.clear();
    }

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
                            <Button type="default" size="large">
                                <i className="fa fa-download"/>下载
                            </Button>
                        </div>
                    </div>
                    <div className="elsa-panel-body elsa-list-body clear-fix">
                        <PlayTable songs={songs.map(song => {
                            return {
                                ID: song.id,
                                SN: song.name,
                                user: {
                                    ID: song.singerId,
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