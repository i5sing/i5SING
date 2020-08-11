import { Dispatch } from "redux";
import { get } from 'lodash';
import * as qs from 'qs';
import { IState } from "../reducers";
import { AxiosResponse } from "axios";
import { instance } from "../helpers";
import { COMMENT, DISCOVERY_MUSICIAN, LOVE, MUSICIAN, NETWORK_STATUS } from "../constants/action-types.constant";
import { SET, UPDATE, UPDATE_PROPERTY } from "../constants/actions.constant";
import { message } from "antd";
import { I5singComment, I5singResponse, I5singUser } from "../interfaces/i5sing";
import { IComment, IUser } from "../interfaces";
import { USER_COMMENT } from "../constants/network-status.constant";
import { NetworkAction } from "./network.action";

export class UserAction {
    public static getFollowers(userId: number, page: number = 1, pageSize: number = 20) {
        return async (dispatch: Dispatch, state: () => IState) => {
            dispatch({
                type: NETWORK_STATUS,
                action: UPDATE_PROPERTY,
                path: `${LOVE}_${UPDATE_PROPERTY}_musicians`,
                data: { loading: true, nodata: false }
            });

            dispatch({
                type: NETWORK_STATUS,
                action: UPDATE_PROPERTY,
                path: `${MUSICIAN}_${UPDATE_PROPERTY}_followers`,
                data: { loading: true, nodata: false }
            });

            const url = 'http://mobileapi.5sing.kugou.com/follow/list';
            const query = { userid: userId, pageindex: page, pagesize: pageSize };
            const response: AxiosResponse<I5singResponse<I5singUser[]>> = await instance.get(
                url,
                { params: query }
            );

            let users = response.data.data.map((item: I5singUser) => ({
                id: item.ID,
                nickname: item.NN,
                image: item.I,
                birthday: item.B,
                description: item.M,
                online: item.online === 1,
                follow: item.follow === 1,
                sex: item.SX === 1 ? 'female' : 'male',
                createTime: item.CT + ''
            })) as IUser[];

            if (page !== 1) {
                const existUsers = get(state(), `musician[${userId}].followers`, []);
                users = existUsers.concat(users);
            }

            dispatch({ type: MUSICIAN, action: UPDATE_PROPERTY, path: `${userId}.followers`, data: users });
            dispatch({ type: LOVE, action: UPDATE_PROPERTY, path: 'musicians', data: users });

            dispatch({
                type: NETWORK_STATUS,
                action: UPDATE_PROPERTY,
                path: `${LOVE}_${UPDATE_PROPERTY}_musicians`,
                data: { loading: false, nodata: response.data.data.length === 0 }
            });
            dispatch({
                type: NETWORK_STATUS,
                action: UPDATE_PROPERTY,
                path: `${MUSICIAN}_${UPDATE_PROPERTY}_followers`,
                data: { loading: false, nodata: response.data.data.length === 0 }
            });
        }
    }

    public static async checkFollow(userId: string): Promise<boolean> {
        const url = 'http://mobileapi.5sing.kugou.com/follow/check';
        const query = { followuserid: userId };
        const response: AxiosResponse<I5singResponse<{ follow: number }>> = await instance.get(
            url,
            { params: query }
        );

        return response.data.data.follow === 1;
    }

    public static followUser(userId: string) {
        return async (dispatch, state: () => IState) => {
            const url = 'http://mobileapi.5sing.kugou.com/follow/create';
            const query = { followuserid: userId };
            const response: AxiosResponse<I5singResponse<any>> = await instance.get(
                url,
                { params: query }
            );
            if (!response.data.success) {
                return message.error(response.data.message)
            }

            dispatch({ type: MUSICIAN, action: UPDATE_PROPERTY, path: `['${userId}'].isFollow`, data: true });
        }
    }

    public static unfollowUser(userId: string) {
        return async (dispatch, state: () => IState) => {
            const url = 'http://mobileapi.5sing.kugou.com/follow/delete';
            const query = { followuserid: userId };
            const response: AxiosResponse<I5singResponse<any>> = await instance.get(
                url,
                { params: query }
            );
            if (!response.data.success) {
                return message.error(response.data.message)
            }

            dispatch({ type: MUSICIAN, action: UPDATE_PROPERTY, path: `['${userId}'].isFollow`, data: false });
        }
    }

    public static getLatestMusician() {
        return async (dispatch: Dispatch, state: () => IState) => {
            const url = 'http://mobileapi.5sing.kugou.com/musician/latestList';
            const response: AxiosResponse<I5singResponse<{ ID: string; NN: string; I: string; }[]>> = await instance.get(
                url,
            );
            const list = response.data.data;
            const musicians = list.map(item => ({
                id: item.ID,
                name: item.NN,
                image: item.I,
            }));
            dispatch({ type: DISCOVERY_MUSICIAN, action: UPDATE, data: musicians });
        }
    }

