/**
 * Created by zhaofeng on 2016/7/24.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router'
import {EndScrollLoad, UserList} from '../components';
import {
    getUserFans
} from '../actions/favorite';


const mapStateToProps = state => ({
    favorite: state.favorite
});

const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators({
        getUserFans
    }, dispatch),
    dispatch
});

class Fans extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            pageSize: 35
        }
    }

    componentDidMount() {
        this.userId = this.props.location.query.userId;
        let {page, pageSize} = this.state;
        this.props.action.getUserFans(this.userId, page, pageSize);
    }

    nextPage() {
        this.state.page++;
        let {page, pageSize} = this.state;
        this.props.action.getUserFans(this.userId, page, pageSize, true);
    }

    render() {
        let fans = this.props.favorite.fans || [];
        return (
            <EndScrollLoad target="panel" onLoad={this.nextPage.bind(this)}>
                <div className="elsa-panel rank-overview">
                    <h3 className="title">我的粉丝</h3>
                    <UserList users={fans}/>
                </div>
            </EndScrollLoad>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Fans);