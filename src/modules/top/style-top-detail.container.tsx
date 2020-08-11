import * as React from 'react';
import { connect } from 'react-redux';
import { IState } from "../../reducers";
import { bindActionCreators, Dispatch } from "redux";
import { CurrentAction, SongAction, TopAction } from "../../actions";
import { Icon, Progress } from "antd";
import { Link } from "react-router-dom";
import { ICloudSong, IDownload, ISong, ITopDetail, ITopSong } from "../../interfaces";
import { actions, DownloadQueue, prettySongKind, toMap } from "../../helpers";
import { Layout, Play, Table } from "../../components";

export interface ITopDetailProps {
    actions?: {
        top: typeof TopAction;
        current: typeof CurrentAction;
        song: typeof SongAction;
    };
    styleTop?: ITopDetail;
    match?: {
        params: {
            topId: string;
        }
    },
    downloads?: { [key: string]: IDownload };
    loveSongs?: ISong[];
    cloudSongs?: ICloudSong[];
    loadings?: { [key: string]: boolean };
}

interface ITopDetailState {
    selected: number;
}

@connect(
    (state: IState) => ({
        styleTop: state.styleTop,
        downloads: state.downloads,
        loveSongs: state.love.songs,
        cloudSongs: state.cloud.songs,
        loadings: state.cloud.loadings,
    }),
    (dispatch: Dispatch) => ({
        actions: {
            top: bindActionCreators(actions(TopAction), dispatch),
            current: bindActionCreators(actions(CurrentAction), dispatch),
            song: bindActionCreators(actions(SongAction), dispatch),
        }
    })
)
export class StyleTopDetail extends React.Component<ITopDetailProps, ITopDetailState> {
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
        this.props.actions.top.getStyleTopSongs(decodeURIComponent(topId));
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
        this.props.actions.current.play(song.songName + '', song.songKind, {
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
        const { styleTop, downloads, loveSongs, cloudSongs, loadings = {} } = this.props;
        const songs = styleTop.songs || [];
        const loves = toMap<ISong>(loveSongs, i => `${i.kind}-${i.id}`);
        const clouds = toMap<ICloudSong>(cloudSongs, i => i.key);

        return <Layout background={styleTop.photo} transparent={true}>
            <Play image={styleTop.photo}
                  title={styleTop.name}
                  description={styleTop.description}
                  songCount={styleTop.count}
                  updatedAt={styleTop.time}
                  onPlayAll={() => this.playAll(songs)}
                  onDownloadAll={() => this.downloads(songs)}
            >
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
                        const download = downloads[`${key}`];
                        const hasLoved = !!loves[key];
                        const hasTransformed = !!clouds[filename];
                        const transforming = loadings[key];
                        return <Table.Row id={`${key}--styleTop.songs`}
                                          onDoubleClick={() => this.play(song)}
                                          className={this.state.selected === index ? 'selected' : ''}
                                          key={key}
                                          onClick={() => this.selected(index)}>
                            <Table.Col width={30}>&nbsp;</Table.Col>
                            <Table.Col width={140}>
                                <span>{index + 1}</span>
                                <span>
                                    <Icon type="heart" theme={hasLoved ? 'filled' : 'outlined'}
                                          onClick={() => this.love(hasLoved, song)}
                                          className={`song-icon ${hasLoved ? 'highlight' : ''}`}/>
                                </span>
                                <span>
                                    {transforming ?
                                        <Icon className="song-icon active" type="loading"/> :
                                        hasTransformed ?
                                            <Icon className="song-icon active" type="check-circle"/> :
                                            <Icon className="song-icon"
                                                  type="cloud-download"
                                                  onClick={() => this.transform(song.id, song.songKind)}/>
                                    }
                                </span>
                                <span>
                                        {
                                            download && download.percent === 100 ?
                                                <Icon className="song-icon active" type="check-circle"/> : download ?
                                                <Progress type="circle"
                                                          strokeColor="#5785f7"
                                                          percent={download.percent}
                                                          showInfo={false}
                                                          width={14}/> :
                                                <Icon type="download"
                                                      className="song-icon"
                                                      onClick={() => this.download(song.id, song.songKind)}/>
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
                    })}
                </Table>
            </Play>
        </Layout>;
    }
}