    public static getMusician(userId: string) {
        return async (dispatch: Dispatch, state: () => IState) => {
            const url = 'http://mobileapi.5sing.kugou.com/user/get';
            const query = {
                userid: userId,
                apiVersion: 1,
                fields: 'ID,NN,I,B,P,C,SX,E,M,VT,CT,TYC,TFC,TBZ,TFD,TFS,SC,YCRQ,FCRQ,CC,BG,DJ,RC,MC,AU,SR,SG,VG,ISC,F,OP,UBG,ISH'
            };
            const response: AxiosResponse<I5singResponse<I5singUser>> = await instance.get(
                url,
                { params: query }
            );

            const existUser: IUser = state().musician[userId];

            const item = response.data.data;
            const user = {
                ...existUser,
                id: item.ID,
                nickname: item.NN,
                image: item.I,
                birthday: item.B,
                description: item.M,
                online: item.online === 1,
                follow: item.follow === 1,
                sex: item.SX === 1 ? 'female' : 'male',
                createTime: item.CT,
                province: item.P,
                city: item.C,
                isFollow: item.follow === 1,
            };

            dispatch({ type: MUSICIAN, action: UPDATE_PROPERTY, data: user, path: user.id });
        }
    }

    public static getMusicianComments(userId: string, maxId: string, limit: number = 30) {
        return async (dispatch, state: () => IState) => {
            dispatch(NetworkAction.fetching(USER_COMMENT));
            const url = 'http://mobileapi.5sing.kugou.com/comments/list';
            const query = { rootKind: 'guestBook', rootId: userId, maxId, limit };
            const response: AxiosResponse<I5singResponse<{ comments: I5singComment[] }[]>> = await instance.get(
                url,
                { params: query }
            );
            let guestBook: IComment[] = [];
            dispatch(NetworkAction.success(USER_COMMENT, response.data.data.length === 0));
            response.data.data.map(item =>
                item.comments.forEach((comment: I5singComment) => guestBook.push({
                    id: comment.id,
                    content: comment.content,
                    createTime: comment.createTime,
                    repliesCount: comment.repliesCount,
                    like: comment.like,
                    isLike: comment.isLike === 1,
                    user: {
                        id: comment.user.ID,
                        nickname: comment.user.NN,
                        image: comment.user.I
                    },
                    replies: comment.replys.map((reply: I5singComment) => ({
                        id: reply.id,
                        content: reply.content,
                        createTime: reply.createTime,
                        repliesCount: reply.repliesCount,
                        like: reply.like,
                        isLike: reply.isLike === 1,
                        replyUser: {
                            id: reply.replyUser.ID,
                            nickname: reply.replyUser.NN,
                            image: reply.replyUser.I,
                        },
                        user: {
                            id: reply.user.ID,
                            nickname: reply.user.NN,
                            image: reply.user.I
                        },
                    }))
                }))
            );
            if (maxId !== '0') {
                const exists = state().comment.guestBook || [];
                const comments = [];
                for (let i = 0; i < exists.length; i++) {
                    const comment = exists[i];
                    if (comment.id === maxId) {
                        break;
                    }
                    comments.push(comment);
                }
                guestBook = comments.concat(guestBook);
            }
            dispatch({ type: COMMENT, action: SET, data: { guestBook } });
        }
    }

    public static comment(userId: string, content: string, replyUserId?: string, commentId?: string) {
        return async (dispatch, state: () => IState) => {
            const url = 'http://mobileapi.5sing.kugou.com/comments/create';
            const form = { rootId: userId, content, owner: userId, rootKind: 'guestBook', replyUserId, commentId };
            const response: AxiosResponse<I5singResponse<any>> = await instance.post(
                url,
                qs.stringify(form)
            );
            if (!response.data.success) {
                return message.error(response.data.message);
            }

            if (replyUserId) {
                const exists = state().comment.guestBook || [];
                const target = exists.filter(exist => exist.id === commentId)[0];
                if (target) {
                    target.replies.unshift({
                        id: '',
                        content,
                        createTime: new Date().toString(),
                        repliesCount: 0,
                        like: 0,
                        isLike: false,
                        replyUser: {
                            id: Number(replyUserId),
                            nickname: replyUserId,
                            image: '',
                        },
                        user: {
                            id: 0,
                            nickname: '',
                            image: ''
                        },
                    });
                    dispatch({ type: COMMENT, action: SET, data: { guestBook: exists } });
                }
            } else {
                dispatch(UserAction.getMusicianComments(userId, commentId));
            }

        }
    }
}
