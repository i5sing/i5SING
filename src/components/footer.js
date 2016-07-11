/**
 * Created by zhaofeng on 7/11/16.
 */
import React, {Component} from 'react';

import Player from './player';
import Progress from './progress';

export default class Footer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="elsa-footer">
                <div className="player">
                    <Player />
                </div>
                <div className="control-bar">
                    <Progress />
                </div>
            </div>
        );
    }
}