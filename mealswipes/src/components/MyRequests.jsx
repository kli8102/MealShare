import React from 'react';
import { List, Button, Form, Grid, Header, Image, Message, Segment, GridColumn, GridRow } from 'semantic-ui-react';
import { TextArea, Divider, Input, Menu } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom';
import RequestEntry from './RequestEntry';
import firebase from '../Firebase/firebase.js';


class MyRequests extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };
        
    }

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
                <Header as='h2' content='Swipe Requests' />
                <List divided relaxed>
                    {swipe_requests}
                </List>
            </div>
        )
    }
}

export default MyRequests;