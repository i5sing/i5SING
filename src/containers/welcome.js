/**
 * Created by zhaofeng on 7/11/16.
 */
import React, {Component} from 'react';

export default class Welcome extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {

    }

    render() {
        return (
            <div className="panel">
                <h3>Welcome</h3>
            </div>
        );
    }
}