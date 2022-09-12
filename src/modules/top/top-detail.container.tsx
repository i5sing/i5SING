import * as React from 'react';
import { Progress } from 'antd';
import { connect } from 'react-redux';
import { IState } from "../../reducers";
import { bindActionCreators, Dispatch } from "redux";
import { CloudAction, CurrentAction, SongAction, TopAction } from "../../actions";
import { Link } from "react-router-dom";
import { ICloudSong, IDownload, ISong, ITopDetail, ITopSong } from "../../interfaces";
import { actions, DownloadQueue, prettySongKind, toMap } from "../../helpers";
import { Layout, Play, Table } from "../../components";
import {
    CaretRightOutlined,
    CheckCircleOutlined,
    CloudDownloadOutlined, DownloadOutlined,
    HeartFilled,
    HeartOutlined,
    LoadingOutlined
} from "@ant-design/icons";

export interface ITopDetailProps {
    actions?: {
        top: typeof TopAction;
        current: typeof CurrentAction;
        song: typeof SongAction;
        cloud: typeof CloudAction;
    };
    top?: ITopDetail;
    match?: {
        params: {
            topId: string;
        }
    }
    downloads?: { [songId: string]: IDownload },
    loveSongs?: ISong[];
    cloudSongs?: ICloudSong[];
    loadings?: { [key: string]: boolean };
    current?: number;
    playlist?: ISong[];
}

interface ITopDetailState {
    selected: number;
}

@connect(
    (state: IState) => ({
        top: state.top,
        downloads: state.downloads,
        loveSongs: state.love.songs,
        cloudSongs: state.cloud.songs,
        loadings: state.cloud.loadings,
        current: state.current.current,
        playlist: state.current.list,
    }),
    (dispatch: Dispatch) => ({
        actions: {
            top: bindActionCreators(actions(TopAction), dispatch),
            current: bindActionCreators(actions(CurrentAction), dispatch),
            song: bindActionCreators(actions(SongAction), dispatch),
            cloud: bindActionCreators(actions(CloudAction), dispatch),
        }
    })
)
export class TopDetail extends React.Component<ITopDetailProps, ITopDetailState> {
    public state = {
        selected: null,
    };

    componentDidMount(): void {
        const topId = this.props.match.params.topId;
        this.refresh(topId);
    }

    componentWillReceiveProps(nextProps: Readonly<ITopDetailProps>, nextContext: any): void {
        const topId = nextProps.match.params.topId;
        if (topId !== this.props.match.params.topId) {
            this.refresh(topId);
        }
    }

    refresh(topId) {
        if (topId !== 'list25') {
            this.props.actions.top.getTopSongs(topId);
        } else {
            this.props.actions.top.getSupportSongs();
        }
    }

    getTopDescription(topId: string) {
        switch (topId) {
            case 'yc':
                return '5SING 独立原创音乐人作品官方榜单，以推荐优秀原创作品为目的。每周一首发。';
            case 'list23':
                return '取30天内上传的歌曲最近一周内的任期变化，每日更新';
            case 'fc':
                return '最优秀的流行歌曲翻唱排行，每周一更新';
            case 'list25':
                return '按歌曲上周所获支持卡总数排名，每周一更新';
        }
    }

    selected(index: number) {
        this.setState({ selected: index === this.state.selected ? null : index });
    }

    download(songId: string, songType: string) {
        DownloadQueue.download(songId, songType);
    }

    downloads(songs: ITopSong[]) {
        DownloadQueue.downloads(songs.map(song => ({ songId: song.id, songType: song.songKind })));
    }

    transform(songId: string, songType: string) {
        this.props.actions.song.transformSong(songId, songType);
    }

    love(hasLoved: boolean, song: ITopSong) {
        const musicboxSong = [{
            ID: song.id,
            NN: song.user.nickname,
            SUID: song.user.id + '',
            SK: song.songKind,
            SN: song.songName
        }];
        if (hasLoved) {
            this.props.actions.song.syncLoveSongs([], musicboxSong);
        } else {
            this.props.actions.song.syncLoveSongs(musicboxSong);
        }
    }

