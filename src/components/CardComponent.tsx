import { ButtonBase, Card, Icon, IconButton, makeStyles } from '@material-ui/core';
import { BrightnessHigh, BrightnessLow } from '@material-ui/icons';
import React from 'react';
import { ARKHAMDB } from '../shared/urls';

type CardProps = {
    cardInfo: any,
    addCardToDeck: any,
    removeCardFromDeck: any
}

type CardState = {
    isLoading: boolean,
    cardInfo: any,
    cardInDeck: number
}

class CardDetails extends React.Component<CardProps, CardState> {
    state: CardState = {
        isLoading: true,
        cardInfo: {},
        cardInDeck: 0
    };

    componentDidMount() {
        this.setState({
            isLoading: true,
            cardInfo: this.props.cardInfo,
            cardInDeck: 0
        });
    }

    addToDeck() {
        const cardInDeck = this.state.cardInDeck + 1;
        if (cardInDeck <= this.state.cardInfo.deck_limit) {
            this.props.addCardToDeck(this.state.cardInfo.name, cardInDeck);
            this.setState({
                cardInDeck: cardInDeck 
            });
        } 
    }

    removeFromDeck() {
        const cardInDeck = this.state.cardInDeck - 1;
        if (cardInDeck < 0) return;
        this.props.removeCardFromDeck(this.state.cardInfo.name, -1);
        this.setState({
            cardInDeck: cardInDeck 
        });
    }

    render() {
        return (
            <Card
                style={{backgroundColor:'transparent'}}>
                <ButtonBase
                    focusRipple
                    key={this.state.cardInfo.name}
                    style={{
                        width: 250,
                        height: 400
                    }}
                    onClick={() => this.addToDeck() }
                >
                    <img
                        style={{height:"100%", maxWidth: 300, alignSelf: 'start'}}
                        src={ARKHAMDB + this.state.cardInfo.imagesrc}
                    ></img>
                </ButtonBase>
                <div style={{justifyContent: 'center'}}>
                    {
                        Array(this.state.cardInfo.deck_limit).fill(undefined).map((_, i) => {
                            if (i < this.state.cardInDeck) {
                                return (
                                    <IconButton key={this.state.cardInfo.name + i} onClick={() => this.removeFromDeck()}>
                                        <BrightnessHigh></BrightnessHigh>
                                    </IconButton>
                                )
                            } else {
                                return (
                                    <IconButton key={this.state.cardInfo.name + i} onClick={() => this.removeFromDeck()}>
                                        <BrightnessLow key={this.state.cardInfo.name + i}></BrightnessLow>
                                    </IconButton>
                                )
                            }
                        })
                    }
                </div>
            </Card>
        );
    }
}

export default CardDetails;