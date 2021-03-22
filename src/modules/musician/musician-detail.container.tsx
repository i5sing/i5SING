import * as React from 'react';
import { connect } from 'react-redux';
import { IState } from "../../reducers";
import { bindActionCreators, Dispatch } from "redux";
import { MusicianSongs } from "./musician-songs.container";
import { MusicianGuestBook } from "./guestbook.container";
import { UserAction } from "../../actions/user.action";
import { IUser } from "../../interfaces";
import { actions } from "../../helpers";
import { HeadButton, Layout, Musician } from "../../components";

export interface IMusicianProps {
    actions?: {
        user: typeof UserAction;
    };
    musician?: { [userId: string]: IUser };
    match?: {
        params: { musicianId: string, type: string }
    }
    userId?: string;
}

@connect(
    (state: IState) => ({
        musician: state.musician,
        userId: state.system.userId,
    }),
    (dispatch: Dispatch) => ({
        actions: {
            user: bindActionCreators(actions(UserAction), dispatch),
        }
    })
)
export class MusicianDetail extends React.Component<IMusicianProps> {
    componentDidMount(): void {
        const userId = this.props?.match?.params?.musicianId;
        if (userId) {
            this.props.actions.user.getMusician(userId);
        }
    }

    follow(user: IUser) {
        if (user.isFollow) {
            this.props.actions.user.unfollowUser(user.id + '');
        } else {
            this.props.actions.user.followUser(user.id + '');
        }
    }

    render() {
        const { musician, userId } = this.props;
        const musicianId = this.props?.match?.params?.musicianId;
        const type = this.props?.match?.params?.type;
        const user: IUser = musician[musicianId] || {
            id: -1,
            image: '',
            nickname: '',
            isFollow: false,
            description: ''
        };
        const headers = <span style={{ marginLeft: 20 }}>
            <HeadButton to={`/musicians/${musicianId}/yc`}>原创</HeadButton>
            <HeadButton to={`/musicians/${musicianId}/fc`}>翻唱</HeadButton>
            <HeadButton to={`/musicians/${musicianId}/bz`}>伴奏</HeadButton>
            {/*<HeadButton to={ `/musicians/${ musicianId }/activities` }>动态</HeadButton>*/}
            <HeadButton to={`/musicians/${musicianId}/guest-books`}>留言</HeadButton>
        </span>;
        return <Layout header={headers} id="main">
            <Musician image={user.image}
                      hideLike={userId + '' === user.id + ''}
                      title={user.nickname}
                      isLike={user.isFollow}
                      onLike={() => this.follow(user)}
                      description={user.description}>
                <div style={{ display: type === 'yc' ? 'block' : 'none' }}>
                    <MusicianSongs type="yc" musicianId={musicianId}/>
                </div>
                <div style={{ display: type === 'fc' ? 'block' : 'none' }}>
                    <MusicianSongs type="fc" musicianId={musicianId}/>
                </div>
                <div style={{ display: type === 'bz' ? 'block' : 'none' }}>
                    <MusicianSongs type="bz" musicianId={musicianId}/>
                </div>
                <div style={{ display: type === 'guest-books' ? 'block' : 'none' }}>
                    <MusicianGuestBook musicianId={musicianId}/>
                </div>
            </Musician>
        </Layout>
    }
}
