import { Dispatch } from "redux";
import { get } from 'lodash';
import { IState } from "../reducers";
import { AxiosResponse } from "axios";
import { I5singResponse } from "../interfaces/i5sing/I5singResponse";
import { instance } from "../utils/HttpUtil";
import { I5singUser } from "../interfaces/i5sing/I5singUser";
import { LOVE, MUSICIAN, NETWORK_STATUS } from "../constants/ActionTypes";
import { UPDATE_PROPERTY } from "../constants/Actions";
import { IUser } from "../interfaces/IUser";
import { message } from "antd";

export class UserAction {
    public static getFollowers(userId: number, page: number = 1, pageSize: number = 20) {
        return async (dispatch: Dispatch, state: () => IState) => {
            dispatch({
                type: NETWORK_STATUS,
                action: UPDATE_PROPERTY,
                path: `${ LOVE }_${ UPDATE_PROPERTY }_musicians`,
                data: { loading: true, nodata: false }
            });

            dispatch({
                type: NETWORK_STATUS,
                action: UPDATE_PROPERTY,
                path: `${ MUSICIAN }_${ UPDATE_PROPERTY }_followers`,
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
                const existUsers = get(state(), `musician[${ userId }].followers`, []);
                users = existUsers.concat(users);
            }

            dispatch({ type: MUSICIAN, action: UPDATE_PROPERTY, path: `${ userId }.followers`, data: users });
            dispatch({ type: LOVE, action: UPDATE_PROPERTY, path: 'musicians', data: users });

            dispatch({
                type: NETWORK_STATUS,
                action: UPDATE_PROPERTY,
                path: `${ LOVE }_${ UPDATE_PROPERTY }_musicians`,
                data: { loading: false, nodata: response.data.data.length === 0 }
            });
            dispatch({
                type: NETWORK_STATUS,
                action: UPDATE_PROPERTY,
                path: `${ MUSICIAN }_${ UPDATE_PROPERTY }_followers`,
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

            dispatch({ type: MUSICIAN, action: UPDATE_PROPERTY, path: `['${ userId }'].isFollow`, data: true });
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

            dispatch({ type: MUSICIAN, action: UPDATE_PROPERTY, path: `['${ userId }'].isFollow`, data: false });
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
}
