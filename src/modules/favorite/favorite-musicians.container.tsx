import * as React from 'react';
import { IFollower, ISystem } from "../../interfaces";
import { EndLoader, ImgCard, Loading } from "../../components";
import { useSWRInfinite } from "swr";
import { buildFavoriteMusiciansUrl } from "../../constants/urls.constant";
import { useSelector } from "react-redux";

const fetcher = async url => {
    const res = await fetch(url);
    const data = await res.json();
    return data?.data;
};

const PAGE_SIZE = 10;

export const FavoriteMusicians = () => {
    const { userId } = useSelector<any, ISystem>(state => state.system);
    const { data, size, setSize, isValidating } = useSWRInfinite<IFollower[]>(
        index => userId ? buildFavoriteMusiciansUrl(userId, index + 1, PAGE_SIZE) : null,
        fetcher,
    );
    const musicians = data ? [].concat(...data) : [];
    const isEmpty = data?.[0]?.length === 0;
    const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE);

    const nextPage = async () => {
        await setSize(size + 1);
    }

    return (
        <EndLoader target="main" onLoad={() => !isValidating && nextPage()}>
            <div>
                <ImgCard count={4}>
                    {musicians.map((musician: IFollower) =>
                        <ImgCard.Item
                            height={171.5}
                            key={musician.ID}
                            title={musician.NN}
                            img={musician.I}
                            onClick={() => location.hash = `#/musicians/${musician.ID}`}
                        />
                    )}
                </ImgCard>
            </div>
            <Loading loading={isValidating} nodata={isReachingEnd}/>
        </EndLoader>
    )
}
