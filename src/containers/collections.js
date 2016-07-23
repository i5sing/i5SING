/**
 * Created by zhaofeng on 7/14/16.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {EndScrollLoad} from '../components';
import {
    getSongCollections
} from '../actions/collection';

const mapStateToProps = state => ({
    collection: state.collection
});

const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators({
        getSongCollections
    }, dispatch),
    dispatch
});

class Collections extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageIndex: 1
        };
    }

    componentDidMount() {
        this.props.action.getSongCollections(this.state.pageIndex);
    }

    onLoad() {
        this.state.pageIndex += 2;
        this.props.action.getSongCollections(this.state.pageIndex, true);
    }

    render() {
        let collections = this.props.collection.collections || [];

        return (
            <EndScrollLoad target={'panel'} onLoad={this.onLoad.bind(this)}>
                <div className="elsa-panel collection">
                    <h3 className="title">歌单</h3>
                    <ul className="collection-list">
                        <ReactCSSTransitionGroup transitionName="opacity"
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
                    </ul>
                </div>
            </EndScrollLoad>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Collections);