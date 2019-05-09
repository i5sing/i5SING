import * as React from 'react';
import { connect } from 'react-redux';
import { IState } from "../../reducers";
import { bindActionCreators, Dispatch } from "redux";
import { actions } from "../../utils/ActionUtil";
import { UserAction } from "../../actions/UserAction";
import { IUser } from "../../interfaces/IUser";
import { EndLoader } from "../../components/EndLoader";
import { ImgCard } from "../../components/ImgCard";
import { Loading } from "../../components/Loading";
import { LOVE } from "../../constants/ActionTypes";
import { UPDATE_PROPERTY } from "../../constants/Actions";
import { INetwork } from "../../interfaces/INetwork";

export interface IFavoriteMusiciansProps {
    actions?: {
        user: typeof UserAction;
    };
    musicians?: IUser[];
    userId?: number;
    network?: INetwork;
}

@connect(
    (state: IState) => ({
        musicians: state.love.musicians,
        userId: state.system.userId,
        network: state.networks[`${ LOVE }_${ UPDATE_PROPERTY }_musicians`]
    }),
    (dispatch: Dispatch) => ({
        actions: {
            user: bindActionCreators(actions(UserAction), dispatch),
        }
    })
)
export class FavoriteMusicians extends React.Component<IFavoriteMusiciansProps> {
    public state = {
        page: 1,
    };

    componentDidMount(): void {
        const { userId } = this.props;
        this.props.actions.user.getFollowers(userId, 1);
    }

    nextPage() {
        const { userId } = this.props;
        this.setState({ page: this.state.page + 1 }, () => {
            this.props.actions.user.getFollowers(userId, this.state.page);
        });
    }

    render() {
        const { musicians, network = { loading: true, nodata: false } } = this.props;
        return <EndLoader target="main" onLoad={ () => !network.nodata && this.nextPage() }>
            <div>
                <ImgCard count={ 4 }>
                    { musicians.map((musician: IUser) =>
                        <ImgCard.Item
                            height={ 171.5 }
                            key={ musician.id }
                            title={ musician.nickname }
                            img={ musician.image }
                            onClick={ () => location.hash = `#/musicians/${ musician.id }` }
                        />
                    ) }
                </ImgCard>
            </div>
            <Loading loading={ network.loading } nodata={ network.nodata }/>
        </EndLoader>
    }
}
