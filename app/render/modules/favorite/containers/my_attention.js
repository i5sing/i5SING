/**
 * Created by zhaofeng on 2016/7/24.
 */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {
    EndScrollLoad,
    UserList
} from '../../../components';
import {
    getUserCollections
} from '../../../redux/action/favorite';


const mapStateToProps = state => ({
    favorite: state.favorite
});

const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators({
        getUserCollections
    }, dispatch),
    dispatch
});

class MyAttention extends React.Component {
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
        this.props.action.getUserCollections(this.userId, page, pageSize);
    }

    nextPage() {
        this.state.page++;
        let {page, pageSize} = this.state;
        this.props.action.getUserCollections(this.userId, page, pageSize, true);
    }

    render() {
        let attentionUsers = this.props.favorite.attentionUsers || [];
        return (
            <EndScrollLoad target="panel" onLoad={this.nextPage.bind(this)}>
                <div className="elsa-panel rank-overview">
                    <h3 className="title">我的关注</h3>
                    <UserList users={attentionUsers}/>
                </div>
            </EndScrollLoad>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAttention);