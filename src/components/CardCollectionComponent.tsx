import { Grid, GridList, GridListTile, IconButton, Slide } from '@material-ui/core';
import { ArrowLeftSharp, ArrowRightSharp } from '@material-ui/icons';
import React from 'react';
import { ARKHAMDB_CARDS } from '../shared/urls';
import CardDetails from './CardComponent';

type CardState = {
    isLoading: boolean,
    isAnimating: boolean,
    checked: boolean,
    showInitialIndex: number,
    showLastIndex: number,
    newInitialIndex: number,
    newLastIndex: number,
    direction: 'left' | 'right' | 'up' | 'down',
    investigatorCollection: any
    cardCollection: any
}

const numberOfCardsPerPage = 6;

class CardCollection extends React.Component<{}, CardState> {
    state: CardState = {
        isLoading: true,
        isAnimating: false,
        checked: true,
        showInitialIndex: 0,
        showLastIndex: numberOfCardsPerPage - 1,
        newInitialIndex: 0,
        newLastIndex: numberOfCardsPerPage - 1,
        direction: 'right',
        investigatorCollection: {},
        cardCollection: {}
    };

    componentDidMount() {
        this.getCollectionFromUrl();
    }

    investigatorCollection(res: any) {
        const investigators = res.filter((card: any) => card.type_code === "investigator"
                                                        && card.pack_code !== "promo"
                                                        && card.imagesrc);
        let seenNames:any = {};                                                    
        const investigatorNoDup = investigators.filter((card: any) => {
            if (!(card.name in seenNames)) {
                seenNames[card.name] = true;
                return true;
            }
        });
        // this.saveData(investigatorNoDup);
        this.setState({ investigatorCollection: investigatorNoDup });
    }

    cardCollection(res: any) {
        const cards = res.filter((card: any) => (card.type_code === "asset"
                                                || card.type_code === "event"
                                                || card.type_code === "skill")
                                                && card.subtype_code !== "weakness"
                                                && card.subtype_code !== "basicweakness"
                                                && card.imagesrc);
        let seenNames:any = {};                                                    
        const cardCollection = cards.filter((card: any) => {
            if (!(card.name in seenNames)) {
                seenNames[card.name] = true;
                return true;
            }
        });
        this.setState({ cardCollection: cardCollection });
    }

    getCollectionFromUrl() {
        return fetch(ARKHAMDB_CARDS)
            .then((res) => res.json())
            .then((resJSON: any) => {
                this.investigatorCollection(resJSON);
                this.cardCollection(resJSON);
            })
            .catch(error => console.error(error))
            .finally(() => { 
                this.setState({ isLoading: false });
            });
    }

    handleChecked() {
        this.setState({ checked: !this.state.checked });
    }

    updateIndexes() {
        if (this.state.direction == 'left') this.setState({ direction: 'right'});
        else this.setState({ direction: 'left'});
        
        this.setState({
            showInitialIndex: this.state.newInitialIndex,
            showLastIndex: this.state.newLastIndex
        });
        this.handleChecked();
    }

    handleIndexes(amount: number) {
        if (this.state.isAnimating) return;

        let initial = this.state.showInitialIndex + amount;
        let last = this.state.showLastIndex + amount;
        
        if (initial < 0) {
            initial = 0;
            last = numberOfCardsPerPage - 1;
        }

        if (initial >= this.state.cardCollection.length) {
            initial = this.state.showInitialIndex;
            last = this.state.showLastIndex;
        }

        if (initial != this.state.showInitialIndex || last != this.state.showLastIndex) {
            this.setState({ direction: (amount < 0)? 'left':'right' });
            this.handleChecked();
            this.setState({ newInitialIndex: initial, newLastIndex: last });
        }
    }

    animationFinished() {
        this.setState({ isAnimating: false })
    }

    animationStarted() {
        this.setState({ isAnimating: true })
    }

    render() {
        if (!this.state.isLoading) {
            return (
                <Grid style={{justifyContent: 'center'}} container spacing={1}>
                    <Grid item xs={12} style={{alignContent:'flex-start'}}>
                        <IconButton color='secondary' size='medium' onClick={() => { this.handleIndexes(numberOfCardsPerPage) }}>
                            <ArrowLeftSharp></ArrowLeftSharp>
                        </IconButton>
                        <IconButton color='secondary' size='medium' onClick={() => { this.handleIndexes(-numberOfCardsPerPage) }}>
                            <ArrowRightSharp></ArrowRightSharp>
                        </IconButton>
                    </Grid>
                    <Slide direction={this.state.direction} in={this.state.checked} mountOnEnter unmountOnExit 
                        onExited={() => this.updateIndexes()} onEntered={() => this.animationFinished()} onExiting={() => this.animationStarted()}>
                        <GridList cellHeight='auto' cols={3}>
                        {
                            this.state.cardCollection.slice(this.state.showInitialIndex, this.state.showLastIndex + 1).map((card: any) => {
                                return (
                                        <GridListTile cols={1} key={card.name}>
                                            <CardDetails cardInfo={card}></CardDetails>
                                        </GridListTile>
                                );
                            })
                        }
                        </GridList>
                    </Slide>
                </Grid>
            );
        } else {
            return (
                <div></div>
            );
        }
    }
}

export default CardCollection;