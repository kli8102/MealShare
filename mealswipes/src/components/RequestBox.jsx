import React from 'react';
import { List, Button, Form, Grid, Header, Image, Message, Segment, GridColumn, GridRow } from 'semantic-ui-react';
import { Input, Menu } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom';
import firebase from '../Firebase/firebase.js';


class RequestBox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            requests: []
        };
        
    }

    componentDidMount = () => {
        let db = firebase.firestore();
        db.collection("swipe_requests")
        .onSnapshot((querySnapshot) => {
            let swipe_requests = [];
            console.log(querySnapshot)
            querySnapshot.forEach((doc) => {
                swipe_requests.push(doc);
            
                console.log(doc.data())
            });
            this.setState({requests: swipe_requests})
        });
    }

    
    
    render() {

        let swipe_requests = this.state.requests.map((request_data) => {
            let request = request_data.data();

            const display_name = request.display_name;
           
            const date_posted = request.time_posted.toDate();

            var date = date_posted.getFullYear()+'-'+(date_posted.getMonth()+1)+'-'+date_posted.getDate();
            var time = date_posted.getHours() + ":" + date_posted.getMinutes() + ":" + date_posted.getSeconds();
            var dateTime = date+' '+time;
            const description = request.description;
            
            let item = (
                
                <List.Item key={request_data.id}>
                <List.Icon name='github' size='large' verticalAlign='middle' />
                <List.Content>
                <List.Header as='a'>{display_name}</List.Header>
                    <List.Description as='a'>{dateTime}</List.Description>
                    <List.Description as='a'>{description}</List.Description>
                </List.Content>
                </List.Item>
                
            );
            return item;
        });

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

export default RequestBox;