/**
 * Created by zhaofeng on 7/11/16.
 */
import React, {Component} from 'react';

export default class Player extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let playBtnClasses = 'fa fa-play btn btn-play btn-highlight ';
        playBtnClasses += this.props.isPlaying ? 'fa-pause' : 'fa-play';
        return (
            <div className="elsa-player">
                <i className="fa fa-step-backward btn btn-backward btn-highlight" onClick={this.props.previous}/>
                <i className={playBtnClasses} onClick={this.props.play}/>
                <i className="fa fa-step-forward btn btn-backward btn-highlight" onClick={this.props.next}/>
                <i className="fa fa-volume-down btn btn-volume"/>
                <i className="fa fa-random btn btn-volume"/>
            </div>
        );
    }
}