import * as React from 'react';
import { Link } from "react-router-dom";
import { IRecommendPlay } from "../../interfaces";
import { Card, ImgCard } from "../../components";
import useSWR from "swr";
import { buildRecommendPlaysUrl } from "../../constants/urls.constant";
import { IResponse } from "../../interfaces/response.interface";

export const PlayList = () => {
    const { data } = useSWR<IResponse<any>>(buildRecommendPlaysUrl(1));
    const plays = data?.data;
    if (plays?.length === 0) {
        return <span/>;
    }

    return (
        <Card title={<Link to="/plays">
            推荐歌单 <span style={{ position: 'relative', top: -1 }}>&gt;</span>
        </Link>}>
            <ImgCard>
                {plays?.map((play: IRecommendPlay) =>
                    <ImgCard.Item
                        height={128}
                        key={play.ID}
                        title={play.T}
                        extra={Number(play.H)}
                        img={play.P}
                        onClick={() => location.hash = `#/plays/${play.ID}`}
                    />
                )}
            </ImgCard>
        </Card>
    )
}
