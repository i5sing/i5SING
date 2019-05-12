import * as React from 'react';
import { connect } from 'react-redux';
import './Sidebar.less';
import { UserInfo } from "../../components/UserInfo";
import { Navigate } from "../../components/Navigate";
import { IState } from "../../reducers";
import { bindActionCreators, Dispatch } from "redux";
import { IPlay } from "../../interfaces/IPlay";
import { ISystem } from "../../interfaces/ISystem";
import { actions } from "../../utils/ActionUtil";
import { AuthAction } from "../../actions";
import { Icon } from "antd";

export interface ISidebarProps {
    actions?: {
        auth: typeof AuthAction;
    };
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
        const { plays, system, actions } = this.props;
        const hasLogin = !!system.sign;
        return <div className="sidebar">
            <UserInfo username={ system.nickname } avatar={ system.avatar } onLogout={ () => actions.auth.logout() }/>
            <div className="sidebar-content">
                <Navigate>
                    <Navigate.Item to="/discoveries">
                        <Icon className="sidebar-icon" type="appstore"/>发现音乐
                    </Navigate.Item>
                    <Navigate.Item to="/tops">
                        <Icon className="sidebar-icon" type="fire"/>排行榜
                    </Navigate.Item>
                    <Navigate.Item to="/plays">
                        <Icon className="sidebar-icon" type="menu-unfold"/>歌单
                    </Navigate.Item>
                    <Navigate.Item to="/movies">
                        <Icon className="sidebar-icon" type="youtube"/>视频
                    </Navigate.Item>
                    <Navigate.Item to="/channels">
                        <Icon className="sidebar-icon" type="play-circle"/>有声专栏
                    </Navigate.Item>
                    <Navigate.Item to="/friends">
                        <Icon className="sidebar-icon" type="team"/>朋友
                    </Navigate.Item>
                </Navigate>
                <Navigate title="我的音乐">
                    { hasLogin && <Navigate.Item to={ `/musicians/${ system.userId }` }>
                        <Icon className="sidebar-icon" type="user"/>我的音乐
                    </Navigate.Item> }
                    <Navigate.Item to="/downloads">
                        <Icon className="sidebar-icon" type="download"/>下载管理
                    </Navigate.Item>
                    <Navigate.Item to="/clouds">
                        <Icon className="sidebar-icon" type="cloud"/>我的音乐云盘
                    </Navigate.Item>
                    { hasLogin && <Navigate.Item to="/favorite/collections">
                        <Icon className="sidebar-icon" type="star"/>我的收藏
                    </Navigate.Item> }
                </Navigate>
                { hasLogin && <Navigate title="创建的歌单">
                    <Navigate.Item to="/favorite/songs">
                        <Icon className="sidebar-icon" type="heart"/>我喜欢的音乐
                    </Navigate.Item>
                    { plays.map((play: IPlay) =>
                        <Navigate.Item key={ play.id } to={ `/plays/${ play.id }` }>
                            <Icon className="sidebar-icon" type="menu-unfold"/>{ play.title }
                        </Navigate.Item>
                    ) }
                </Navigate> }
            </div>
        </div>;
    }
}
