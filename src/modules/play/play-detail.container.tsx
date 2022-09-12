import * as React from 'react';
import { Progress } from 'antd';
import { connect } from 'react-redux';
import { IState } from "../../reducers";
import { bindActionCreators, Dispatch } from "redux";
import { CurrentAction, PlayAction, SongAction } from "../../actions";
import moment = require("moment");
import { Link } from "react-router-dom";
import { ICloudSong, IDownload, IPlay, ISong } from "../../interfaces";
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

export interface IPlayDetailProps {
    actions?: {
        play: typeof PlayAction;
        current: typeof CurrentAction;
        song: typeof SongAction;
    };
    play?: IPlay;
    match?: {
        params: {
            playId: string;
        }
    }
    downloads?: { [songId: string]: IDownload },
    loveSongs?: ISong[];
    cloudSongs?: ICloudSong[];
    loadings?: { [key: string]: boolean };
    current?: number;
    playlist?: ISong[];
}

interface IPlayDetailState {
    selected: number;
}

@connect(
    (state: IState) => ({
        play: state.play,
        downloads: state.downloads,
        loveSongs: state.love.songs,
        cloudSongs: state.cloud.songs,
        loadings: state.cloud.loadings,
        current: state.current.current,
        playlist: state.current.list,
    }),
    (dispatch: Dispatch) => ({
        actions: {
            play: bindActionCreators(actions(PlayAction), dispatch),
            current: bindActionCreators(actions(CurrentAction), dispatch),
            song: bindActionCreators(actions(SongAction), dispatch),
        }
    })
)
export class PlayDetail extends React.Component<IPlayDetailProps, IPlayDetailState> {
    public state = {
        selected: null,
    };

    componentDidMount(): void {
        const playId = this.props.match.params.playId;
        this.refresh(playId);
    }

    componentWillReceiveProps(nextProps: Readonly<IPlayDetailProps>, nextContext: any): void {
        const playId = nextProps.match.params.playId;
        if (playId !== this.props.match.params.playId) {
            this.refresh(playId);
        }
    }

    refresh(playId) {
        this.props.actions.play.getPlay(playId);
        this.props.actions.play.getPlaySongs(playId);
        this.props.actions.play.checkPlay(playId);
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

    like(play: IPlay) {
        this.props.actions.play.likePlay(play.id);
    }

    dislike(play: IPlay) {
        this.props.actions.play.dislikePlay(play.id);
    }

    play(song: ISong) {
        this.props.actions.current.play(song.id + '', song.kind, song);
    }

    playAll(songs: ISong[]) {
        this.props.actions.current.plays(songs);
    }

    render() {
        const { play, downloads, loveSongs, cloudSongs, loadings = {}, playlist, current } = this.props;
        const songs = play.songs || [];
        const clouds = toMap<ICloudSong>(cloudSongs, i => i.key);
        const loves = toMap<ISong>(loveSongs, i => `${i.kind}-${i.id}`);
        const currentSong = playlist[current];

        return <Layout background={play.picture} transparent={true}>
            <Play type="play"
                  image={play.picture}
                  title={play.title}
                  collects={play.collects || 0}
                  shares={play.shares || 0}
                  songCount={play.songs.length}
                  updatedAt={moment(Number(play.createTime) * 1000).format('YYYY-MM-DD HH:mm')}
                  isLike={play.isLike}
                  onPlayAll={() => this.playAll(songs)}
                  onLike={() => play.isLike ? this.dislike(play) : this.like(play)}
                  onDownloadAll={() => this.downloads(songs)}
                  description={play.description}>
                <Table header={<Table.Row>
                    <Table.Col type="header" width={30}>&nbsp;</Table.Col>
                    <Table.Col type="header" width={140}>&nbsp;</Table.Col>
                    <Table.Col type="header" width={340}>歌曲标题</Table.Col>
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
                            return <Table.Row id={`${key}--play.songs`}
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
                                <Table.Col width={340}>{song.name}</Table.Col>
                                <Table.Col width={60}>{prettySongKind(song.kind)}</Table.Col>
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

