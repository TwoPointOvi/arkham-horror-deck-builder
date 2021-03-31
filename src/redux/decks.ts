import * as ActionTypes from './ActionTypes';

export const DeckCollection = (state: any = {
        cards: []
    }, action: any) => {
    
    switch (action.type) {
        case ActionTypes.ADD_CARD_DECK:
            const card = action.payload;
            const existingCardIndex = state.cards.map((item:any) => {
                return item.cardId;
            }).indexOf(action.payload.cardId);
            
            if (existingCardIndex !== -1) {
                state.cards[existingCardIndex].amount = action.payload.amount;
                return state;
            } else {
                return {...state, cards: state.cards.concat(card)};
            }


        case ActionTypes.REMOVE_CARD_DECK:
            const index = state.cards.map((item:any) => {
                return item.cardId;
            }).indexOf(action.payload.cardId);
            
            state.cards[index].amount -= action.payload.amount;
            if (state.cards[index].amount < 1) {
                state.cards.splice(index, 1);
            }

            return state;
        default:
            return state;
    }
};