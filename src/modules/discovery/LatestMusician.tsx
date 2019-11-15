import * as React from 'react';
import { Card } from "../../components/Card";
import { connect } from 'react-redux';
import { ImgCard } from "../../components/ImgCard";
import { IState } from "../../reducers";
import { bindActionCreators, Dispatch } from "redux";
import { actions } from "../../utils/ActionUtil";
import { UserAction } from "../../actions/UserAction";
import * as defaultUserImage from '../../assets/i5sing.png';

export interface ILatestMusicianProps {
    actions?: {
        user: typeof UserAction;
    };
    musicians?: { id: string; name: string; image: string; }[];
}

interface ILatestMusicianState {
}

@connect(
    (state: IState) => ({
        musicians: state.discoveryMusicians,
    }),
    (dispatch: Dispatch) => ({
        actions: {
            user: bindActionCreators(actions(UserAction), dispatch)
        }
    })
)
export class LatestMusician extends React.Component<ILatestMusicianProps, ILatestMusicianState> {
    componentDidMount(): void {
        this.props.actions.user.getLatestMusician();
    }

    render() {
        const { musicians } = this.props;
        if (musicians.length === 0) {
            return '';
        }
        if (musicians.length > 5) {
            musicians.pop();
        }
        return <Card title={"新入驻音乐人"} style={{ marginTop: 40 }}>
            <ImgCard>
                {musicians.map((musician) =>
                    <ImgCard.Item
                        height={128}
                        key={musician.id}
                        title={musician.name}
                        img={musician.image.includes('http') ? musician.image : defaultUserImage}
                        onClick={() => location.hash = `#/musicians/${musician.id}`}
                    />
                )}
            </ImgCard>
        </Card>
    }
}
