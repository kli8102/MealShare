import React from 'react';
import { List, Button, Form, Grid, Header, Image, Message, Segment, GridColumn, GridRow } from 'semantic-ui-react';
import { Divider, Input, Menu } from 'semantic-ui-react'
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
            });
            this.setState({requests: swipe_requests})
        });
    }

    handleRemoveRequest = (event) => {
        const key = event.target.id;
        let db = firebase.firestore();
        db.collection("swipe_requests").doc(key).delete()
        .then((result) => {
            this.forceUpdate();
        })
        .catch((error) => {
            console.log("FAILED TO DELETE: " + error);
        })
    }

    handleEditRequest = () => {

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
            const uid = request.uid;
            
            let item = (
                <List.Item key={request_data.id}>
                <Grid columns={2} divided>
                <Grid.Row>
                <Grid.Column>
                    
                    <List.Content>
                        <List.Header as='a'>{<List.Icon name='github' size='large' verticalAlign='middle' />} {display_name}</List.Header>
                        
                        <List.Description as='a'>{dateTime}</List.Description>
                        <Divider />
                        <List.Description as='a'>{description}</List.Description>
                        
                    </List.Content>
                </Grid.Column>
                <Grid.Column>
                    {uid == this.props.uid ? (<Form>
                        <Button id={request_data.id} color='blue' fluid size='small' type='button' onClick={this.handleRemoveRequest}>
                                                Remove Request
                        </Button>
                        <Button color='teal' fluid size='small' type='button' onClick={this.handleEditRequest}>
                                                Edit Request
                        </Button>
                    </Form>) : <div> </div>}
                </Grid.Column>
                </Grid.Row>
                </Grid>
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