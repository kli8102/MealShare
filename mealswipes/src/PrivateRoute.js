import React from 'react';
import firebase from './Firebase/firebase.js';
import { Redirect } from 'react-router-dom';
import {
   Route,
 } from "react-router-dom";
 
const PrivateRoute = ({component: Component, ...rest}) => {
   return <Route {...rest} render={(props) => {
    console.log(rest.user);
    console.log(firebase)
    console.log(firebase.auth())
    console.log(firebase.auth().currentUser)
       if (firebase.auth().currentUser) {
           console.log("IN IF")
           return <Component {...props} />;
       }
       console.log("PAST IF");
       return <Redirect to={{
           pathname: '/',
           state: { from: props.location }
       }} />;
   }} />
 };
 
export default PrivateRoute;
