import * as ActionTypes from './ActionTypes';

export const addCardToDeck = (cardId: any, amount: number) => ({
    type: ActionTypes.ADD_CARD_DECK,
    payload: {
        cardId,
        amount
    }
});

export const removeCardFromDeck = (cardId: any, amount: number) => ({
    type: ActionTypes.REMOVE_CARD_DECK,
    payload: {
        cardId,
        amount
    }
});