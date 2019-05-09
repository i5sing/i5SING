import * as React from 'react';
import { connect } from 'react-redux';
import { IState } from "../../reducers";
import { bindActionCreators, Dispatch } from "redux";
import { actions } from "../../utils/ActionUtil";
import { CurrentAction, MovieAction } from "../../actions";
import { IMovie } from "../../interfaces/IMovie";
import { Layout } from "../../components/Layout";
import { Player } from 'video-react';
import { get } from 'lodash';
import './MovieDetail.less';
import { ImgCard } from "../../components/ImgCard";
import { Card } from "../../components/Card";
import { IUser } from "../../interfaces/IUser";
import moment = require("moment");
import { Tool } from "../../components/Tool";

export interface IMovieDetailProps {
    match?: {
        params: {
            movieId: number;
        }
    };
    actions?: {
        movie: typeof MovieAction;
        current: typeof CurrentAction;
    };
    movie?: IMovie;
}

interface IMovieDetailState {
    render: boolean;
}

@connect(
    (state: IState) => ({
        movie: state.movie,
    }),
    (dispatch: Dispatch) => ({
        actions: {
            movie: bindActionCreators(actions(MovieAction), dispatch),
            current: bindActionCreators(actions(CurrentAction), dispatch),
        },
    })
)
export class MovieDetail extends React.Component<IMovieDetailProps, IMovieDetailState> {
    public state = {
        render: true,
    };

    componentDidMount(): void {
        const movieId = this.props.match.params.movieId;
        this.props.actions.movie.getMovie(movieId);
        this.props.actions.current.end();
    }

    componentWillReceiveProps(nextProps: Readonly<IMovieDetailProps>, nextContext: any): void {
        const userId = get(nextProps.movie, 'user.id');
        const movieId = nextProps.match.params.movieId;

        if (userId !== get(this.props.movie, 'user.id')) {
            this.props.actions.movie.getMovies(1, 1, userId);
        }
        if (movieId !== this.props.match.params.movieId) {
            this.setState({ render: false });
            this.props.actions.movie.getMovie(movieId);
            this.props.actions.movie.getMovies(1, 1, userId);
            setTimeout(() => this.setState({ render: true }), 10);
        }
    }

    love(movie: IMovie) {
        if (movie.isCollect) {
            this.props.actions.movie.disloveMovie(movie.id);
        } else {
            this.props.actions.movie.loveMovie(movie.id);
        }
    }

    like(movie: IMovie) {
        if (movie.isLike) {
            this.props.actions.movie.dislikeMovie(movie.id);
        } else {
            this.props.actions.movie.likeMovie(movie.id);
        }
    }

    render() {
        const movie = this.props.movie;
        const user = movie.user as IUser || { image: '', nickname: '', id: '' };
        const otherMovies = movie.movies || [];
        const movieId = this.props.match.params.movieId;

        console.log('test: ', movie);
        return <Layout className="movie-detail">
            { this.state.render && <Player autoPlay={ true } width="100%" controls>
                <source src={ `http://127.0.0.1:56562/movies/${ movieId }/play` }/>
            </Player> }
            <div className="movie-detail-info">
                <h1>{ movie.title }</h1>
                <div className="movie-detail-desc" dangerouslySetInnerHTML={ { __html: movie.description } }>
                </div>
                <div className="movie-detail-user">
                    <img src={ user.image } alt={ user.nickname }
                         onClick={ () => location.hash = `#/musicians/${ user.id }` }/>
                    <span onClick={ () => location.hash = `#/musicians/${ user.id }` }>
                        { user.nickname }
                    </span>
                </div>
                <div className="movie-detail-extra">
                    <span>发布：{ moment(movie.createTime * 1000).format('YYYY-MM-DD') }</span>
                    <span>播放：{ movie.play }次</span>
                </div>
                <Tool>
                    <a className="button" onClick={ () => this.like(movie) }>
                        { movie.isLike ? '已赞' : '赞' } { movie.like }
                    </a>
                    <a className="button" onClick={ () => this.love(movie) }>
                        { movie.isCollect ? '已收藏' : '收藏' } { movie.collect }
                    </a>
                </Tool>
            </div>
            { otherMovies.length > 0 ? <Card title="TA 的其他视频">
                <ImgCard count={ 3 }>
                    { (movie.movies || []).map((movie: IMovie) =>
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
            </Card> : null }
        </Layout>
    }
}
