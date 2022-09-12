import * as React from 'react';
import { Editor } from "./editor.component";
import { IComment } from "../interfaces";
import { Avatar, Comment, Input, Tooltip } from "antd";
import { Card } from "./card.component";

import * as styles from './comment-list.m.less';
import { LikeFilled, LikeOutlined } from "@ant-design/icons";

export interface ICommentListProps {
    title?: string;
    wrap?: boolean;
    comments: IComment[];
    hots: IComment[];
    onSubmit: (content: string) => void;
    onReply: (commentId: string, userId: string, content: string) => void;
    onLike?: (commentId: string, like: boolean) => void;
    commentLoading?: boolean;
    replyLoading?: boolean;
    disableChildReply?: boolean;
    hideLikeBtn?: boolean;
}

export class CommentList extends React.Component<ICommentListProps> {
    public state = {
        comment: '',
        reply: null,
    };

    componentWillReceiveProps(nextProps: Readonly<ICommentListProps>, nextContext: any): void {
        if (nextProps.replyLoading === false && this.props.replyLoading) {
            this.setState({ reply: null });
        }
    }

    handleReply(reply) {
        this.setState({ reply });
    }

    handleOnReply(comment, content) {
        this.props.onReply(comment.id, comment.user.id, content);
    }

    renderComments(comments, title) {
        if (!comments || comments.length === 0) {
            return null;
        }
        const commentList = comments.map(comment => <Comment
            key={comment.id}
            actions={[
                this.props.hideLikeBtn ? '' : <span>
                    <Tooltip title="赞">
                        {comment.isLike ?
                            <LikeFilled onClick={() => this.props.onLike(comment.id, !comment.isLike)}/> :
                            <LikeOutlined onClick={() => this.props.onLike(comment.id, !comment.isLike)}/>
                        }
                    </Tooltip>
                    <span style={{ paddingLeft: 8, cursor: 'auto' }}>{comment.like}</span>
                </span>,
                <span>
                    {this.state.reply && this.state.reply.id === comment.id ?
                        <span className={styles.reply_input}>
                            <Input.Search enterButton="回复"
                                          onSearch={content => this.handleOnReply(comment, content)}/>
                        </span> :
                        <span onClick={() => this.handleReply(comment)}> 回复 </span>
                    }
                </span>
            ]}
            author={<a>{comment.user.nickname}</a>}
            avatar={<Avatar src={comment.user.image} alt={comment.user.nickname}/>}
            content={comment.content}>
            {comment.replies.map(reply => <Comment
                key={reply.id}
                actions={[
                    <span>
                        {this.props.disableChildReply ? '' : this.state.reply && this.state.reply.id === reply.id ?
                            <span className={styles.reply_input}>
                                <Input.Search enterButton="回复"
                                              onSearch={content => this.props.onReply(reply.id, reply.user.id, content)}/>
                            </span> :
                            <span onClick={() => this.handleReply(reply)}> 回复 </span>
                        }
                    </span>
                ]}
                author={<span>
                    <a>{reply.user.nickname}</a> 回复 <a>{reply.replyUser.nickname}</a>
                </span>}
                avatar={<Avatar src={reply.user.image} alt={reply.user.nickname}/>}
                content={reply.content}/>)}
        </Comment>);

        return this.props.wrap ? <Card title={title}>
            {commentList}
        </Card> : commentList;
    }

    render() {
        const { comments = [], hots = [] } = this.props;
        const content = this.state.comment;
        return <div>
            <Card title={this.props.title || '评论'}>
                <Editor
                    loading={this.props.commentLoading}
                    onChange={comment => this.setState({
                        comment,
                        replyUser: comment === '' ? null : this.state.reply
                    })}
                    onSubmit={comment => this.props.onSubmit(comment)}
                    comment={content}/>
            </Card>
            {this.renderComments(hots, '热门')}
            {this.renderComments(comments, '最新')}
        </div>
    }
}
