/**
 * Created by zhaofeng on 7/11/16.
 */
import React, {Component} from 'react';

export default class Player extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let playTypeBtnIcon = 'fa-list-ol';
        if (this.props.playType == 1) {
            playTypeBtnIcon = 'fa-random';
        } else if (this.props.playType == 2) {
            playTypeBtnIcon = 'fa-repeat'
        }

        return (
            <div className="elsa-player">
                <i className="fa fa-step-backward btn btn-backward btn-highlight" onClick={this.props.previous}/>
                <i className={`fa fa-play btn btn-play btn-highlight ${this.props.isPlaying ? 'fa-pause' : 'fa-play'}`}
                   onClick={this.props.play}/>
                <i className="fa fa-step-forward btn btn-backward btn-highlight" onClick={this.props.next}/>
                <i className="fa fa-volume-down btn btn-volume"/>
                <i className={`fa btn btn-play-type ${playTypeBtnIcon}`}
                    onClick={this.props.onPlayTypeChange}/>
            </div>
        );
    }
}