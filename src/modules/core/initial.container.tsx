import * as React from 'react';
import { connect } from 'react-redux';
import { IState } from "../../reducers";
import { bindActionCreators, Dispatch } from "redux";
import { CloudAction, PlayAction, SongAction } from "../../actions";
import { SystemAction } from "../../actions/system.action";
import { ICloud, ISystem } from "../../interfaces";
import { actions } from "../../helpers";

export interface IInitialProps {
    actions?: {
        song: typeof SongAction;
        system: typeof SystemAction;
        play: typeof PlayAction;
        cloud: typeof CloudAction;
    };
    system?: ISystem;
    cloud?: ICloud;
}

@connect(
    (state: IState) => ({
        system: state.system,
        cloud: state.cloud,
    }),
    (dispatch: Dispatch) => ({
        actions: {
            system: bindActionCreators(actions(SystemAction), dispatch),
            song: bindActionCreators(actions(SongAction), dispatch),
            play: bindActionCreators(actions(PlayAction), dispatch),
            cloud: bindActionCreators(actions(CloudAction), dispatch),
        }
    })
)
export class Initial extends React.Component<IInitialProps> {
    componentDidMount(): void {
        if (this.props.system.sign) {
            this.props.actions.song.getLoveSongsStatus();
        }
        this.props.actions.song.getLocalSongs();
        this.props.actions.system.refreshSystem();
        if (this.props.cloud.accessKey) {
            this.props.actions.cloud.getCloudSongs();
        }
    }

    componentWillReceiveProps(nextProps: Readonly<IInitialProps>, nextContext: any): void {
        if (nextProps.system.sign && !this.props.system.sign) {
            this.props.actions.song.getLoveSongsStatus();
        }
    }

    render() {
        return '';
    }
}
