export const buildCarouselsUrl = (advertId: number) => (
    `http://mobileapi.5sing.kugou.com/other/getAdvert?advert_id=${advertId}`
)

export const buildChannelsUrl = (channelId: number, page: number = 1, size: number = 10) => (
    `http://mobileapi.5sing.kugou.com/song/GetRecommendSingle?channel_id=${channelId}&page=${page}&pagesize=${size}`
)

export const buildMyPlaysUrl = (userId: number, page: number = 1, size: number = 9999) => (
    `http://mobileapi.5sing.kugou.com/song/listsonglist?userid=${userId}&pageindex=${page}&pagesize=${size}`
)

export const buildLogoutUrl = () => `http://127.0.0.1:56562/auth/logout`;

export const buildLatestMusiciansUrl = () => (
    `http://mobileapi.5sing.kugou.com/musician/latestList`
)

export const buildLatestSongsUrl = () => (
    `http://mobileapi.5sing.kugou.com/songlist/first?isfirst=2`
)

export const buildRecommendPlaysUrl = (index: number) => (
    `http://mobileapi.5sing.kugou.com/go/GetSongListSquareRecommended?index=${index}`
)

export const buildPlaysUrl = (label: string, page: number = 1, size: number = 10) => (
    `http://goapi.5sing.kugou.com/search/songSquare?sortType=1&pn=${page}&ps=${size}&label=${label}`
)

export const buildMoviesUrl = (page: number = 1, sortType: number = 3, userId?: number) => (
    `http://mobileapi.5sing.kugou.com/mv/list?from=2&kind=0&where=1&sortType=${sortType}&pageIndex=${page}${userId ? `&userid=${userId}` : ''}`
)

export const buildCloudSongsUrl = () => (
    `http://127.0.0.1:56562/cloud/songs`
)

export const buildDeleteCloudSongUrl = (name: string) => (
    `http://127.0.0.1:56562/cloud/songs/${encodeURIComponent(name)}`
)

export const buildFavoriteMoviesUrl = (page: number) => (
    `http://mobileapi.5sing.kugou.com/mv/CollectList?page=${page}`
)

export const buildFavoriteMusiciansUrl = (userId: number, page: number = 1, size: number = 10) => (
    `http://mobileapi.5sing.kugou.com/follow/list?userid=${userId}&pageindex=${page}&pagesize=${size}`
)
