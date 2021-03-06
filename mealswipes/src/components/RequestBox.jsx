import React from 'react';
import { List, Button, Form, Grid, Header, Image, Message, Segment, GridColumn, GridRow } from 'semantic-ui-react';
import { TextArea, Divider, Input, Menu } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom';
import RequestEntry from './RequestEntry';
import firebase from '../Firebase/firebase.js';


class RequestBox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };
        
    }

    // componentDidMount = () => {
    //     let db = firebase.firestore();
        
    //     db.collection("swipe_requests").orderBy("time_posted", "desc")
    //     .onSnapshot((querySnapshot) => {
    //         let swipe_requests = [];
            
    //         querySnapshot.forEach((doc) => {
    //             swipe_requests.push(doc);
                
    //         });
    //         this.setState({requests: swipe_requests});
    //     });    
    // }
    

    initializeBox = () => {
        
        let swipe_requests = this.props.swipe_requests.map((request_data) => {
            let request = request_data.data();
            const display_name = request.display_name;    
            const date_posted = request.time_posted.toDate();
            const dateTime = date_posted.toString()
            const description = request.description;
            const uid = request.uid;
           

    

            let item = (
                <List.Item key={request_data.id}>
                    {/* {display_state == 'NORMAL' ? 
                    (this.normalGrid(request_data.id, display_name, dateTime, description, uid)) : 
                    (this.sendAidGrid(request_data.id, display_name, dateTime, description, uid))} */
                    }
                    <RequestEntry doc_id={request_data.id} display_name={display_name} date_posted={date_posted}
                    dateTime={dateTime} description={description} uid={uid} current_uid={this.props.uid}/>
                </List.Item>   
            );
            return item;
        });
        
        return swipe_requests;
    }

    render() {
        
        let swipe_requests = this.initializeBox();
        
        return (
            <div>
                <Header as='h2' content='Swipe Requests' textAlign='center'/>
                <List divided relaxed>
                    {swipe_requests}
                </List>
            </div>
        )
    }
}

export default RequestBox;