    play(song: ITopSong) {
        this.props.actions.current.play(song.id + '', song.songKind, {
            id: song.id,
            kind: song.songKind,
            name: song.songName,
            user: song.user,
        });
    }

    playAll(songs: ITopSong[]) {
        this.props.actions.current.plays(songs.map(song => ({
            id: song.id,
            kind: song.songKind,
            name: song.songName,
            user: song.user,
        })));
    }

    render() {
        const { top, downloads, loveSongs, cloudSongs, loadings = {}, playlist, current } = this.props;
        const songs = top.songs || [];
        const loves = toMap<ISong>(loveSongs, i => `${i.kind}-${i.id}`);
        const clouds = toMap<ICloudSong>(cloudSongs, i => i.key);
        const currentSong = playlist[current];

        return <Layout background={top.photo} transparent={true}>
            <Play image={top.photo}
                  title={top.name}
                  songCount={top.count}
                  updatedAt={top.time}
                  onPlayAll={() => this.playAll(songs)}
                  onDownloadAll={() => this.downloads(songs)}
                  description={this.getTopDescription(top.id)}>
                <Table header={<Table.Row>
                    <Table.Col type="header" width={30}>&nbsp;</Table.Col>
                    <Table.Col type="header" width={140}>&nbsp;</Table.Col>
                    <Table.Col type="header" width={340}>歌曲标题</Table.Col>
                    <Table.Col type="header" width={60}>歌曲类型</Table.Col>
                    <Table.Col type="header" width={180}>歌手</Table.Col>
                    <Table.Col type="header" width={30}>&nbsp;</Table.Col>
                </Table.Row>}>
                    {songs.map((song: ITopSong, index: number) => {
                            const key = `${song.songKind}-${song.id}`;
                            const filename = `${song.songName} - ${song.user.nickname} - ${song.songKind} - ${song.id} - ${song.user.id}.mp3`;
                            const hasLoved = !!loves[key];
                            const hasTransformed = !!clouds[filename];
                            const transforming = loadings[key];
                            const download = downloads[key];
                            return <Table.Row id={`${key}--top.songs`}
                                              onDoubleClick={() => this.play(song)}
                                              className={`
                                                  ${this.state.selected === index ? 'selected' : ''}
                                                  ${currentSong && currentSong.id === song.id + '' ? 'playing' : ''}
                                              `}
                                              key={key}
                                              onClick={() => this.selected(index)}>
                                <Table.Col width={30}>&nbsp;</Table.Col>
                                <Table.Col className="operations" width={140}>
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
                                                    type="cloud-download"
                                                    onClick={() => this.transform(song.id, song.songKind)}
                                                />
                                        }
                                    </span>
                                    <span>
                                        {download && download.percent === 100 ?
                                            <CheckCircleOutlined className="song-icon active"/> :
                                            download ?
                                                <Progress type="circle"
                                                          strokeColor="#5785f7"
                                                          percent={download.percent}
                                                          showInfo={false}
                                                          width={14}/> :
                                                <DownloadOutlined
                                                    className="song-icon"
                                                    onClick={() => this.download(song.id, song.songKind)}
                                                />
                                        }
                                    </span>
                                </Table.Col>
                                <Table.Col width={340}>{song.songName}</Table.Col>
                                <Table.Col width={60}>{prettySongKind(song.songKind)}</Table.Col>
                                <Table.Col width={180}>
                                    <Link to={`/musicians/${song.user.id}`}>{song.user.nickname}</Link>
                                </Table.Col>
                                <Table.Col width={30}>&nbsp;</Table.Col>
                            </Table.Row>
                        }
                    )}
                </Table>
            </Play>
        </Layout>;
    }
}
