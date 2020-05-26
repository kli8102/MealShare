import React from 'react';
import firebase from './Firebase/firebase.js';
import { Redirect } from 'react-router-dom';
import {
   Route,
 } from "react-router-dom";
 
const PrivateRoute = ({component: Component, ...rest}) => {
   return <Route {...rest} render={(props) => {
       if (firebase.auth().currentUser) {
           return <Component {...props} />;
       }
      
       return <Redirect to={{
           pathname: '/',
           state: { from: props.location }
       }} />;
   }} />
 };
 
export default PrivateRoute;
