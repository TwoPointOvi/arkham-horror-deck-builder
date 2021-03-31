import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import logger from 'redux-logger';
import { DeckCollection } from "./decks";

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            deckCollection: DeckCollection
        }),
        applyMiddleware(thunk, logger)
    );

    return store;
}