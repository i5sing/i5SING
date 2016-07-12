/**
 * Created by zhaofeng on 7/11/16.
 */
import React, {Component} from 'react';

import Player from './player';
import Progress from './progress';

export default class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTime: 0,
            duration: 0,
            picture: 'http://img2.5sing.kgimg.com/m/T1nsCaB7JT1RXrhCrK.jpg',
            songAddress: 'http://data.5sing.kgimg.com/G030/M08/17/07/voYBAFX5BHiIcqh5AA8GdoA88WkAABsCwL5wFsADwaO919.m4a',
            isPlaying: false,
            songName: ''
        };
    }

    componentDidMount() {
        this.media = new Audio('');

        //时间改变
        this.media.addEventListener('timeupdate', () => {
            this.setState({currentTime: this.media.currentTime});
        });

        //成功获取资源长度
        this.media.addEventListener('loadedmetadata', () => {
            this.setState({duration: this.media.duration});
            this.setState({songName: '测试'});
        });
    }

    play() {
        if (this.state.isPlaying) {
            this.setState({isPlaying: false});
            return this.media.pause();
        } else if (this.media.readyState > 1) {
            this.setState({isPlaying: true});
            return this.media.play();
        } else {
            this.setState({isPlaying: true});
            this.setState({songName: '正在加载中,请稍候...'});
            this.media.src = this.state.songAddress;
            return this.media.play();
        }
    }

    render() {
        return (
            <div className="elsa-footer">
                <div className="player">
                    <Player play={this.play.bind(this)} isPlaying={this.state.isPlaying}/>
                </div>
                <div className="control-bar">
                    <Progress songName={this.state.songName}
                              picture={this.state.picture}
                              currentTime={this.state.currentTime}
                              duration={this.state.duration}/>
                    <div className="btn-group">
                        <i className="fa fa-heart btn btn-heart"/>
                        <i className="fa fa-download btn"/>
                        <span className="lrc btn">歌词</span>
                        <i className="fa fa-list-ul btn btn-list"/>
                    </div>
                </div>
            </div>
        );
    }
}