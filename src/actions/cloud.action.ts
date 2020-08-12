import { instance } from "../helpers";
import { AxiosResponse } from 'axios';
import { Dispatch } from 'redux';
import { IState } from "../reducers";
import { message } from "antd";
import { ipcRenderer } from "electron";
import { ICloud, ICloudSong } from "../interfaces";
import { CLOUD } from "../constants/action-types.constant";
import { SET, UPDATE_PROPERTY } from "../constants/actions.constant";
import { SYNC_CACHE_EVENT } from "../constants/events.constant";

export class CloudAction {
    public static getCloudSongs(callback?: Function) {
        return async (dispatch: Dispatch) => {
            try {
                const url = 'http://127.0.0.1:56562/cloud/songs';
                const query = { isfirst: 2 };
                const response: AxiosResponse<{ items: ICloudSong[] }> = await instance.get(
                    url,
                    { params: query }
                );
                dispatch({ type: CLOUD, action: UPDATE_PROPERTY, path: 'songs', data: response.data.items });
                if (callback) {
                    callback();
                }
            } catch (e) {
                message.error(e.response ? e.response.data.message : e.message);
            }
        }
    }

    public static deleteCloudSong(name: string) {
        return async (dispatch, state) => {
            try {
                const songs = state().cloud.songs || [];
                const newSongs = songs.filter(song => song.key !== name);
                dispatch({ type: CLOUD, action: UPDATE_PROPERTY, path: 'songs', data: [...newSongs] });
                const url = 'http://127.0.0.1:56562/cloud/songs/' + encodeURIComponent(name);
                await instance.delete(url);
            } catch (e) {
                message.error(e.response ? e.response.data.message : e.message);
            }
        }
    }

    public static updateConfig(config: ICloud) {
        return async (dispatch: Dispatch, state: () => IState) => {
            config.songs = state().cloud.songs;
            dispatch({ type: CLOUD, action: SET, data: config });
            ipcRenderer.send(SYNC_CACHE_EVENT);
        }
    }
}
