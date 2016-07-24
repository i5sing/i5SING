/**
 * Created by zhaofeng on 2016/7/24.
 */
import React, {Component} from 'react';
import {Link} from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class CollectionList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let collections = this.props.collections || [];
        return (
            <ReactCSSTransitionGroup transitionName="opacity"
                                     transitionAppear={true}
                                     transitionAppearTimeout={500}
                                     component="ul"
                                     className="elsa-list collection-list"
                                     transitionEnterTimeout={500}
                                     transitionLeaveTimeout={300}>
                {collections.map((collection, index) => {
                    index++;
                    return (
                        <li className={`collection-item ${index % 5 == 0 ? 'last-child' : ''}`}
                            key={`${collection.ID}${index}`}>
                            <Link to={`/collection/${collection.ID}`}>
                                <img src={collection.P}/>
                            </Link>
                            <div className="collection-title highlight-normal no-wrap">
                                <Link to={`/collection/${collection.ID}`}>{collection.T}</Link>
                            </div>
                        </li>
                    )
                })}
            </ReactCSSTransitionGroup>
        );
    }
}