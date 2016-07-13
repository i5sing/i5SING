/**
 * Created by zhaofeng on 7/13/16.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {} from '../actions/rank';

const mapStateToProps = state => ({
    rank: state.rank
});

const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators({}, dispatch),
    dispatch
});

class RankList extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let rankId = this.props.routeParams.rankId;
    }

    render() {
        let overviews = this.props.rank.overviews || [];

        return (
            <div>
                <div className="elsa-panel rank-overview">

                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RankList);