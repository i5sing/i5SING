/**
 * Created by zhaofeng on 7/11/16.
 */
import React, {Component} from 'react';

export default class Header extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="elsa-header">
                <div className="btn-group">
                    <i className="fa fa-cog btn btn-setting"/>
                    <i className="fa fa-remove btn btn-close"/>
                </div>
            </div>
        );
    }
}