/**
 * Created by zhaofeng on 7/12/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import {
    getRankOverview
} from '../../../redux/action/rank';

const mapStateToProps = state => ({
    rank: state.rank
});

const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators({
        getRankOverview
    }, dispatch),
    dispatch
});

class Rank extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.action.getRankOverview();
    }

    render() {
        let overviews = this.props.rank.overviews || [];

        return (
            <div>
                <div className="elsa-panel rank-overview">
                    <h3 className="title">排行榜</h3>
                    <ReactCSSTransitionGroup transitionName="opacity"
                                             component="ul"
                                             className="rank-list"
                                             transitionAppear={true}
                                             transitionAppearTimeout={500}
                                             transitionEnterTimeout={500}
                                             transitionLeaveTimeout={300}>
                        {overviews.map(overview => {
                            return (
                                <li className="rank-item clear-fix pointer" key={overview.id}>
                                    <Link to={`/rank/${overview.id}`}>
                                        <img src={overview.photo}/>
                                        <div className="info-wrapper">
                                            <ul>
                                                {overview.songs.map(song => {
                                                    return (
                                                        <li className="no-wrap" key={song}>{song}</li>
                                                    )
                                                })}
                                            </ul>
                                        </div>
                                    </Link>
                                </li>
                            )
                        })}
                    </ReactCSSTransitionGroup>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Rank);