import * as React from 'react';
import './play-list.less';
import { IPlay } from "../../interfaces";
import { EndLoader, ImgCard, Layout, Loading, Tag, Tool } from "../../components";
import { useState } from "react";
import { useSWRInfinite } from "swr";
import { buildPlaysUrl, buildRecommendPlaysUrl } from "../../constants/urls.constant";

const getFetcher = (hasLabel?: boolean) => {
    return async url => {
        const res = await fetch(url);
        const data = await res.json();
        if (hasLabel) {
            return data?.data?.songMenu?.map(item => ({
                playCount: item.playcount,
                title: item.listName,
                picture: item.url,
                id: item.listId,
                user: {
                    id: item.user.ID,
                    nickname: item.user.NN,
                    image: item.user.I,
                }
            }));
        }

        return data?.data?.map(item => ({
            title: item.T,
            picture: item.P,
            id: item.ID,
            playCount: Number(item.H),
            user: {
                id: item.user.ID,
                nickname: item.user.NN,
                image: item.user.I,
            }
        }));
    };
}

const PAGE_SIZE = 10;

export const PlayList = () => {
    const [label, updateLabel] = useState('');
    const { data, isValidating, size, setSize } = useSWRInfinite<IPlay[]>(
        index => label ?
            buildPlaysUrl(label, index + 1, PAGE_SIZE) :
            buildRecommendPlaysUrl(index + 1),
        getFetcher(!!label),
    );
    const isEmpty = data?.[0]?.length === 0;
    const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE);
    const plays = data ? [].concat(...data) : [];

    const changeLabel = (label?: string) => {
        updateLabel(label);
        setSize(size + 1);
    }

    const nextPage = () => {
        setSize(size + 1);
    }

    return (
        <Layout id="main">
            <EndLoader target="main" onLoad={() => !isValidating && !isReachingEnd && nextPage()}>
                <Tool>
                    <Tag title="话语" selected={label === '话语'} onClick={() => changeLabel("话语")}/>
                    <Tag title="流行" selected={label === '流行'} onClick={() => changeLabel("流行")}/>
                    <Tag title="摇滚" selected={label === '摇滚'} onClick={() => changeLabel("摇滚")}/>
                    <Tag title="民谣" selected={label === '民谣'} onClick={() => changeLabel("民谣")}/>
                    <Tag title="电子" selected={label === '电子'} onClick={() => changeLabel("电子")}/>
                    <Tag title="古风" selected={label === '古风'} onClick={() => changeLabel("古风")}/>
                    <Tag title="轻音乐" selected={label === '轻音乐'} onClick={() => changeLabel("轻音乐")}/>
                    <Tag title="中国风" selected={label === '中国风'} onClick={() => changeLabel("中国风")}/>
                    <Tag title="武侠" selected={label === '武侠'} onClick={() => changeLabel("武侠")}/>
                    <Tag title="推荐" selected={!label} onClick={() => changeLabel()}/>
                </Tool>
                <div className="playlist">
                    <ImgCard count={4}>
                        {plays?.map((play: IPlay, index) =>
                            <ImgCard.Item
                                height={171.5}
                                key={index}
                                title={play.title}
                                extra={play.playCount}
                                img={play.picture}
                                onClick={() => location.hash = `#/plays/${play.id}`}
                            />
                        )}
                    </ImgCard>
                </div>
                <Loading loading={isValidating} nodata={isEmpty}/>
            </EndLoader>
        </Layout>
    )
}
