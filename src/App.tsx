import React from 'react';
import { Provider } from 'react-redux';
import './App.css';
import CardCollection from './components/CardCollectionComponent';
import { ConfigureStore } from './redux/configureStore';

const store = ConfigureStore();

function App() {
  return (
    <Provider store={store}>
        <div className="App">
            <div className="App-header">
                <CardCollection></CardCollection>
            </div>
        </div>
    </Provider>
  );
}

export default App;
