import * as React from 'react';
import { useSelector } from 'react-redux';
import './sidebar.less';
import { IMyPlay, ISystem } from "../../interfaces";
import { instance } from "../../helpers";
import { UserInfo, Navigation } from "../../components";
import { buildLogoutUrl, buildMyPlaysUrl } from "../../constants/urls.constant";
import useSWR from "swr";
import { IResponse } from "../../interfaces/response.interface";
import {
    AppstoreOutlined, CloudOutlined, DownloadOutlined,
    FireOutlined, HeartOutlined,
    MenuUnfoldOutlined,
    PlayCircleOutlined, StarOutlined, UserOutlined,
    YoutubeOutlined
} from "@ant-design/icons";

export interface ISidebarProps {
    noFooter?: boolean;
}

export const Sidebar = ({ noFooter }: ISidebarProps) => {
    const { sign, nickname, avatar, userId } = useSelector<any, ISystem>(state => state.system);
    const { data } = useSWR<IResponse<any>>(userId ? buildMyPlaysUrl(userId) : null);
    const plays = data?.data;

    const hasLogin = !!sign;
    console.log(plays);
    const logout = async () => await instance.post(buildLogoutUrl());
    return <div className={`sidebar ${noFooter ? 'no-footer' : ''}`}>
        <UserInfo username={nickname} avatar={avatar} onLogout={() => logout()}/>
        <div className="sidebar-content">
            <Navigation>
                <Navigation.Item to="/discoveries">
                    <AppstoreOutlined className="sidebar-icon" />发现音乐
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
                {/*    <Icon className="sidebar-icon" type="team"/>朋友*/}
                {/*</Navigate.Item>*/}
            </Navigation>
            <Navigation title="我的音乐">
                {hasLogin && <Navigation.Item to={`/musicians/${userId}`}>
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
                {plays?.map((play: IMyPlay) =>
                    <Navigation.Item key={play.ID} to={`/plays/${play.ID}`}>
                        <MenuUnfoldOutlined className="sidebar-icon"/>{play.T}
                    </Navigation.Item>
                )}
            </Navigation>}
        </div>
    </div>;
}
