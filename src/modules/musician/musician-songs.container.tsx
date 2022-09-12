import * as React from 'react';
import { get } from 'lodash';
import { Progress } from "antd";
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { IState } from "../../reducers";
import { bindActionCreators, Dispatch } from "redux";
import { CurrentAction, SongAction } from "../../actions";
import { UserAction } from "../../actions/user.action";
import { ICloudSong, IDownload, INetwork, ISong, IUser } from "../../interfaces";
import { MUSICIAN } from "../../constants/action-types.constant";
import { UPDATE_PROPERTY } from "../../constants/actions.constant";
import { actions, DownloadQueue, prettySongKind, toMap } from "../../helpers";
import { EndLoader, Loading, Table } from "../../components";
import {
    CaretRightOutlined,
    CheckCircleOutlined,
    CloudDownloadOutlined, DownloadOutlined,
    HeartFilled,
    HeartOutlined,
    LoadingOutlined
} from "@ant-design/icons";

export interface IMusicianSongsProps {
    actions?: {
        user: typeof UserAction;
        current: typeof CurrentAction;
        song: typeof SongAction;
    };
    musician?: { [userId: string]: IUser };
    musicianId: string
    downloads?: { [key: string]: IDownload };
    type: string;
    loveSongs?: ISong[];
    network?: INetwork;
    cloudSongs?: ICloudSong[];
    loadings?: { [key: string]: boolean };
    current?: number;
    playlist?: ISong[];
}

@connect(
    (state: IState) => ({
        musician: state.musician,
        downloads: state.downloads,
        loveSongs: state.love.songs,
        network: state.networks[`${MUSICIAN}_${UPDATE_PROPERTY}_songs`],
        cloudSongs: state.cloud.songs,
        loadings: state.cloud.loadings,
        current: state.current.current,
        playlist: state.current.list,
    }),
    (dispatch: Dispatch) => ({
        actions: {
            user: bindActionCreators(actions(UserAction), dispatch),
            current: bindActionCreators(actions(CurrentAction), dispatch),
            song: bindActionCreators(actions(SongAction), dispatch),
        }
    })
)
export class MusicianSongs extends React.Component<IMusicianSongsProps> {
    public state = {
        selected: null,
        page: 1,
    };

    componentDidMount(): void {
        const { musicianId, type } = this.props;
        this.props.actions.song.getUserSongs(musicianId, type);
    }

    selected(index: number) {
        this.setState({ selected: index === this.state.selected ? null : index });
    }

    download(songId: string, songType: string) {
        DownloadQueue.download(songId, songType);
    }

    downloads(songs: ISong[]) {
        DownloadQueue.downloads(songs.map(song => ({ songId: song.id, songType: song.kind })));
    }

    transform(songId: string, songType: string) {
        this.props.actions.song.transformSong(songId, songType);
    }

    love(hasLoved: boolean, song: ISong) {
        const musicboxSong = [{
            ID: song.id,
            NN: song.user.nickname,
            SUID: song.user.id + '',
            SK: song.kind,
            SN: song.name
        }];
        if (hasLoved) {
            this.props.actions.song.syncLoveSongs([], musicboxSong);
        } else {
            this.props.actions.song.syncLoveSongs(musicboxSong);
        }
    }

    nextPage() {
        const { musicianId, type } = this.props;
        this.setState({ page: this.state.page + 1 }, () => {
            this.props.actions.song.getUserSongs(musicianId, type, this.state.page);
        });
    }

    play(song: ISong) {
        this.props.actions.current.play(song.id + '', song.kind, song);
    }

    render() {
        const {
            musician,
            type,
            downloads,
            loveSongs,
            musicianId,
            network = { loading: true, nodata: false },
            cloudSongs,
            loadings = {},
            playlist,
            current,
        } = this.props;
        const songs = get(musician[musicianId], type + 'list', []);
        const loves = toMap<ISong>(loveSongs, i => `${i.kind}-${i.id}`);
        const clouds = toMap<ICloudSong>(cloudSongs, i => i.key);
        const currentSong = playlist[current];

        return <EndLoader target="main" onLoad={() => !network.nodata && this.nextPage()}>
            <Table style={{ background: 'none' }} header={<Table.Row>
                <Table.Col type="header" width={30}>&nbsp;</Table.Col>
                <Table.Col type="header" width={140}>&nbsp;</Table.Col>
                <Table.Col type="header">歌曲标题</Table.Col>
                <Table.Col type="header" width={60}>歌曲类型</Table.Col>
                <Table.Col type="header" width={180}>歌手</Table.Col>
                <Table.Col type="header" width={30}>&nbsp;</Table.Col>
            </Table.Row>}>
                {songs.map((song: ISong, index: number) => {
                        const key = `${song.kind}-${song.id}`;
                        const filename = `${song.name} - ${song.user.nickname} - ${song.kind} - ${song.id} - ${song.user.id}.mp3`;
                        const hasLoved = !!loves[key];
                        const download = downloads[key];
                        const hasTransformed = !!clouds[filename];
                        const transforming = loadings[key];
                        return <Table.Row id={`${key}--musician['${musicianId}'].${type}list`}
                                          onDoubleClick={() => this.play(song)}
                                          className={`
                                              ${this.state.selected === index ? 'selected' : ''}
                                              ${currentSong && currentSong.id === song.id + '' ? 'playing' : ''}
                                          `}
                                          key={key}
                                          onClick={() => this.selected(index)}>
                            <Table.Col style={{ width: 30 }}>&nbsp;</Table.Col>
                            <Table.Col className="operations">
                                <span>{(index + 1) < 10 ? '0' + (index + 1) : index + 1}</span>
                                <span>
                                    {currentSong && currentSong.id === song.id ?
                                        <CaretRightOutlined className="song-icon"/> : null}
                                </span>
                                <span>
                                    {hasLoved ?
                                        <HeartFilled
                                            className={`song-icon ${hasLoved ? 'highlight' : ''}`}
                                            onClick={() => this.love(hasLoved, song)}
                                        /> :
                                        <HeartOutlined
                                            onClick={() => this.love(hasLoved, song)}
                                            className={`song-icon ${hasLoved ? 'highlight' : ''}`}
                                        />
                                    }
                                </span>
                                <span>
                                    {transforming ?
                                        <LoadingOutlined className="song-icon active"/> :
                                        hasTransformed ?
                                            <CheckCircleOutlined className="song-icon active"/> :
                                            <CloudDownloadOutlined
                                                className="song-icon"
                                                onClick={() => this.transform(song.id, song.kind)}
                                            />
                                    }
                                </span>
                                <span>
                                    {
                                        download && download.percent === 100 ?
                                            <CheckCircleOutlined className="song-icon active"/> : download ?
                                                <Progress type="circle"
                                                          strokeColor="#5785f7"
                                                          percent={download.percent}
                                                          showInfo={false}
                                                          width={14}/> :
                                                <DownloadOutlined
                                                    className="song-icon"
                                                    onClick={() => this.download(song.id, song.kind)}
                                                />
                                    }
                                </span>
                            </Table.Col>
                            <Table.Col>{song.name}</Table.Col>
                            <Table.Col>{prettySongKind(song.kind)}</Table.Col>
                            <Table.Col>
                                <Link to={`/musicians/${song.user.id}`}>{song.user.nickname}</Link>
                            </Table.Col>
                            <Table.Col style={{ width: 30 }}>&nbsp;</Table.Col>
                        </Table.Row>
                    }
                )}
            </Table>
            <div style={{ marginTop: 40 }}>
                <Loading loading={network.loading} nodata={network.nodata}/>
            </div>
        </EndLoader>;
    }
}
