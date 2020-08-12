import * as React from 'react';
import * as moment from 'moment';
import { connect } from 'react-redux';
import { Icon, Upload } from "antd";
import * as styles from "./cloud-songs.m.less";
import { IState } from "../../reducers";
import { bindActionCreators } from "redux";
import { CloudAction, CurrentAction, SongAction } from "../../actions";
import { ICloudSong } from "../../interfaces";
import { actions, prettyByte } from "../../helpers";
import { Button, Layout, Table, Tool } from "../../components";

export interface ICloudSongsProps {
    actions?: {
        song: typeof SongAction;
        cloud: typeof CloudAction;
        current: typeof CurrentAction;
    };
    songs?: ICloudSong[];
    domain?: string;
}

@connect(
    (state: IState) => ({
        songs: state.cloud.songs,
        domain: state.cloud.domain,
    }),
    dispatch => ({
        actions: {
            song: bindActionCreators(actions(SongAction), dispatch),
            cloud: bindActionCreators(actions(CloudAction), dispatch),
            current: bindActionCreators(actions(CurrentAction), dispatch),
        }
    })
)
export class CloudSongs extends React.Component<ICloudSongsProps> {
    public state = {
        selected: null,
    };

    componentDidMount(): void {
        this.props.actions.cloud.getCloudSongs();
    }

    handleBeforeUpload(file) {
        const formData = new FormData();
        formData.append('file', file);
        this.props.actions.song.uploadSong(formData);
        return false;
    }

    selected(index: number) {
        this.setState({ selected: index === this.state.selected ? null : index });
    }

    delete(key: string) {
        this.props.actions.cloud.deleteCloudSong(key);
    }

    play(song: ICloudSong) {
        this.props.actions.current.play(song.key, 'cloud', {
            id: song.key,
            name: song.key,
            kind: 'cloud',
            user: {
                id: -1,
                nickname: '我的音乐云盘'
            },
            local: this.props.domain + '/' + encodeURIComponent(song.key),

        });
    }

    playAll(songs: ICloudSong[]) {
        this.props.actions.current.plays(songs.map(song => ({
            id: song.key,
            name: song.key,
            kind: 'cloud',
            user: {
                id: -1,
                nickname: '我的音乐云盘'
            },
            local: this.props.domain + '/' + encodeURIComponent(song.key),
        })));
    }

    render() {
        const { songs = [], domain } = this.props;
        const hasConfig = !!domain;

        return <Layout>
            <Tool direction="left">
                <Button type="primary" disabled={!hasConfig} onClick={() => this.playAll(songs)}>
                    <Icon type="play-circle"/>播放全部
                </Button>
                <span style={{ marginTop: 8 }}>
                <Upload
                    accept=".mp3,.wma,.avi,.rm,.rmvb,.flv,.mpg,.mov,.mkv"
                    showUploadList={false}
                    beforeUpload={file => this.handleBeforeUpload(file)}>
                    <Button disabled={!hasConfig}><Icon type="cloud-upload"/>上传</Button>
                </Upload>
                </span>
            </Tool>
            <div className={styles.content}>
                <Table style={{ background: 'none' }} header={<Table.Row>
                    <Table.Col type="header" width={30}>&nbsp;</Table.Col>
                    <Table.Col type="header" width={40}>&nbsp;</Table.Col>
                    <Table.Col type="header" width={400}>歌曲标题</Table.Col>
                    <Table.Col type="header" width={90}>格式</Table.Col>
                    <Table.Col type="header" width={70}>大小</Table.Col>
                    <Table.Col type="header" width={130}>上传时间</Table.Col>
                    <Table.Col type="header" width={30}>&nbsp;</Table.Col>
                </Table.Row>}>
                    {songs.map((song: ICloudSong, index: number) => {
                            return <Table.Row id={`${song.key}--cloud.songs`}
                                              onDoubleClick={() => this.play(song)}
                                              className={
                                                  `${styles.cloud_table_row} ${this.state.selected === index ? 'selected' : ''}`
                                              }
                                              key={song.key}
                                              onClick={() => this.selected(index)}>
                                <Table.Col width={30}>&nbsp;</Table.Col>
                                <Table.Col width={40}>
                                    <span>{(index + 1) < 10 ? '0' + (index + 1) : index + 1}</span>
                                    <span>

                                    </span>
                                </Table.Col>
                                <Table.Col width={400}>{song.key}</Table.Col>
                                <Table.Col width={90}>{song.mimeType}</Table.Col>
                                <Table.Col width={70}>{prettyByte(song.fsize, 'B')}</Table.Col>
                                <Table.Col width={130}>
                                    {moment(song.putTime / 10000).format('YYYY-MM-DD HH:mm')}
                                </Table.Col>
                                <Table.Col width={30}>
                                    <Icon className={styles.delete_btn} type="close" onClick={e => {
                                        e.stopPropagation();
                                        this.delete(song.key);
                                    }}/>
                                </Table.Col>
                            </Table.Row>
                        }
                    )}
                </Table>
            </div>
        </Layout>;
    }
}
