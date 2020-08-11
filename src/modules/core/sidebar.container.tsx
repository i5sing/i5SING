import * as React from 'react';
import { connect } from 'react-redux';
import './sidebar.less';
import { IState } from "../../reducers";
import { bindActionCreators, Dispatch } from "redux";
import { AuthAction } from "../../actions";
import { Icon } from "antd";
import { IPlay, ISystem } from "../../interfaces";
import { actions } from "../../helpers";
import { UserInfo, Navigation } from "../../components";

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
                        <Icon className="sidebar-icon" type="appstore"/>发现音乐
                    </Navigation.Item>
                    <Navigation.Item to="/tops">
                        <Icon className="sidebar-icon" type="fire"/>排行榜
                    </Navigation.Item>
                    <Navigation.Item to="/plays">
                        <Icon className="sidebar-icon" type="menu-unfold"/>歌单
                    </Navigation.Item>
                    <Navigation.Item to="/movies">
                        <Icon className="sidebar-icon" type="youtube"/>视频
                    </Navigation.Item>
                    <Navigation.Item to="/channels">
                        <Icon className="sidebar-icon" type="play-circle"/>有声专栏
                    </Navigation.Item>
                    {/*<Navigate.Item to="/friends">*/}
                    {/*    <Icon className="sidebar-icon" type="team"/>朋友*/}
                    {/*</Navigate.Item>*/}
                </Navigation>
                <Navigation title="我的音乐">
                    {hasLogin && <Navigation.Item to={`/musicians/${system.userId}`}>
                        <Icon className="sidebar-icon" type="user"/>我的音乐
                    </Navigation.Item>}
                    <Navigation.Item to="/downloads">
                        <Icon className="sidebar-icon" type="download"/>下载管理
                    </Navigation.Item>
                    <Navigation.Item to="/clouds">
                        <Icon className="sidebar-icon" type="cloud"/>我的音乐云盘
                    </Navigation.Item>
                    {hasLogin && <Navigation.Item to="/favorite/collections">
                        <Icon className="sidebar-icon" type="star"/>我的收藏
                    </Navigation.Item>}
                </Navigation>
                {hasLogin && <Navigation title="创建的歌单">
                    <Navigation.Item to="/favorite/songs">
                        <Icon className="sidebar-icon" type="heart"/>我喜欢的音乐
                    </Navigation.Item>
                    {plays.map((play: IPlay) =>
                        <Navigation.Item key={play.id} to={`/plays/${play.id}`}>
                            <Icon className="sidebar-icon" type="menu-unfold"/>{play.title}
                        </Navigation.Item>
                    )}
                </Navigation>}
            </div>
        </div>;
    }
}
