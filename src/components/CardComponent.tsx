import { ButtonBase, Card, CardActionArea, CardMedia, makeStyles } from '@material-ui/core';
import React from 'react';
import { ARKHAMDB } from '../shared/urls';

type CardProps = {
    cardInfo: any
}

type CardState = {
    isLoading: boolean,
    cardInfo: any
}

class CardDetails extends React.Component<CardProps, CardState> {
    state: CardState = {
        isLoading: true,
        cardInfo: {}
    };

    render() {
        return (
            <Card
                style={{backgroundColor:'transparent'}}>
                {/* <CardActionArea> */}
                <ButtonBase
                    focusRipple
                    key={this.props.cardInfo.name}
                    style={{
                        width: 300,
                        height: 480
                    }}
                >
                    <img
                        style={{height:"90%", maxWidth: 300, alignSelf: 'start'}}
                        src={ARKHAMDB + this.props.cardInfo.imagesrc}
                    ></img>

                </ButtonBase>
            </Card>
        );
    }
}

export default CardDetails;