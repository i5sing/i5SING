import * as React from 'react';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { IState } from "../../reducers";
import { bindActionCreators, Dispatch } from "redux";
import { MovieAction } from "../../actions";
import { IMovie } from "../../interfaces";
import { actions } from "../../helpers";
import { Card, ImgCard } from "../../components";

export interface IMovieListProps {
    actions?: {
        movie: typeof MovieAction;
    };
    movies?: IMovie[];
}

interface IMovieListState {
}


@connect(
    (state: IState) => ({
        movies: state.discoveryMovies,
    }),
    (dispatch: Dispatch) => ({
        actions: {
            movie: bindActionCreators(actions(MovieAction), dispatch),
        }
    })
)
export class MovieList extends React.Component<IMovieListProps, IMovieListState> {
    componentDidMount(): void {
        this.props.actions.movie.getMovies(1);
    }

    render() {
        const { movies } = this.props;
        if (movies.length === 0) {
            return '';
        }
        return <Card title={<Link to="/movies">
            推荐MV <span style={{ position: 'relative', top: -1 }}>&gt;</span>
        </Link>} style={{ marginTop: 40 }}>
            <ImgCard count={4}>
                {movies.map((movie: IMovie) =>
                    <ImgCard.Item
                        height={100}
                        key={movie.id}
                        title={movie.title}
                        img={movie.cover}
                        onClick={() => location.hash = `#/movies/${movie.id}`}
                    />
                )}
            </ImgCard>
        </Card>
    }
}
