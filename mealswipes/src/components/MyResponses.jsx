import React from 'react';
import { List, Button, Form, Grid, Header, Image, Message, Segment, GridColumn, GridRow } from 'semantic-ui-react';
import { TextArea, Divider, Input, Menu } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom';
import RequestEntry from './RequestEntry';
import firebase from '../Firebase/firebase.js';
import ResponseEntry from './ResponseEntry';


class MyResponses extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            
        };
        
    }

    

    initializeBox = () => {
        console.log("RES: " + Object.getOwnPropertyNames(this.props));
        console.log("swipe_responses: " + this.props.swipe_responses);
        let swipe_responses = this.props.swipe_responses.map((request_data) => {
            let request = request_data.swipes.data();
            const display_name = request.display_name;    
            const date_posted = request.time_posted.toDate();
            const dateTime = date_posted.toString()
            const description = request.description;
            const uid = request.uid;

            console.log("HEY " + uid);

            let item = (
                <List.Item key={request_data.swipes.id}>
                    {/* {display_state == 'NORMAL' ? 
                    (this.normalGrid(request_data.id, display_name, dateTime, description, uid)) : 
                    (this.sendAidGrid(request_data.id, display_name, dateTime, description, uid))} */
                    }
                    <ResponseEntry supporter={request_data.supporter} supporter_ts={request_data.supporter_time_posted.toDate().toString()} doc_id={request_data.doc_id} display_name={display_name} date_posted={date_posted}
                    dateTime={dateTime} description={description} uid={uid} current_uid={this.props.uid} supporter_name={request_data.supporter_name} message={request_data.message}/>
                </List.Item>   
            );
            return item;
        });
        
        return swipe_responses;
    }

    render() {
        
        let swipe_responses = this.initializeBox();
        
        return (
            <div>
                <Header as='h2' content='Your Providers' textAlign='center' />
                <List divided relaxed>
                    {swipe_responses}
                </List>
            </div>
        )
    }
}

export default MyResponses;