/**
 * Created by zhaofeng on 7/12/16.
 */
import React, {Component} from 'react';

export default class Lrc extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props.song);
        return (
            <div>
                <div className="elsa-panel elsa-panel-no-margin elsa-list elsa-list-3 relative">
                    <h3 className="title">播放列表</h3>
                    <div className="elsa-panel-body elsa-list-body clear-fix">

                    </div>
                </div>
            </div>
        );
    }
}