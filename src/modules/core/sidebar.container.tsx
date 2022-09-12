import * as React from 'react';
import { connect } from 'react-redux';
import './sidebar.less';
import { IState } from "../../reducers";
import { bindActionCreators, Dispatch } from "redux";
import { AuthAction } from "../../actions";
import { IPlay, ISystem } from "../../interfaces";
import { actions } from "../../helpers";
import { UserInfo, Navigation } from "../../components";
import {
    AppstoreOutlined, CloudOutlined, DownloadOutlined,
    FireOutlined, HeartOutlined,
    MenuUnfoldOutlined,
    PlayCircleOutlined, StarOutlined, UserOutlined,
    YoutubeOutlined
} from "@ant-design/icons";

export interface ISidebarProps {
    actions?: {
        auth: typeof AuthAction;
    };
    noFooter?: boolean;
    plays?: IPlay[];
    system?: ISystem;
}

@connect(
    (state: IState) => ({
        plays: state.my.plays,
        system: state.system,
    }),
    (dispatch: Dispatch) => ({
        actions: {
            auth: bindActionCreators(actions(AuthAction), dispatch)
        }
    })
)
export class Sidebar extends React.Component<ISidebarProps> {
    render() {
        const { plays, system, actions, noFooter } = this.props;
        const hasLogin = !!system.sign;
        return <div className={`sidebar ${noFooter ? 'no-footer' : ''}`}>
            <UserInfo username={system.nickname} avatar={system.avatar} onLogout={() => actions.auth.logout()}/>
            <div className="sidebar-content">
                <Navigation>
                    <Navigation.Item to="/discoveries">
                        <AppstoreOutlined className="sidebar-icon"/>发现音乐
                    </Navigation.Item>
                    <Navigation.Item to="/tops">
                        <FireOutlined className="sidebar-icon"/>排行榜
                    </Navigation.Item>
                    <Navigation.Item to="/plays">
                        <MenuUnfoldOutlined className="sidebar-icon"/>歌单
                    </Navigation.Item>
                    <Navigation.Item to="/movies">
                        <YoutubeOutlined className="sidebar-icon"/>视频
                    </Navigation.Item>
                    <Navigation.Item to="/channels">
                        <PlayCircleOutlined className="sidebar-icon"/>有声专栏
                    </Navigation.Item>
                    {/*<Navigate.Item to="/friends">*/}
                    {/*    <TeamOutlined className="sidebar-icon"/>朋友*/}
                    {/*</Navigate.Item>*/}
                </Navigation>
                <Navigation title="我的音乐">
                    {hasLogin && <Navigation.Item to={`/musicians/${system.userId}`}>
                        <UserOutlined className="sidebar-icon"/>我的音乐
                    </Navigation.Item>}
                    <Navigation.Item to="/downloads">
                        <DownloadOutlined className="sidebar-icon"/>下载管理
                    </Navigation.Item>
                    <Navigation.Item to="/clouds">
                        <CloudOutlined className="sidebar-icon"/>我的音乐云盘
                    </Navigation.Item>
                    {hasLogin && <Navigation.Item to="/favorite/collections">
                        <StarOutlined className="sidebar-icon"/>我的收藏
                    </Navigation.Item>}
                </Navigation>
                {hasLogin && <Navigation title="创建的歌单">
                    <Navigation.Item to="/favorite/songs">
                        <HeartOutlined className="sidebar-icon"/>我喜欢的音乐
                    </Navigation.Item>
                    {plays.map((play: IPlay) =>
                        <Navigation.Item key={play.id} to={`/plays/${play.id}`}>
                            <MenuUnfoldOutlined className="sidebar-icon"/>{play.title}
                        </Navigation.Item>
                    )}
                </Navigation>}
            </div>
        </div>;
    }
}
