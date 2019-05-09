import * as React from 'react';
import { connect } from 'react-redux';
import { IState } from "../../reducers";
import { bindActionCreators, Dispatch } from "redux";
import { actions } from "../../utils/ActionUtil";
import { MovieAction } from "../../actions";
import { ImgCard } from "../../components/ImgCard";

import { IMovie } from "../../interfaces/IMovie";
import { Loading } from "../../components/Loading";
import { EndLoader } from "../../components/EndLoader";
import { LOVE } from "../../constants/ActionTypes";
import { UPDATE_PROPERTY } from "../../constants/Actions";
import { INetwork } from "../../interfaces/INetwork";

export interface IMovieListProp {
    actions?: {
        movie: typeof MovieAction;
    };
    network?: INetwork;
    movies?: IMovie[];
}

interface IMovieListState {
    page: number;
}

@connect(
    (state: IState) => ({
        movies: state.love.movies,
        network: state.networks[`${ LOVE }_${ UPDATE_PROPERTY }_movies`]
    }),
    (dispatch: Dispatch) => ({
        actions: {
            movie: bindActionCreators(actions(MovieAction), dispatch)
        }
    })
)
export class FavoriteMovies extends React.Component<IMovieListProp, IMovieListState> {
    public state = {
        page: 1,
    };

    componentDidMount(): void {
        this.props.actions.movie.getFavoriteMovies();
    }

    componentWillUnmount(): void {
        this.setState({ page: 1 });
    }

    nextPage() {
        this.setState({ page: this.state.page + 1 }, () => {
            this.props.actions.movie.getFavoriteMovies(this.state.page);
        });
    }

    render() {
        const { movies, network = { loading: true, nodata: false } } = this.props;
        return <EndLoader target="main" onLoad={ () => !network.nodata && this.nextPage() }>
            <div>
                <ImgCard count={ 3 }>
                    { movies.map((movie: IMovie) =>
                        <ImgCard.Item
                            height={ 128 }
                            key={ movie.id }
                            title={ movie.title }
                            extra={ movie.play }
                            img={ movie.cover }
                            onClick={ () => location.hash = `#/movies/${ movie.id }` }
                        />
                    ) }
                </ImgCard>
            </div>
            <Loading loading={ network.loading } nodata={ network.nodata }/>
        </EndLoader>
    }
}
