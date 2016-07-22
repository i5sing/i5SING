/**
 * Created by zhaofeng on 21/07/2016.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router'

const mapStateToProps = state => ({
    search: state.search
});

const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators({}, dispatch),
    dispatch
});

class Search extends Component {
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
                    
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);