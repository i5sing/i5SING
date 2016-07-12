/**
 * Created by zhaofeng on 7/11/16.
 */
import React, {Component} from 'react';

export default class Progress extends Component {
    constructor(props) {
        super(props);
        this.formatTime = this.formatTime.bind(this);
    }

    formatTime(time) {
        if (!time) {
            return '00:00';
        }

        let minute = parseInt(time / 60),
            second = parseInt(time % 60);

        minute = minute < 10 ? `0${minute}` : minute;
        second = second < 10 ? `0${second}` : second;
        return `${minute}:${second}`;
    }

    render() {
        let currentTime = this.props.currentTime || 0,
            duration = this.props.duration || 0.1;

        return (
            <div className="elsa-progress">
                <div className="head-img">
                    <img src={this.props.picture}/>
                </div>
                <div className="wrapper">
                    <div className="info">
                        <div className="song-name">{this.props.songName}</div>
                        <div className="time">{this.formatTime(currentTime)}/{this.formatTime(duration)}</div>
                    </div>
                    <div className="progress">
                    <span className="current-progress" style={{width: 525 * currentTime / duration}}>
                        <span className="circle-chunk"></span>
                    </span>
                    </div>
                </div>
            </div>
        );
    }
}