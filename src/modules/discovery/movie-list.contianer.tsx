import * as React from 'react';
import { Link } from "react-router-dom";
import { IMovie } from "../../interfaces";
import { Card, ImgCard } from "../../components";
import useSWR from "swr";
import { buildMoviesUrl } from "../../constants/urls.constant";
import { IResponse } from "../../interfaces/response.interface";

export const MovieList = () => {
    const { data } = useSWR<IResponse<IMovie[]>>(buildMoviesUrl(1));
    const movies = data?.data;
    if (!movies) {
        return <span/>;
    }

    return (
        <Card
            title={<Link to="/movies">
                推荐MV <span style={{ position: 'relative', top: -1 }}>&gt;</span>
            </Link>}
            style={{ marginTop: 40 }}>
            <ImgCard count={4}>
                {movies?.slice(0, 3)?.map((movie: IMovie) =>
                    <ImgCard.Item
                        height={100}
                        key={movie.id}
                        title={movie.title}
                        img={movie.cover_url}
                        onClick={() => location.hash = `#/movies/${movie.id}`}
                    />
                )}
            </ImgCard>
        </Card>
    )
}
