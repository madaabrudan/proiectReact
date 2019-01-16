import React from 'react';
import {createStackNavigator,createAppContainer} from 'react-navigation';
import Login from './Login.js';
import ListPage from './ListPage.js';
import AddPage from './AddPage.js';


const rootStack = createStackNavigator({

  LoginScreen:Login,
  Listpage:ListPage,
  AddToListpage:AddPage,


});

const App = createAppContainer(rootStack);

export default App;
