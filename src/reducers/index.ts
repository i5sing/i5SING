import { combineReducers } from 'redux';
import { createReducer } from '../utils/ReducerUtil';
import {
    CHANNELS, CLOUD, COMMENT,
    CURRENT,
    DISCOVERY_CAROUSEL,
    DISCOVERY_CHANNEL,
    DISCOVERY_LATEST_SONGS,
    DISCOVERY_MOVIE,
    DISCOVERY_PLAYLIST,
    DOWNLOAD, LOVE,
    MOVIE,
    MOVIES, MUSICIAN, MY,
    NETWORK_STATUS,
    PLAY,
    PLAYS, SEARCH,
    STYLE_TOP,
    STYLE_TOP_DETAIL, SYSTEM,
    TOP,
    TOP_DETAIL
} from '../constants/ActionTypes';
import { ICarousel } from "../interfaces/ICarousel";
import { IMovie } from "../interfaces/IMovie";
import { IPlay } from "../interfaces/IPlay";
import { ILatestSong } from "../interfaces/ILatestSong";
import { IChannel } from "../interfaces/IChannel";
import { ITop } from "../interfaces/ITop";
import { ITopDetail } from "../interfaces/ITopDetail";
import { IStyleTop } from "../interfaces/IStyleTop";
import { ICurrent } from "../interfaces/ICurrent";
import { IDownload } from "../interfaces/IDownload";
import { ISong } from "../interfaces/ISong";
import { ISystem } from "../interfaces/ISystem";
import { IUser } from "../interfaces/IUser";
import { ICloud } from "../interfaces/ICloud";
import { ISearch } from "../interfaces/ISearch";
import { IComment } from "../interfaces/IComment";

export default combineReducers({
    system: createReducer<ISystem>(SYSTEM, {
        sign: '',
        userId: -1,
        nickname: '',
        homePath: '',
        canGoBack: false,
        canGoForward: false,
        avatar: '',
    }),
    networks: createReducer(NETWORK_STATUS, {}),
    discoveryCarousels: createReducer<ICarousel[]>(DISCOVERY_CAROUSEL, []),
    discoveryMovies: createReducer<IMovie[]>(DISCOVERY_MOVIE, []),
    discoveryPlays: createReducer<IPlay[]>(DISCOVERY_PLAYLIST, []),
    discoveryLatestSongs: createReducer<ILatestSong[]>(DISCOVERY_LATEST_SONGS, []),
    discoveryChannels: createReducer<IChannel[]>(DISCOVERY_CHANNEL, []),
    channels: createReducer<IChannel[]>(CHANNELS, []),
    tops: createReducer<ITop[]>(TOP, []),
    styleTops: createReducer<ITopDetail[]>(STYLE_TOP, []),
    top: createReducer<ITopDetail[]>(TOP_DETAIL, []),
    styleTop: createReducer<ITop[]>(STYLE_TOP_DETAIL, []),
    plays: createReducer<IPlay[]>(PLAYS, []),
    play: createReducer<IPlay>(PLAY, { songs: [] } as any),
    movies: createReducer<IMovie[]>(MOVIES, []),
    movie: createReducer<IMovie>(MOVIE, { addresses: [] } as any),
    current: createReducer<ICurrent>(CURRENT, { list: [], current: -1, currentSong: {}, sequence: 'sequence' }),
    downloads: createReducer<{ [songId: string]: IDownload }>(DOWNLOAD, {}),
    love: createReducer(LOVE, {
        lastModified: 0,
        songs: [],
        count: 0,
        image: '',
        plays: [],
        movies: [],
        musicians: []
    }),
    my: createReducer(MY, { plays: [] }),
    musician: createReducer<IUser>(MUSICIAN, {} as any),
    cloud: createReducer<ICloud>(CLOUD, {
        accessKey: '',
        secretKey: '',
        bucket: '',
        zone: '',
        domain: '',
        songs: [],
        loadings: {},
    }),
    search: createReducer<ISearch>(SEARCH, { songs: [], users: [], plays: [] }),
    comment: createReducer<{ hots: IComment[], list: IComment[] }>(COMMENT, { hots: [], list: [] })
});

export interface IState {
    system: ISystem;
    discoveryCarousels: ICarousel[];
    discoveryMovies: IMovie[];
    discoveryPlays: IPlay[];
    discoveryLatestSongs: ILatestSong[];
    discoveryChannels: IChannel[];
    channels: IChannel[];
    tops: ITop[];
    top: ITopDetail;
    plays: IPlay[];
    play: IPlay;
    movies: IMovie[];
    networks: { [key: string]: { loading: boolean, nodata: boolean } };
    movie: IMovie;
    styleTops: IStyleTop[];
    styleTop: ITopDetail[];
    current: ICurrent;
    downloads: { [songId: string]: IDownload };
    love: { lastModified: number, count: number, songs: ISong[], image: string, plays: IPlay[], movies: IMovie[], musicians: IUser[] };
    my: { plays: IPlay[] };
    musician: { [userId: string]: IUser };
    cloud: ICloud;
    search: ISearch;
    comment: { hots: IComment[], list: IComment[] };
}
