/**
 * Frame
 * date: 2016年8月1日
 * author: zhaofeng
 */
import React from 'react';

import Core from './core';

export default class Container extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return <Core>{this.props.children}</Core>;
    }
}