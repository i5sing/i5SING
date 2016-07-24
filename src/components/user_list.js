/**
 * Created by zhaofeng on 2016/7/24.
 */
import React, {Component} from 'react';
import {Link} from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class UserList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let attentionUsers = this.props.users || [];
        return (
            <ReactCSSTransitionGroup transitionName="opacity"
                                     component="ul"
                                     className="elsa-list user-list"
                                     transitionAppear={true}
                                     transitionAppearTimeout={500}
                                     transitionEnterTimeout={500}
                                     transitionLeaveTimeout={300}>
                {attentionUsers.map(user => {
                    return (
                        <li className="user-item"
                            key={`${user.ID}`}>
                            <Link to={`/user/${user.ID}`}>
                                <img src={user.I}/>
                            </Link>
                            <div className="user-item-title highlight-normal no-wrap">
                                <Link to={`/user/${user.ID}`}>{user.NN}</Link>
                            </div>
                        </li>
                    )
                })}
            </ReactCSSTransitionGroup>
        );
    }
}