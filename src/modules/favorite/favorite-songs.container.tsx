import * as React from 'react';
import { connect } from 'react-redux';
import { IState } from "../../reducers";
import { bindActionCreators, Dispatch } from "redux";
import { CurrentAction, SongAction } from "../../actions";
import { Progress } from "antd";
import moment = require("moment");
import { Link } from "react-router-dom";
import { ICloudSong, IDownload, ISong } from "../../interfaces";
import { actions, DownloadQueue, toMap } from "../../helpers";
import { Layout, Play, Table } from "../../components";
import {
    CaretRightOutlined,
    CheckCircleOutlined,
    CloudDownloadOutlined,
    DownloadOutlined,
    HeartFilled,
    LoadingOutlined
} from "@ant-design/icons";

export interface IDownloadManageProps {
    actions?: {
        song: typeof SongAction;
        current: typeof CurrentAction;
    };
    songs?: ISong[];
    downloads?: { [key: string]: IDownload };
    lastModified?: number;
    image?: string;
    cloudSongs?: ICloudSong[];
    loadings?: { [key: string]: boolean };
    current?: number;
    playlist?: ISong[];
}

@connect(
    (state: IState) => ({
        songs: state.love.songs,
        lastModified: state.love.lastModified,
        image: state.love.image,
        downloads: state.downloads,
        cloudSongs: state.cloud.songs,
        loadings: state.cloud.loadings,
        current: state.current.current,
        playlist: state.current.list,
    }),
    (dispatch: Dispatch) => ({
        actions: {
            song: bindActionCreators(actions(SongAction), dispatch),
            current: bindActionCreators(actions(CurrentAction), dispatch),
        }
    })
)
export class FavoriteSongs extends React.Component<IDownloadManageProps> {
    public state = {
        selected: null,
    };

    selected(index: number) {
        this.setState({ selected: index === this.state.selected ? null : index });
    }

    download(songId: string, songType: string) {
        DownloadQueue.download(songId, songType);
    }

    downloads(songs: ISong[]) {
        DownloadQueue.downloads(songs.map(song => ({ songId: song.id, songType: song.kind })));
    }

    disLove(song: ISong) {
        const musicboxSong = [{
            ID: song.id,
            NN: song.user.nickname,
            SUID: song.user.id + '',
            SK: song.kind,
            SN: song.name
        }];
        this.props.actions.song.syncLoveSongs([], musicboxSong);
    }

    transform(songId: string, songType: string) {
        this.props.actions.song.transformSong(songId, songType);
    }

    play(song: ISong) {
        this.props.actions.current.play(song.id + '', song.kind, song);
    }

    playAll(songs: ISong[]) {
        this.props.actions.current.plays(songs);
    }

    render() {
        const { songs, lastModified, downloads, image, cloudSongs, loadings = {}, playlist, current } = this.props;
        const clouds = toMap<ICloudSong>(cloudSongs, i => i.key);
        const currentSong = playlist[current];

        return <Layout background={image} transparent={true}>
            <Play image={image}
                  title="我喜欢的音乐"
                  songCount={songs.length}
                  onDownloadAll={() => this.downloads(songs)}
                  onPlayAll={() => this.playAll(songs)}
                  updatedAt={moment(lastModified * 1000).format('YYYY-MM-DD HH:mm')}>
                <Table header={<Table.Row>
                    <Table.Col type="header" width={30}>&nbsp;</Table.Col>
                    <Table.Col type="header" width={140}>&nbsp;</Table.Col>
                    <Table.Col type="header" width={400}>歌曲标题</Table.Col>
                    <Table.Col type="header" width={180}>歌手</Table.Col>
                    <Table.Col type="header" width={30}>&nbsp;</Table.Col>
                </Table.Row>}>
                    {songs.map((song: ISong, index: number) => {
                            const key = `${song.kind}-${song.id}`;
                            const filename = `${song.name} - ${song.user.nickname} - ${song.kind} - ${song.id} - ${song.user.id}.mp3`;
                            const download = downloads[key];
                            const hasTransformed = !!clouds[filename];
                            const transforming = loadings[key];
                            return <Table.Row id={`${key}--love.songs`}
                                              onDoubleClick={() => this.play(song)}
                                              className={`
                                                  ${this.state.selected === index ? 'selected' : ''}
                                                  ${currentSong && currentSong.id === song.id ? 'playing' : ''}
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
                                        <HeartFilled
                                            className="song-icon highlight"
                                            onClick={() => this.disLove(song)}/>
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
                                <Table.Col width={400}>{song.name}</Table.Col>
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
