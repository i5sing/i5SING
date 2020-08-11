import * as React from 'react';
import * as styles from './playing.m.less';
import { Icon } from "antd";
import * as $ from 'jquery';
import { connect } from 'react-redux';
import { IState } from "../../reducers";
import { ISong } from "../../interfaces";
import { get } from "lodash";
import { Link } from "react-router-dom";
import { bindActionCreators, Dispatch } from "redux";
import { actions } from "../../helpers";
import { SystemAction } from "../../actions/system.action";
import { HistoryAction } from "../../actions/history.action";

@connect(
    (state: IState) => ({
        current: state.current.current,
        songList: state.current.list,
        loveSongs: state.love.songs,
        seq: state.current.sequence,
        loading: state.current.loading,
        lyrics: state.current.dynamicLyrics,
        id: state.current.lyricId,
    }),
    (dispatch: Dispatch) => ({
        actions: {
            system: bindActionCreators(actions(SystemAction), dispatch),
            history: bindActionCreators(actions(HistoryAction), dispatch),
        }
    })
)
export class Playing extends React.Component<any, any> {
    back() {
        this.props.actions.history.back();
        this.props.actions.system.refreshSystem();
    }

    componentWillReceiveProps(props: Readonly<any>, nextContext: any) {
        if (props.id !== this.props.id) {
            const lineElement = $(`.lyric-${props.id}`)[0] || { offsetTop: 0 };
            const windowHeight = 380;
            const AdditionOffset = -158;
            const offset = lineElement.offsetTop - windowHeight / 2 + AdditionOffset;
            $('.lyric-content').animate({
                scrollTop: `${offset}px`,
            }, 500);
        }
    }

    render() {
        const { current, songList, lyrics = [], id } = this.props;
        const song: ISong = songList[current] || { songName: '', name: '' };
        const user = get(song, 'user', { image: void 0, nickname: '', id: '' });
        return <div className={styles.player_detail}>
            <Icon type="down" className={styles.close_btn} onClick={() => this.back()}/>
            <div>
                <div className={styles.image}>
                    <img src={user.image} alt={user.nickname}/>
                </div>
                <div className={styles.lrc}>
                    <h1>{song.name}</h1>
                    <div className={styles.description}>
                        <span>歌手：</span>
                        <Link to={user.id === -1 ? `/clouds` : `/musicians/${user.id}`}>{user.nickname}</Link>
                    </div>
                    <div className={`${styles.content} lyric-content`}>
                        {lyrics.map((lyric, index) => <p
                            className={`${styles.lyrics} ${id === index ? styles.selected : ''} lyric-${index}`}>
                            {lyric.text}
                        </p>)}
                    </div>
                </div>
            </div>
        </div>;
    }
}
