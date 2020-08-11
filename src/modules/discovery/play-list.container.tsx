import * as React from 'react';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { IState } from "../../reducers";
import { bindActionCreators, Dispatch } from "redux";
import { PlayAction } from "../../actions";
import { IPlay } from "../../interfaces";
import { actions } from "../../helpers";
import { Card, ImgCard } from "../../components";

export interface IPlayListProps {
    actions?: {
        play: typeof PlayAction;
    };
    playlist?: IPlay[];
}

interface IPlayListState {
}

@connect(
    (state: IState) => ({
        playlist: state.discoveryPlays,
    }),
    (dispatch: Dispatch) => ({
        actions: {
            play: bindActionCreators(actions(PlayAction), dispatch)
        }
    })
)
export class PlayList extends React.Component<IPlayListProps, IPlayListState> {
    componentDidMount(): void {
        this.props.actions.play.getRecommendPlayLists();
    }

    render() {
        const { playlist } = this.props;
        if (playlist.length === 0) {
            return '';
        }
        return <Card title={<Link to="/plays">
            推荐歌单 <span style={{ position: 'relative', top: -1 }}>&gt;</span>
        </Link>}>
            <ImgCard>
                {playlist.map((play: IPlay) =>
                    <ImgCard.Item
                        height={128}
                        key={play.id}
                        title={play.title}
                        extra={play.playCount}
                        img={play.picture}
                        onClick={() => location.hash = `#/plays/${play.id}`}
                    />
                )}
            </ImgCard>
        </Card>
    }
}
