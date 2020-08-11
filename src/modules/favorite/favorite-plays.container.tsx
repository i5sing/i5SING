import * as React from 'react';
import { connect } from 'react-redux';
import { IState } from "../../reducers";
import { bindActionCreators, Dispatch } from "redux";
import { PlayAction } from "../../actions";
import { INetwork, IPlay } from "../../interfaces";
import { LOVE } from "../../constants/action-types.constant";
import { UPDATE_PROPERTY } from "../../constants/actions.constant";
import { actions } from "../../helpers";
import { EndLoader, ImgCard, Loading } from "../../components";

export interface IFavoritePlaysProps {
    actions?: {
        play: typeof PlayAction;
    };
    network?: INetwork;
    plays?: IPlay[];
}

interface IFavoritePlaysState {
    page: number;
}

@connect(
    (state: IState) => ({
        plays: state.love.plays,
        network: state.networks[`${LOVE}_${UPDATE_PROPERTY}_plays`]
    }),
    (dispatch: Dispatch) => ({
        actions: {
            play: bindActionCreators(actions(PlayAction), dispatch)
        }
    })
)
export class FavoritePlays extends React.Component<IFavoritePlaysProps, IFavoritePlaysState> {
    public state = {
        page: 1,
    };

    componentDidMount(): void {
        this.props.actions.play.getLovePlays(1);
    }

    nextPage() {
        this.setState({ page: this.state.page + 1 }, () => {
            this.props.actions.play.getLovePlays(this.state.page);
        });
    }

    render() {
        const { plays, network = { loading: true, nodata: false } } = this.props;
        return <EndLoader target="main" onLoad={() => !network.nodata && this.nextPage()}>
            <div>
                <ImgCard count={4}>
                    {plays.map((play: IPlay) =>
                        <ImgCard.Item
                            height={171.5}
                            key={play.id}
                            title={play.title}
                            extra={play.playCount}
                            img={play.picture}
                            onClick={() => location.hash = `#/plays/${play.id}`}
                        />
                    )}
                </ImgCard>
            </div>
            <Loading loading={network.loading} nodata={network.nodata}/>
        </EndLoader>
    }
}
