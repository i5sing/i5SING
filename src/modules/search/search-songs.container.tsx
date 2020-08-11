import * as React from 'react';
import { connect } from 'react-redux';
import { Icon, Progress } from "antd";
import { Link } from "react-router-dom";
import { IState } from "../../reducers";
import { bindActionCreators } from "redux";
import { CurrentAction, SongAction } from "../../actions";
import { ICloudSong, IDownload, ISong } from "../../interfaces";
import { actions, DownloadQueue, prettySongKind } from "../../helpers";
import { Table } from "../../components";

export interface ISearchSongsProps {
    actions?: {
        current: typeof CurrentAction;
        song: typeof SongAction;
    };
    songs: ISong[];
    downloads?: { [songId: string]: IDownload },
    loves?: { [songId: string]: ISong };
    clouds?: { [songId: string]: ICloudSong };
    loadings?: { [key: string]: boolean };
}

@connect(
    (state: IState) => ({}),
    dispatch => ({
        actions: {
            current: bindActionCreators(actions(CurrentAction), dispatch),
            song: bindActionCreators(actions(SongAction), dispatch),
        }
    })
)
export class SearchSongs extends React.Component<ISearchSongsProps> {
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

    play(song: ISong) {
        this.props.actions.current.play(song.id + '', song.kind, song);
    }

    render() {
        const { songs, downloads, loves, clouds, loadings } = this.props;
        return <Table header={<Table.Row>
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
                                      className={this.state.selected === index ? 'selected' : ''}
                                      key={key}
                                      onClick={() => this.selected(index)}>
                        <Table.Col width={30}>&nbsp;</Table.Col>
                        <Table.Col width={140}>
                            <span>{(index + 1) < 10 ? '0' + (index + 1) : index + 1}</span>
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
                                                      onClick={() => this.transform(song.id, song.kind)}/>
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
                                                      onClick={() => this.download(song.id, song.kind)}/>
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
        </Table>;
    }
}
