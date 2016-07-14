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
    getSongAddr,
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
        succeed
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
            playing: false
        };
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
            this.setState({currentTime: this.media.currentTime, buffered: this.media.buffered.end(0)});
        });

        //成功获取资源长度
        this.media.addEventListener('loadedmetadata', () => {
            this.setState({duration: this.media.duration});
        });

        this.media.addEventListener('ended', () => {
            this.setState({index: this.state.index + 1}, this.loadSongAddress);
        });
    }

    componentWillReceiveProps(nextProps) {
        let common = nextProps.common;
        if (common.success) return;

        if (common.playing && !common.resume) {
            this.setState({playing: true, index: 0}, this.loadSongAddress);
        } else if (common.playing) {
            this.setState({playing: true});
            this.media.play();
        } else if (!common.playing) {
            this.setState({playing: false});
            this.media.pause();
        }
        this.props.action.succeed();
    }

    loadSongAddress() {
        this.setState({playing: true});
        let song = this.props.common.playlist[this.state.index];
        getSongAddr(song.id, song.type).then(result => {
            setTimeout(() => {
                this.media.src = result.data.squrl || result.data.hqurl || result.data.lqurl;
                this.media.play();
            }, 150);
        });
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
        let index = this.state.index;
        if (this.props.common.playing && index) {
            this.setState({index: this.state.index - 1}, this.loadSongAddress);
        }
    }

    next() {
        let index = this.state.index;
        if (this.props.common.playing && index < this.props.common.playlist.length - 1) {
            this.setState({index: this.state.index + 1}, this.loadSongAddress);
        }
    }

    render() {
        let index = this.state.index;
        let playlist = this.props.common.playlist || [];
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
                              buffered={this.state.buffered}
                              currentTime={this.state.currentTime}
                              duration={this.state.duration}/>
                    <div className="btn-group">
                        <i className="fa fa-heart btn btn-heart"/>
                        <i className="fa fa-download btn"/>
                        <span className="lrc btn">歌词</span>
                        <i className="fa fa-list-ul btn btn-list" onClick={this.props.openPlayList}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Footer);