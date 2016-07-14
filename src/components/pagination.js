/**
 * Created by zhaofeng on 7/13/16.
 */
import React, {Component} from 'react';

export default class Pagination extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 1
        }
    }

    onChange(page) {
        if (page == this.state.current) return;

        this.setState({current: page});
        this.props.onChange && this.props.onChange(page);
    }

    render() {
        let count = this.props.count || 0,
            pageSize = this.props.pageSize || 20;

        let pages = [];
        for (let page = 0; page < count / pageSize; page++) {
            pages.push(page + 1);
        }

        return (
            <div className="elsa-pagination">
                <ul>
                    {pages.map(page => {
                        {
                            return (
                                <li className={`pointer ${this.state.current == page ? 'active' : ''}`}
                                    onClick={this.onChange.bind(this, page)}
                                    key={page}>{page}
                                </li>
                            )
                        }
                    })}
                </ul>
            </div>
        );
    }
}