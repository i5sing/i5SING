import * as React from 'react';
import { useSelector } from 'react-redux';
import { IChannel } from "../../interfaces";
import { Channel, EndLoader, Layout, Loading } from "../../components";
import { useSWRInfinite } from "swr";
import { buildChannelsUrl } from "../../constants/urls.constant";

const fetcher = async url => {
    const res = await fetch(url);
    const data = await res.json();
    return data?.data;
};
const PAGE_SIZE = 10;

export const Channels = () => {
    const { list, current } = useSelector<any, any>(state => state.current);
    const { data, size, setSize, isValidating } = useSWRInfinite<IChannel[]>(
        index => buildChannelsUrl(1, index + 1, PAGE_SIZE),
        fetcher,
    );
    const playingSong = list[current];
    const nextPage = () => setSize(size + 1);
    const channels = data ? [].concat(...data) : [];
    const isEmpty = data?.[0]?.length === 0;
    const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE);
    return <Layout id="main">
        <EndLoader target="main" onLoad={() => !isValidating && !isReachingEnd && nextPage()}>
            <Channel>
                {channels?.map((channel: IChannel) => <Channel.Item
                    active={playingSong && playingSong.id === channel.id}
                    onClick={() => this.props.actions.current.play(channel.id, channel.type)}
                    key={channel.id}
                    picture={channel.pic}
                    name={channel.name}
                    username={channel.nickname}
                    to={`/musicians/${channel.user_id}`}
                />)}
            </Channel>
            <div style={{ marginTop: 40 }}>
                <Loading loading={isValidating} nodata={isReachingEnd}/>
            </div>
        </EndLoader>
    </Layout>;
}
