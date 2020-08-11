import * as React from 'react';
import { connect } from 'react-redux';
import { IState } from "../../reducers";
import { SearchSongs } from "./search-songs.container";
import { bindActionCreators } from "redux";
import { SearchAction } from "../../actions";
import { SearchUsers } from "./search-users.container";
import { SearchPlays } from "./search-plays.container";
import { Tabs } from "antd";
import { ICloudSong, IDownload, INetwork, IPlay, ISearch, ISong, IUser } from "../../interfaces";
import { SEARCH } from "../../constants/action-types.constant";
import { UPDATE } from "../../constants/actions.constant";
import { actions, toMap } from "../../helpers";
import { EndLoader, Layout, Loading } from "../../components";

export interface ISearchProps {
    actions?: {
        search: typeof SearchAction;
    };
    match?: {
        params: {
            type: string;
            id: string;
        };
    };
    network?: INetwork;
    search?: ISearch;
    downloads?: { [songId: string]: IDownload },
    loveSongs?: ISong[];
    cloudSongs?: ICloudSong[];
    loadings?: { [key: string]: boolean };
}

interface ISearchState {
    page: number;
    size: number;
}

@connect(
    (state: IState) => ({
        network: state.networks[`${SEARCH}_${UPDATE}`],
        search: state.search,
        downloads: state.downloads,
        loveSongs: state.love.songs,
        cloudSongs: state.cloud.songs,
        loadings: state.cloud.loadings,
    }),
    dispatch => ({
        actions: {
            search: bindActionCreators(actions(SearchAction), dispatch),
        }
    })
)
export class Search extends React.Component<ISearchProps, ISearchState> {
    public state = {
        page: 1,
        size: 20,
    };

    componentWillReceiveProps(nextProps: Readonly<ISearchProps>, nextContext: any): void {
        if ((nextProps.match.params.id !== this.props.match.params.id) ||
            (nextProps.match.params.type !== this.props.match.params.type)) {
            this.setState({ page: 1 }, () => {
                const key = nextProps.match.params.id;
                const type = nextProps.match.params.type;
                this.props.actions.search.search(key, type, this.state.page, this.state.size);
            });
        }
    }

    renderSongs(songs: ISong[]) {
        const { downloads = {}, loveSongs = [], cloudSongs = [], loadings = {} } = this.props;
        const clouds = toMap<ICloudSong>(cloudSongs, i => i.key);
        const loves = toMap<ISong>(loveSongs, i => `${i.kind}-${i.id}`);

        return <SearchSongs songs={songs}
                            downloads={downloads}
                            loves={loves}
                            loadings={loadings}
                            clouds={clouds}/>;
    }

    renderUsers(users: IUser[]) {
        return <SearchUsers musicians={users}/>;
    }

    renderPlays(plays: IPlay[]) {
        return <SearchPlays plays={plays}/>;
    }

    componentDidMount(): void {
        const { type, id } = this.props.match.params;
        this.props.actions.search.search(id, type, this.state.page, this.state.size);
    }

    nextPage() {
        const { type, id } = this.props.match.params;
        this.setState({ page: this.state.page + 1 }, () => {
            this.props.actions.search.search(id, type, this.state.page, this.state.size);
        });
    }

    render() {
        const { songs, users, plays } = this.props.search;
        const { type, id } = this.props.match.params;
        const { network = { nodata: false, loading: true } } = this.props;
        return <Layout id="main">
            <EndLoader target="main" onLoad={() => !network.nodata && this.nextPage()}>
                <Tabs animated={false}
                      activeKey={type}
                      style={{ margin: '0 -30px' }}
                      tabBarStyle={{ paddingLeft: 30, paddingRight: 30 }}
                      onChange={key => location.hash = `#/search/${key}/${id}`}>
                    <Tabs.TabPane tab="歌曲" key="song">
                        {this.renderSongs(songs)}
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="原创" key="yc">
                        {this.renderSongs(songs)}
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="翻唱" key="fc">
                        {this.renderSongs(songs)}
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="伴奏" key="bz">
                        {this.renderSongs(songs)}
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="歌单" key="play" style={{ padding: '0 30px' }}>
                        {this.renderPlays(plays)}
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="音乐人" key="user" style={{ padding: '0 30px' }}>
                        {this.renderUsers(users)}
                    </Tabs.TabPane>
                </Tabs>
                <div style={{ marginTop: ['song', 'yc', 'fc', 'bz'].includes(type) ? 40 : 0 }}>
                    <Loading loading={network.loading} nodata={network.nodata}/>
                </div>
            </EndLoader>
        </Layout>

    }
}
