import * as React from 'react';
import { Card } from "../../components/Card";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { IState } from "../../reducers";
import { bindActionCreators, Dispatch } from "redux";
import { actions } from "../../utils/ActionUtil";
import { ChannelAction, CurrentAction } from "../../actions";
import { IChannel } from "../../interfaces/IChannel";

import './Channel.less';
import { Channel } from "../../components/Channel";
import { ISong } from "../../interfaces/ISong";

export interface IChannelProps {
    actions?: {
        channel: typeof ChannelAction;
        current: typeof CurrentAction;
    },
    channels?: IChannel[];
    current?: number;
    playlist?: ISong[];
}


@connect(
    (state: IState) => ({
        channels: state.discoveryChannels,
        current: state.current.current,
        playlist: state.current.list,
    }),
    (dispatch: Dispatch) => ({
        actions: {
            channel: bindActionCreators(actions(ChannelAction), dispatch),
            current: bindActionCreators(actions(CurrentAction), dispatch),
        }
    })
)
export class Channels extends React.Component<IChannelProps> {
    componentDidMount(): void {
        this.props.actions.channel.getChannels(1, 10);
    }

    render() {
        const { channels, playlist, current } = this.props;
        if (channels.length === 0) {
            return '';
        }
        const playingSong = playlist[current];
        return <Card title={<Link to="/channels">
            有声专栏 <span style={{ position: 'relative', top: -1 }}>&gt;</span>
        </Link>}>
            <Channel>
                {channels.map((channel: IChannel) => <Channel.Item
                    active={playingSong && playingSong.id === channel.id}
                    onClick={() => this.props.actions.current.play(channel.id, channel.type)}
                    key={channel.id}
                    picture={channel.picture}
                    name={channel.name}
                    username={channel.user.nickname}
                    to={`/musicians/${channel.user.id}`}
                />)}
            </Channel>
        </Card>
    }
}
