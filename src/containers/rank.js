/**
 * Created by zhaofeng on 7/12/16.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router'
import {
    getRankOverview
} from '../actions/rank';

const mapStateToProps = state => ({
    rank: state.rank
});

const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators({
        getRankOverview
    }, dispatch),
    dispatch
});

class Rank extends Component {
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
                    <h3>排行榜</h3>
                    <ul className="rank-list">
                        {overviews.map(overview => {
                            return (
                                <Link to={`/rank/${overview.id}`} key={overview.id}>
                                    <li className="rank-item clear-fix pointer">
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
                                    </li>
                                </Link>
                            )
                        })}
                    </ul>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Rank);