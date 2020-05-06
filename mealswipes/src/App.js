import React from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './pages/Login.jsx';
import MainPage from './pages/MainPage.jsx';
import SignUp from './pages/SignUp';
import AccountCreated from './pages/AccountCreated';
import ResetPassword from './pages/ResetPassword';
import PasswordResetSuccess from './pages/PasswordResetSuccessful';
import PrivateRoute from './PrivateRoute.js';
import {
  BrowserRouter,
  Route,
  Switch,
} from "react-router-dom";



function App() {
  return (
    <BrowserRouter>
    <Switch>
      <PrivateRoute exact path="/account/:id" component={MainPage}/>
      <Route exact path="/register" component={SignUp}/>
      <Route exact path="/account-created" component={AccountCreated}/>
      <Route exact path="/reset-password" component={ResetPassword}/>
      <Route exact path="/reset-password-success" component={PasswordResetSuccess}/>
      <Route exact path="/" component={Login}/>
      
    </Switch>
  </BrowserRouter>
  );
}

export default App;
