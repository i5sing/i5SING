/**
 * Created by zhaofeng on 7/11/16.
 */
import React, {Component} from 'react';
import ipc from '../backend/ipc';

import Player from '../components/player';
import Progress from '../components/progress';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
    play,
    pause,
    resume,
    next,
    previous,
    getSongInfo,
    succeed
} from '../actions/common';

const mapStateToProps = state => ({
    common: state.common
});

const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators({
        play,
        pause,
        resume,
        succeed,
        getSongInfo,
        next,
        previous
    }, dispatch),
    dispatch
});

export default class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            currentTime: 0,
            duration: 0,
            buffered: 0,
            playing: false,
            currentSong: null
        };
        this.hasLoad = false; //avoid mulity load song info
    }

    componentDidMount() {
        ipc.render.on('change-song', (evt, type) => {
            if (type == 'next') {
                this.next();
            } else if (type == 'pre') {
                this.previous()
            } else {
                this.play();
            }
        });

        this.media = new Audio('');

        //时间改变
        this.media.addEventListener('timeupdate', () => {
            let timeRang = this.media.buffered;
            if (timeRang.length == 1) {
                this.setState({currentTime: this.media.currentTime, buffered: timeRang.end(0)});
            } else {
                this.setState({currentTime: this.media.currentTime});
            }
        });

        //成功获取资源长度
        this.media.addEventListener('loadedmetadata', () => {
            this.setState({duration: this.media.duration});
        });

        this.media.addEventListener('ended', () => {
            this.next();
        });
    }

    /**
     *
     * @param nextProps
     * @returns {*}
     *
     * state.status = 1; //加载播放列表成功
     * state.status = 2; //继续
     * state.status = 3; //暂停
     * state.status = 0; //开始播放
     * state.status = 4; //加载歌曲信息成功
     * state.status = 6; //停止
     */
    componentWillReceiveProps(nextProps) {
        let common = nextProps.common;

        if (common.status == 0) return;

        if (common.status == 1) {
            if (!this.props.common.playlist || this.props.common.playlist.length == 0) return;
            let song = this.props.common.playlist[common.current];
            return this.props.action.getSongInfo(song.id, song.type);
        } else if (common.status == 2) {
            this.setState({playing: true});
            this.media.play();
        } else if (common.status == 3) {
            this.setState({playing: false});
            this.media.pause();
        } else if (common.status == 4 && !this.hasLoad) {
            this.hasLoad = true;
            let result = common.currentSong;
            this.setState({playing: true});
            setTimeout(() => {
                this.media.src = result.data.squrl || result.data.hqurl || result.data.lqurl;
                this.media.play();
                this.hasLoad = false;
            }, 150);
        } else if (common.status == 6 && this.media.currentTime) {
            this.media.currentTime = this.media.duration;
            this.setState({playing: false});
        }

        this.props.action.succeed(0);
    }

    play() {
        if (this.state.playing) {
            return this.props.action.pause();
        } else if (this.media.readyState > 1) {
            return this.props.action.resume();
        } else {
            this.props.action.play();
        }
    }

    previous() {
        if (this.props.common.current) {
            this.props.action.previous();
        }
    }

    next() {
        if (this.props.common.current < this.props.common.playlist.length - 1) {
            this.props.action.next();
        }
    }

    render() {
        let index = this.props.common.current || 0;
        let playlist = this.props.common.playlist || [];
        let song = this.state.currentSong;
        let name = playlist.length > index ? playlist[index].name + ' - ' + playlist[index].singer : '';
        let img = playlist.length > index ? playlist[index].singerImg : '';
        return (
            <div className="elsa-footer">
                <div className="player">
                    <Player play={this.play.bind(this)}
                            previous={this.previous.bind(this)}
                            next={this.next.bind(this)}
                            isPlaying={this.state.playing}/>
                </div>
                <div className="control-bar">
                    <Progress songName={name}
                              picture={img}
                              isPlaying={this.state.playing}
                              buffered={this.state.buffered}
                              currentTime={this.state.currentTime}
                              duration={this.state.duration}/>
                    <div className="btn-group">
                        <i className="fa fa-heart btn btn-heart"/>
                        <i className="fa fa-download btn"/>
                        <span className="lrc btn" onClick={this.props.openLrc.bind(this)}>歌词</span>
                        <i className="fa fa-list-ul btn btn-list" onClick={this.props.openPlayList}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Footer);