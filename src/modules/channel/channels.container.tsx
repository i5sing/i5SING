import * as React from 'react';
import { connect } from 'react-redux';
import { IState } from "../../reducers";
import { bindActionCreators, Dispatch } from "redux";
import { ChannelAction, CurrentAction } from "../../actions";
import { IChannel, INetwork, ISong } from "../../interfaces";
import { CHANNELS } from "../../constants/action-types.constant";
import { SET } from "../../constants/actions.constant";
import { actions } from "../../helpers";
import { Channel, EndLoader, Layout, Loading } from "../../components";

export interface IChannelsProps {
    actions?: {
        channel: typeof ChannelAction;
        current: typeof CurrentAction;
    };
    channels?: IChannel[];
    network?: INetwork;
    current?: number;
    playlist?: ISong[];
}

interface IChannelsState {
    page: number;
}

@connect(
    (state: IState) => ({
        channels: state.channels,
        network: state.networks[`${CHANNELS}_${SET}`],
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
export class Channels extends React.Component<IChannelsProps, IChannelsState> {
    public state = {
        page: 1,
    };

    componentDidMount(): void {
        this.props.actions.channel.getChannels(1);
    }

    componentWillUnmount(): void {
        this.setState({ page: 1 });
    }

    nextPage() {
        this.setState({ page: this.state.page + 1 }, () => {
            this.props.actions.channel.getChannels(this.state.page);
        });
    }

    render() {
        const { channels, network = { loading: true, nodata: false }, playlist, current } = this.props;
        const playingSong = playlist[current];
        return <Layout id="main">
            <EndLoader target="main" onLoad={() => !network.nodata && this.nextPage()}>
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
                <div style={{ marginTop: 40 }}>
                    <Loading loading={network.loading} nodata={network.nodata}/>
                </div>
            </EndLoader>
        </Layout>;
    }
}
