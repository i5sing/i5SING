/**
 * Created by zhaofeng on 7/11/16.
 */
import React, {Component} from 'react';
import ipc from '../backend/ipc';

export default class Header extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    forward() {
        ipc.render.send('go-back-forward', 'forward');
    }

    back() {
        ipc.render.send('go-back-forward', 'back');
    }

    /*
     <div className="btn-group pull-right">
     <i className="fa fa-cog btn btn-setting"/>
     <i className="fa fa-remove btn btn-close"/>
     </div>
     */

    render() {
        return (
            <div className="elsa-header clear-fix">
                <div className="btn-group pull-left">
                    <i className={`fa fa-arrow-left btn btn-left`}
                       onClick={this.back.bind(this)}/>
                    <i className="fa fa-arrow-right btn btn-right"
                       onClick={this.forward.bind(this)}/>
                </div>

            </div>
        );
    }
}