/**
 * Created by zhaofeng on 7/13/16.
 */
import React, {Component} from 'react';

export default class Pagination extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let count = this.props.count || 0,
            pageSize = this.props.pageSize || 20,
            onChange = this.props.onChange;
        
        return (
            <div className="elsa-pagination">

            </div>
        );
    }
}