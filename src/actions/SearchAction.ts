import { I5singResponse } from "../interfaces/i5sing/I5singResponse";
import { instance } from "../utils/HttpUtil";
import { Dispatch } from 'redux';
import { NETWORK_STATUS, SEARCH } from "../constants/ActionTypes";
import { UPDATE, UPDATE_PROPERTY } from "../constants/Actions";
import { IState } from "../reducers";
import {
    I5singSearch,
    I5singSearchMusician,
    I5singSearchPlay,
    I5singSearchSong
} from "../interfaces/i5sing/I5singSearch";
import { ISearch } from "../interfaces/ISearch";

export class SearchAction {
    public static search(key: string, type: string, page: number, size: number) {
        return async (dispatch: Dispatch, state: () => IState) => {
            dispatch({
                type: NETWORK_STATUS,
                action: UPDATE_PROPERTY,
                path: `${ SEARCH }_${ UPDATE }`,
                data: { loading: true, nodata: false }
            });

            const url = 'http://mobileapi.5sing.kugou.com/go/search';
            let query = { k: key, pn: page, ps: size, filterType: 1, sortType: 0, t: 2 };
            switch (type) {
                case 'musician':
                    query.filterType = 1;
                    query.sortType = 0;
                    query.t = 2;
                    break;
                case 'user':
                    query.filterType = 0;
                    query.sortType = 0;
                    query.t = 2;
                    break;
                case 'play':
                    query.filterType = 0;
                    query.sortType = 0;
                    query.t = 1;
                    break;
                case 'song':
                    query.filterType = 0;
                    query.sortType = 0;
                    query.t = 0;
                    break;
                case 'yc':
                    query.filterType = 1;
                    query.sortType = 0;
                    query.t = 0;
                    break;
                case 'fc':
                    query.filterType = 2;
                    query.sortType = 0;
                    query.t = 0;
                    break;
                case 'bz':
                    query.filterType = 3;
                    query.sortType = 0;
                    query.t = 0;
                    break;
            }
            const response = await instance.get<I5singResponse<I5singSearch>>(
                url,
                { params: query }
            );

            let existSearch: ISearch = { songs: [], plays: [], users: [] };
            if (page !== 1) {
                existSearch = state().search;
            }

            const search: ISearch = {
                songs: existSearch.songs.concat(response.data.data.songArray.map((song: I5singSearchSong) => ({
                    id: song.songId + '',
                    name: song.songName,
                    kind: song.type === 1 ? 'yc' : song.type === 2 ? 'fc' : 'bz',
                    user: {
                        id: song.singerId,
                        nickname: song.singer,
                    }
                }))),
                plays: existSearch.plays.concat(response.data.data.songMenu.map((play: I5singSearchPlay) => ({
                    id: play.listId,
                    title: play.listName,
                    picture: play.url,
                    playCount: play.playcount,
                    user: {
                        id: play.userId,
                        nickname: '',
                    }
                }))),
                users: existSearch.users.concat(response.data.data.user.map((user: I5singSearchMusician) => ({
                    id: user.userId,
                    nickname: user.nickName,
                    image: user.url,
                })))
            };

            dispatch({ type: SEARCH, action: UPDATE, data: search });

            dispatch({
                type: NETWORK_STATUS,
                action: UPDATE_PROPERTY,
                path: `${ SEARCH }_${ UPDATE }`,
                data: {
                    loading: false,
                    nodata: ['song', 'yc', 'fc', 'bz'].includes(type) ?
                        response.data.data.songArray.length === 0 :
                        type === 'musician' ? response.data.data.user.length === 0 :
                            type === 'play' ? response.data.data.songMenu.length === 0 : true,
                }
            });
        }
    }
}
