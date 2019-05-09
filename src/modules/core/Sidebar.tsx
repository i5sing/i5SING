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
                        <i className="i5sing-font middle">&#xe6e8;</i>发现音乐
                    </Navigate.Item>
                    <Navigate.Item to="/tops">
                        <i className="i5sing-font middle">&#xe782;</i>排行榜
                    </Navigate.Item>
                    <Navigate.Item to="/plays">
                        <i className="i5sing-font middle">&#xe642;</i>歌单
                    </Navigate.Item>
                    <Navigate.Item to="/movies">
                        <i className="i5sing-font middle">&#xe642;</i>视频
                    </Navigate.Item>
                    <Navigate.Item to="/channels">
                        <i className="i5sing-font middle">&#xe642;</i>有声专栏
                    </Navigate.Item>
                    <Navigate.Item to="/friends">
                        <i className="i5sing-font middle">&#xe642;</i>朋友
                    </Navigate.Item>
                </Navigate>
                <Navigate title="我的音乐">
                    { hasLogin && <Navigate.Item to={ `/musicians/${ system.userId }` }>
                        <i className="i5sing-font middle">&#xe6e8;</i>我的音乐
                    </Navigate.Item> }
                    <Navigate.Item to="/downloads">
                        <i className="i5sing-font middle">&#xe782;</i>下载管理
                    </Navigate.Item>
                    <Navigate.Item to="/clouds">
                        <i className="i5sing-font middle">&#xe782;</i>我的音乐云盘
                    </Navigate.Item>
                    { hasLogin && <Navigate.Item to="/favorite/collections">
                        <i className="i5sing-font middle">&#xe642;</i>我的收藏
                    </Navigate.Item> }
                </Navigate>
                { hasLogin && <Navigate title="创建的歌单">
                    <Navigate.Item to="/favorite/songs">
                        <i className="i5sing-font middle">&#xe642;</i>我喜欢的音乐
                    </Navigate.Item>
                    { plays.map((play: IPlay) =>
                        <Navigate.Item key={ play.id } to={ `/plays/${ play.id }` }>
                            <i className="i5sing-font middle">&#xe642;</i>{ play.title }
                        </Navigate.Item>
                    ) }
                </Navigate> }
            </div>
        </div>;
    }
}
