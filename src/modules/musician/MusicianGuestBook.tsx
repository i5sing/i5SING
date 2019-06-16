import * as React from 'react';
import { get } from 'lodash';
import { connect } from 'react-redux';
import { IState } from "../../reducers";
import { bindActionCreators, Dispatch } from "redux";
import { actions } from "../../utils/ActionUtil";
import { UserAction } from "../../actions/UserAction";
import { IComment } from "../../interfaces/IComment";
import { CommentList } from "../../components/CommentList";
import { EndLoader } from "../../components/EndLoader";
import { USER_COMMENT } from "../../constants/NetworkStatus";
import { INetwork } from "../../interfaces/INetwork";
import { Loading } from "../../components/Loading";

export interface IMusicianGuestBookProps {
    comments?: IComment[];
    actions?: {
        user: typeof UserAction;
    }
    musicianId: string;
    net?: {
        [USER_COMMENT]: INetwork;
    }
}

@connect(
    (state: IState) => ({
        comments: state.comment.guestBook,
        net: state.networks
    }),
    (dispatch: Dispatch) => ({
        actions: {
            user: bindActionCreators(actions(UserAction), dispatch),
        }
    })
)
export class MusicianGuestBook extends React.Component<IMusicianGuestBookProps> {
    componentDidMount(): void {
        this.props.actions.user.getMusicianComments(this.props.musicianId, '0');
    }

    comment(content: string, commentId?: string, userId?: string) {
        this.props.actions.user.comment(this.props.musicianId, content, userId, commentId);
    }

    nextPage() {
        const comments = this.props.comments;
        if (comments.length > 0) {
            const last = comments[comments.length - 1];
            this.props.actions.user.getMusicianComments(this.props.musicianId, last.id);
        }
    }

    render() {
        const network = get(this.props.net, USER_COMMENT, { nodata: false, loading: true });
        return <div style={ { padding: '0 30px' } }>
            <EndLoader target="main" onLoad={ () => !network.nodata && this.nextPage() }>
                <CommentList comments={ this.props.comments } hots={ [] }
                             title="留言" wrap={ false } disableChildReply={ true }
                             onReply={ (commentId, userId, content) => this.comment(content, content, commentId) }
                             onSubmit={ content => this.comment(content) }/>
                <Loading loading={ network.loading } nodata={ network.nodata }/>
            </EndLoader>
        </div>
    }
}
