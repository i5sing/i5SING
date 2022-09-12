import * as React from 'react';
import * as defaultUserImage from '../../assets/i5sing.png';
import { Card, ImgCard } from "../../components";
import useSWR from "swr";
import { buildLatestMusiciansUrl } from "../../constants/urls.constant";
import { IResponse } from "../../interfaces/response.interface";
import { ILatestSong } from "../../interfaces";

export const LatestMusician = () => {
    const { data } = useSWR<IResponse<ILatestSong[]>>(buildLatestMusiciansUrl());
    const musicians = data?.data;
    if (musicians?.length > 5) {
        musicians.pop();
    }

    return <Card title={"新入驻音乐人"} style={{ marginTop: 40 }}>
        <ImgCard>
            {musicians?.map((musician) =>
                <ImgCard.Item
                    height={128}
                    key={musician.ID}
                    title={musician.NN}
                    img={musician.I.includes('http') ? musician.I : defaultUserImage}
                    onClick={() => location.hash = `#/musicians/${musician.ID}`}
                />
            )}
        </ImgCard>
    </Card>
}
