/**
 * Created by zhaofeng on 7/11/16.
 */
import React from 'react';

import './Button.less';

export default class Button extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let classes = this.props.type === 'primary' ?
            'elsa-button btn-primary ' :
            'elsa-button ';

        classes += this.props.size === 'large' ?
            'btn-lg' : 'btn-md';

        return (
            <button type="button" className={classes} onClick={this.props.onClick}>
                {this.props.children}
            </button>
        );
    }
}