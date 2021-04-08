import React from 'react';
import { Provider } from 'react-redux';
import './App.css';
import DeckBuildingComponent from './components/DeckBuildingComponent';
import { ConfigureStore } from './redux/configureStore';

const store = ConfigureStore();

function App() {
  return (
    <Provider store={store}>
        <div className="App">
            <div className="App-header">
                <DeckBuildingComponent></DeckBuildingComponent>
            </div>
        </div>
    </Provider>
  );
}

export default App;
