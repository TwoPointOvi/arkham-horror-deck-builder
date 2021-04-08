import { CircularProgress, Grid, IconButton, Slide } from '@material-ui/core';
import { ArrowLeftSharp, ArrowRightSharp } from '@material-ui/icons';
import React from 'react';
import { connect } from 'react-redux';
import { addCardToDeck, removeCardFromDeck } from '../redux/ActionCreators';
import { ARKHAMDB_CARDS } from '../shared/urls';
import CardCollectionFilter from './CardCollectionFilter';
import CardDetails from './CardComponent';

const numberOfCardsPerPage = 6;

type CardState = {
    isLoading: boolean,
    isAnimating: boolean,
    checked: boolean,
    showInitialIndex: number,
    showLastIndex: number,
    newInitialIndex: number,
    newLastIndex: number,
    direction: 'left' | 'right' | 'up' | 'down',
    cardCollection: any,
    filteredCardCollection: any
}

type CardCollectionProps = {
    deckCollection: any,
    addCardToDeck: any,
    removeCardFromDeck: any,
    cardCollection: any,
    filteredCardCollection: any
}

const mapStateToProps = (state: any) => {
    return {
        deckCollection: state.deckCollection
    };
}

const mapDispatchToProps = (dispatch: any) => ({
    addCardToDeck: (cardId: any, amount: number) => dispatch(addCardToDeck(cardId, amount)),
    removeCardFromDeck: (cardId: any, amount: number) => dispatch(removeCardFromDeck(cardId, amount))
});

class CardCollection extends React.Component<CardCollectionProps, CardState> {
    state: CardState = {
        isLoading: true,
        isAnimating: false,
        checked: true,
        showInitialIndex: 0,
        showLastIndex: numberOfCardsPerPage - 1,
        newInitialIndex: 0,
        newLastIndex: numberOfCardsPerPage - 1,
        direction: 'right',
        cardCollection: {},
        filteredCardCollection: {}
    };

    componentDidMount() {
        this.setState({
            cardCollection: this.props.cardCollection,
            filteredCardCollection: this.props.filteredCardCollection,
            isLoading: false
        });
    }

    handleChecked() {
        this.setState({ checked: !this.state.checked });
    }

    updateIndexes() {
        if (this.state.direction === 'left') this.setState({ direction: 'right'});
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

        if (initial >= this.state.filteredCardCollection.length) {
            initial = this.state.showInitialIndex;
            last = this.state.showLastIndex;
        }

        if (initial !== this.state.showInitialIndex || last !== this.state.showLastIndex) {
            this.setState({ direction: (amount < 0)? 'left':'right' });
            this.handleChecked();
            this.setState({ newInitialIndex: initial, newLastIndex: last });
        }
    }

    filterDeckCollection(type: string) {
        if (type !== 'all') {
            const filteredCollection = this.state.cardCollection.filter((card: any) => {
                return card.faction_code === type 
            });
            
            this.setState({
                filteredCardCollection: filteredCollection,
                showInitialIndex: 0,
                showLastIndex: numberOfCardsPerPage - 1,
                newInitialIndex: 0,
                newLastIndex: numberOfCardsPerPage - 1,
                direction: 'right',
            });
        } else {
            this.setState({
                filteredCardCollection: this.state.cardCollection,
                showInitialIndex: 0,
                showLastIndex: numberOfCardsPerPage - 1,
                newInitialIndex: 0,
                newLastIndex: numberOfCardsPerPage - 1,
                direction: 'right',
            });
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
                <Grid container spacing={1}>
                    <Grid item xs={12} style={{alignContent:'flex-start'}}>
                        <CardCollectionFilter filterFunction={(type: string) => this.filterDeckCollection(type)}></CardCollectionFilter>
                    </Grid>
                    <Grid item xs={12} style={{alignContent:'flex-start'}}>
                        <IconButton color='secondary' size='medium' onClick={() => { this.handleIndexes(numberOfCardsPerPage) }}>
                            <ArrowLeftSharp></ArrowLeftSharp>
                        </IconButton>
                        <IconButton color='secondary' size='medium' onClick={() => { this.handleIndexes(-numberOfCardsPerPage) }}>
                            <ArrowRightSharp></ArrowRightSharp>
                        </IconButton>
                    </Grid>
                    <Grid container item xs={12}>
                        <Slide direction={this.state.direction} in={this.state.checked} mountOnEnter unmountOnExit 
                            onExited={() => this.updateIndexes()} onEntered={() => this.animationFinished()} onExiting={() => this.animationStarted()}>
                            <Grid container item spacing={2}>
                            {
                                this.state.filteredCardCollection.slice(this.state.showInitialIndex, this.state.showLastIndex + 1).map((card: any) => {
                                    return (
                                            <Grid item xs={12} sm={6} md={4} key={card.name}>
                                                <CardDetails cardInDeck={this.props.deckCollection.cards.filter((cardInDeck: any) => cardInDeck.cardId === card.name)[0]?.amount || 0} 
                                                    cardInfo={card} addCardToDeck={this.props.addCardToDeck} removeCardFromDeck={this.props.removeCardFromDeck}></CardDetails>
                                            </Grid>
                                    );
                                })
                            }
                            </Grid>
                        </Slide>
                    </Grid>
                </Grid>
            );
        } else {
            return (
                <CircularProgress></CircularProgress>
            );
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardCollection);