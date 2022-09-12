import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { IState } from "../../reducers";
import * as styles from './play-songs.m.less';
import { bindActionCreators } from "redux";
import { CurrentAction } from "../../actions";
import { ISong } from "../../interfaces";
import { actions } from "../../helpers";
import { Table } from "../../components";
import { DeleteOutlined } from "@ant-design/icons";

export interface IPlaySongsProps {
    songList?: ISong[];
    current?: number;
    actions?: {
        current: typeof CurrentAction;
    };
    onHide?: () => void;
}

@connect(
    (state: IState) => ({
        songList: state.current.list,
        current: state.current.current,
    }),
    dispatch => ({
        actions: {
            current: bindActionCreators(actions(CurrentAction), dispatch),
        }
    })
)
export class PlaySongs extends React.Component<IPlaySongsProps> {
    public state = {
        selected: null,
    };

    selected(index: number) {
        this.setState({ selected: index === this.state.selected ? null : index });
    }

    clear() {
        this.props.actions.current.clear();
    }

    play(song: ISong) {
        this.props.actions.current.play(song.id + '', song.kind, song);
    }

    render() {
        const { songList, current, onHide } = this.props;
        return <div className={styles.play_songs}>
            <div className={styles.layers} onClick={() => typeof onHide === 'function' ? onHide() : void 0}/>
            <div className={styles.content}>
                <div className={styles.tool}>
                    <span className={styles.count}>共 {songList.length} 首</span>
                    <a className={styles.clear_btn} onClick={() => this.clear()}><DeleteOutlined/> 清空</a>
                </div>
                <div className={styles.play_songs_content}>
                    <Table>
                        {songList.map((song: ISong, index: number) => {
                                const key = `${song.kind}-${song.id}`;
                                return <Table.Row
                                    id={`${key}--current.list`}
                                    onDoubleClick={() => this.play(song)}
                                    className={
                                        `${this.state.selected === index ? 'selected' : ''} ${current === index ? styles.active : ''}`
                                    }
                                    key={key}
                                    onClick={() => this.selected(index)}>
                                    <Table.Col style={{ paddingLeft: 10 }} width={280}>{song.name}</Table.Col>
                                    <Table.Col width={120}>
                                        <Link to={`/musicians/${song.user.id}`}>{song.user.nickname}</Link>
                                    </Table.Col>
                                </Table.Row>
                            }
                        )}
                    </Table>
                </div>
            </div>
        </div>
    }
}
