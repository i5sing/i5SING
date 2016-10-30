/**
 * Created by zhaofeng on 7/11/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {on} from '../../utils/ipc';
import {
    Player,
    Progress
} from '../../components';
import {
    play,
    pause,
    resume,
    next,
    previous,
    getSongInfo,
    succeed,
    changePlayType,
    syncMySongs,
    download
} from '../../redux/action/common';

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
        previous,
        changePlayType,
        syncMySongs,
        download
    }, dispatch),
    dispatch
});

class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            currentTime: 0,
            duration: 0,
            buffered: 0,
            playing: false,
            currentSong: null,
            playType: 0 // 0:顺序 1: 随机 2:重复
        };
        this.hasLoad = false; //avoid mulity load song info
    }

    componentDidMount() {
        on('change-song', (evt, type) => {
            if (type == 'next') {
                this.props.action.next();
            } else if (type == 'pre') {
                this.props.action.previous()
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
            this.props.action.next();
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
            let info = this.props.info || {};
            return this.props.action.getSongInfo(song.id, song.type, info.sign);
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
            try {
                this.media.src = result.data.squrl || result.data.hqurl || result.data.lqurl;
                this.media.play();
            } catch (e) {

            }

            this.hasLoad = false;

            new Notification(result.data.SN, {
                body: result.data.S,
                icon: result.data.user.I,
                silent: true
            });

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

    syncSong(song) {
        if (!this.props.info || !song) return;
        let userId = parseInt(this.props.info.id),
            add = [],
            del = [];

        if (song.favorite) {
            del.push({
                "ID": song.ID,
                "SK": song.SK,
                "SN": song.SN
            });
        } else {
            add.push({
                "ID": song.ID,
                "SK": song.SK,
                "SN": song.SN
            });
        }

        this.props.action.syncMySongs(userId, add, del);
    }

    download(song) {
        this.props.action.download(song.songid, song.songtype);
    }

    render() {
        let currentSongResult = this.props.common.currentSong || {},
            song = currentSongResult.data || {};

        return (
            <div className="elsa-footer">
                <div className="player">
                    <Player play={this.play.bind(this)}
                            onPlayTypeChange={this.props.action.changePlayType}
                            previous={this.props.action.previous}
                            next={this.props.action.next}
                            playType={this.props.common.playType}
                            isPlaying={this.state.playing}/>
                </div>
                <div className="control-bar">
                    <Progress song={song}
                              isPlaying={this.state.playing}
                              buffered={this.state.buffered}
                              currentTime={this.state.currentTime}
                              duration={this.state.duration}/>
                    <div className="btn-group">
                        <i className={`fa fa-heart btn btn-heart ${song.favorite == 1 ? 'red' : ''}`}
                           onClick={this.syncSong.bind(this, song)}/>
                        <i className="fa fa-download btn"
                           onClick={this.download.bind(this, song)}/>
                        <span className="lrc btn" onClick={this.props.openLrc.bind(this)}>歌词</span>
                        <i className="fa fa-list-ul btn btn-list" onClick={this.props.openPlayList}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Footer);