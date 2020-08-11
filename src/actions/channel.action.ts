import { instance } from "../helpers";
import { AxiosResponse } from 'axios';
import { Dispatch } from 'redux';
import { IState } from "../reducers";
import { CHANNELS, DISCOVERY_CHANNEL, NETWORK_STATUS } from "../constants/action-types.constant";
import { SET, UPDATE_PROPERTY } from "../constants/actions.constant";
import { I5singChannel, I5singResponse } from "../interfaces/i5sing";
import { IChannel } from "../interfaces";

export class ChannelAction {
    public static getChannels(page: number = 1, pageSize?: number) {
        return async (dispatch: Dispatch, state: () => IState) => {
            dispatch({
                type: NETWORK_STATUS,
                action: UPDATE_PROPERTY,
                path: `${CHANNELS}_${SET}`,
                data: { loading: true, nodata: false }
            });

            const url = 'http://mobileapi.5sing.kugou.com/song/GetRecommendSingle';
            const query = { channel_id: 1, page, pagesize: pageSize };
            const response: AxiosResponse<I5singResponse<I5singChannel[]>> = await instance.get(
                url,
                { params: query }
            );

            let channels = response.data.data.map((item: I5singChannel) => ({
                picture: item.pic,
                id: item.id,
                name: item.name,
                songName: item.song_name,
                time: item.time,
                words: item.words,
                playTime: item.play_time,
                type: item.type,
                click: Number(item.click),
                url: item.url,
                user: {
                    id: Number(item.user_id),
                    nickname: item.nickname,
                    image: item.user_pic,
                }
            })) as IChannel[];

            if (page === 1) {
                dispatch({ type: DISCOVERY_CHANNEL, action: SET, data: channels.slice(0, 6) });
                dispatch({ type: CHANNELS, action: SET, data: channels });
            } else {
                let existChannels: IChannel[] = state().channels;
                channels = existChannels.concat(channels);
                dispatch({ type: CHANNELS, action: SET, data: channels });
            }

            dispatch({
                type: NETWORK_STATUS,
                action: UPDATE_PROPERTY,
                path: `${CHANNELS}_${SET}`,
                data: { loading: false, nodata: response.data.data.length === 0 }
            });
        }
    }
}
