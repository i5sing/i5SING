/**
 * Created by zhaofeng on 7/11/16.
 */
import React, {Component} from 'react';

export default class Progress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initial: false
        }
    }

    static formatTime(time) {
        if (!time) {
            return '00:00';
        }

        let minute = parseInt(time / 60),
            second = parseInt(time % 60);

        minute = minute < 10 ? `0${minute}` : minute;
        second = second < 10 ? `0${second}` : second;
        return `${minute}:${second}`;
    }

    componentWillReceiveProps() {
        if (this.props.isPlaying) {
            this.setState({
                initial: true
            })
        }
    }

    render() {
        let currentTime = this.props.currentTime || 0,
            duration = this.props.duration || 0.1,
            buffered = this.props.buffered || 0;
        let song = this.props.song || {};
        return (
            <div className="elsa-progress">
                <div className="head-img">
                    {this.state.initial && (<img src={song.user.I}/>)}
                </div>
                <div className="wrapper">
                    <div className="info">
                        <div className="song-name">{this.state.initial && song.SN + ' - ' + song.user.NN}</div>
                        {this.state.initial && (
                            <div className="time">
                                {Progress.formatTime(currentTime)}/{Progress.formatTime(duration)}
                            </div>
                        )}
                        {!this.state.initial && (
                            <div className="time">
                                00:00/00:00
                            </div>
                        )}
                    </div>
                    <div className="progress">
                        <span className="current-progress buffered" style={{width: 525 * buffered / duration}}/>
                        <span className="current-progress" style={{width: 525 * currentTime / duration}}>
                            <span className="circle-chunk"/>
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}