import * as React from 'react';
import { IMovie } from "../../interfaces";
import { EndLoader, ImgCard, Loading } from "../../components";
import { useSWRInfinite } from "swr";
import { buildFavoriteMoviesUrl } from "../../constants/urls.constant";

const fetcher = async url => {
    const res = await fetch(url);
    const data = await res.json();
    return data?.data;
};

export const FavoriteMovies = () => {
    const { data, size, setSize, isValidating } = useSWRInfinite<IMovie[]>(
        index => buildFavoriteMoviesUrl(index + 1),
        fetcher,
    );
    const movies = data ? [].concat(...data) : [];
    const isReachEnd = data?.[data?.length - 1]?.length === 0;

    const nextPage = async () => {
        await setSize(size + 1);
    }

    return (
        <EndLoader target="main" onLoad={() => !isValidating && nextPage()}>
            <div>
                <ImgCard count={3}>
                    {movies?.map((movie: IMovie) =>
                        <ImgCard.Item
                            height={128}
                            key={movie.id}
                            title={movie.title}
                            extra={Number(movie.play)}
                            img={movie.cover_url}
                            onClick={() => location.hash = `#/movies/${movie.id}`}
                        />
                    )}
                </ImgCard>
            </div>
            <Loading loading={isValidating} nodata={isReachEnd}/>
        </EndLoader>
    )
}
