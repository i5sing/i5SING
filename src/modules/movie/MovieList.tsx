import * as React from 'react';
import { connect } from 'react-redux';
import { IState } from "../../reducers";
import { bindActionCreators, Dispatch } from "redux";
import { actions } from "../../utils/ActionUtil";
import { MovieAction } from "../../actions";
import { ImgCard } from "../../components/ImgCard";

import './MovieList.less';
import { IMovie } from "../../interfaces/IMovie";
import { Tool } from "../../components/Tool";
import { Tag } from "../../components/Tag";
import { Layout } from "../../components/Layout";
import { HOT, LATEST, RECOMMEND } from "../../constants/MovieSortType";
import { Loading } from "../../components/Loading";
import { EndLoader } from "../../components/EndLoader";
import { MOVIES } from "../../constants/ActionTypes";
import { SET } from "../../constants/Actions";
import { INetwork } from "../../interfaces/INetwork";

export interface IMovieListProp {
    actions?: {
        movie: typeof MovieAction;
    };
    network?: INetwork;
    movies?: IMovie[];
}

interface IMovieListState {
    sortType: number;
    page: number;
}

@connect(
    (state: IState) => ({
        movies: state.movies,
        network: state.networks[`${ MOVIES }_${ SET }`]
    }),
    (dispatch: Dispatch) => ({
        actions: {
            movie: bindActionCreators(actions(MovieAction), dispatch)
        }
    })
)
export class MovieList extends React.Component<IMovieListProp, IMovieListState> {
    public state = {
        page: 1,
        sortType: RECOMMEND,
    };

    componentDidMount(): void {
        this.props.actions.movie.getMovies(1);
    }

    componentWillUnmount(): void {
        this.setState({ page: 1, sortType: RECOMMEND });
    }

    refresh(sortType: number) {
        this.props.actions.movie.getMovies(1, sortType);
        this.setState({ sortType, page: 1 });
    }

    nextPage() {
        this.setState({ page: this.state.page + 1 }, () => {
            this.props.actions.movie.getMovies(this.state.page, this.state.sortType);
        });
    }

    render() {
        const { movies, network = { loading: true, nodata: false } } = this.props;
        return <Layout id="main">
            <EndLoader target="main" onLoad={ () => !network.nodata && this.nextPage() }>
                <Tool>
                    <Tag title="最新" selected={ this.state.sortType === LATEST }
                         onClick={ () => this.refresh(LATEST) }
                    />
                    <Tag title="最热" selected={ this.state.sortType === HOT }
                         onClick={ () => this.refresh(HOT) }
                    />
                    <Tag title="推荐" selected={ this.state.sortType === RECOMMEND }
                         onClick={ () => this.refresh(RECOMMEND) }
                    />
                </Tool>
                <div className="movies">
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
        </Layout>
    }
}
