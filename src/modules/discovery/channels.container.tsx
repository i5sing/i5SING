import * as React from 'react';
import useSWR from "swr";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import './channels.less';
import { IChannel } from "../../interfaces";
import { Card, Channel } from "../../components";
import { buildChannelsUrl } from "../../constants/urls.constant";
import { IResponse } from "../../interfaces/response.interface";

export const Channels = () => {
    const { list, current } = useSelector<any, any>(state => state.current);
    const playingSong = list[current];
    const { data } = useSWR<IResponse<IChannel[]>>(buildChannelsUrl(1, 1, 10));
    const channels = data?.data;
    if (!channels) {
        return <span/>;
    }
    return <Card title={<Link to="/channels">
        有声专栏 <span style={{ position: 'relative', top: -1 }}>&gt;</span>
    </Link>}>
        <Channel>
            {channels?.slice(0, 6)?.map((channel: IChannel) => <Channel.Item
                active={playingSong && playingSong.id === channel.id}
                onClick={() => this.props.actions.current.play(channel.id, channel.type)}
                key={channel.id}
                picture={channel.pic}
                name={channel.name}
                username={channel.nickname}
                to={`/musicians/${channel.user_id}`}
            />)}
        </Channel>
    </Card>
}
