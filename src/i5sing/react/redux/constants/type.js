/**
 * Created by zhaofeng on 7/11/16.
 */
import keyMirror from 'key-mirror';

export default keyMirror({
    /**
     * 获取轮播图列表
     */
    GET_ADVERTISEMENTS: 'GET_ADVERTISEMENTS',

    /**
     * 获取每日推荐
     */
    GET_DAILY_RECOMMEND: 'GET_DAILY_RECOMMEND',

    /**
     * 获取专栏详情
     */
    GET_SPECIAL_COLUMN: 'GET_SPECIAL_COLUMN',

    /**
     * 获取专栏列表
     */
    GET_SPECIAL_COLUMNS: 'GET_SPECIAL_COLUMNS',

    /**
     * 获取新入驻音乐人
     */
    GET_LATEST_SINGERS: 'GET_LATEST_SINGERS',

    /**
     * 获取热门音乐人
     */
    GET_SINGERS: 'GET_SINGERS',

    /**
     * 发现模块request error
     */
    APPEARANCE_ERROR: 'APPEARANCE_ERROR',

    /**
     * 获取排行榜概览
     */
    GET_RANK_OVERVIEW: 'GET_RANK_OVERVIEW',

    /**
     * 获取排行榜详情
     */
    GET_RANK_DETAIL: 'GET_RANK_DETAIL',

    /**
     * 排行榜模块 request error
     */
    RANK_ERROR: 'RANK_ERROR',

    /**
     * 获取用户信息
     */
    GET_USER: 'GET_USER',

    /**
     * 获取用户歌曲
     */
    GET_USER_SONGS: 'GET_USER_SONGS',

    /**
     * 获取歌单列表
     */
    GET_COLLECTIONS: 'GET_COLLECTIONS',

    /**
     * 获取歌单详情
     */
    GET_COLLECTION: 'GET_COLLECTION',

    /**
     * 获取歌单歌曲
     */
    GET_COLLECTION_SONG: 'GET_COLLECTION_SONG',

    /**
     * 获取广场列表
     */
    GET_SQUARE: 'GET_SQUARE',

    PLAY: 'PLAY',
    PLAY2: 'PLAY2',

    /**
     * 清空播放列表
     */
    CLEAR: 'CLEAR',

    /**
     * 添加到播放列表
     */
    ADD: 'ADD',

    /**
     * 暂停
     */
    PAUSE: 'PAUSE',

    /**
     * 继续
     */
    RESUME: 'RESUME',

    /**
     * common模块播放成功acton
     */
    ACTION: 'ACTION',

    /**
     * 下一曲
     */
    NEXT: 'NEXT',

    /**
     * 上一曲
     */
    PREVIOUS: 'PREVIOUS',

    /**
     * 改变播放顺序
     */
    CHANGE_PLAY_TYPE: 'CHANGE_PLAY_TYPE',

    /**
     * 获取self信息
     */
    GET_PERSONAL_INFO: 'GET_PERSONAL_INFO',

    /**
     * 获取歌曲信息
     */
    GET_SONG_INFO: 'GET_SONG_INFO',

    /**
     * 获取收藏歌曲
     */
    GET_MY_SONGS: 'GET_MY_SONGS',

    /**
     * 搜索
     */
    SEARCH: 'SEARCH',

    /**
     * 获取我的关注
     */
    GET_MY_ATTENTION: 'GET_MY_ATTENTION',

    /**
     * 获取我的粉丝
     */
    GET_MY_FANS: 'GET_MY_FANS',

    /**
     * 获取收藏的歌单
     */
    GET_ATTENTION_COLLECTION: 'GET_ATTENTION_COLLECTION',

    /**
     * 退出登录
     */
    LOGOUT: 'LOGOUT',

    /**
     * 同步歌曲到收藏
     */
    SYNC_SONG: 'SYNC_SONG',

    /**
     * 添加到我的关注
     */
    ADD_TO_MY_ATTENTION: 'ADD_TO_MY_ATTENTION',

    /**
     * 从我的关注移除
     */
    REMOVE_FROM_MY_ATTENTION: 'REMOVE_FROM_MY_ATTENTION',

    /**
     * 添加歌单到我的收藏
     */
    ADD_TO_MY_COLLECTIONS: 'ADD_TO_MY_COLLECTIONS',

    /**
     * 从我的收藏中移除歌单
     */
    REMOVE_FROM_MY_COLLECTIONS: 'REMOVE_FROM_MY_COLLECTIONS',

    /**
     * 播放搜索结果中的歌曲
     */
    PLAY_SINGLE: 'PLAY_SINGLE',

    GET_SINGER_ATTENTION: 'GET_SINGER_ATTENTION',

    GET_SINGER_FANS: 'GET_SINGER_FANS',

    GET_RECOMMEND_COLLECTIONS: 'GET_RECOMMEND_COLLECTIONS',

    DOWNLOAD: 'DOWNLOAD'
})