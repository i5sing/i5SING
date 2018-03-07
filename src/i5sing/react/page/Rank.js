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
} from '../redux/action/rank';

import './Rank.less';

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
                <article className="i-panel rank-overview">
                    <header className="i-panel-header">
                        <h3 className="i-panel-header-title">排行榜</h3>
                    </header>
                    <section className="i-panel-body">
                        <ReactCSSTransitionGroup transitionName="opacity"
                                                 component="ul"
                                                 className="card-list"
                                                 transitionAppear={true}
                                                 transitionAppearTimeout={500}
                                                 transitionEnterTimeout={500}
                                                 transitionLeaveTimeout={300}>
                            {overviews.map(overview => {
                                return (
                                    <li className="card-list-item pointer" key={overview.id}>
                                        <div className="adapter clear-fix">
                                            <Link to={`/rank/${overview.id}`}>
                                                <img className="card-list-item-img" src={overview.photo}/>
                                                <ul className="card-list-item-desc">
                                                    {overview.songs.map(song => {
                                                        return (
                                                            <li className="no-wrap"
                                                                key={song}>{song}</li>
                                                        )
                                                    })}
                                                </ul>
                                            </Link>
                                        </div>
                                    </li>
                                )
                            })}
                        </ReactCSSTransitionGroup>
                    </section>
                </article>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Rank);