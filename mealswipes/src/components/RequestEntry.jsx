import React from 'react';
import { List, Button, Form, Grid, Header, Image, Message, Segment, GridColumn, GridRow } from 'semantic-ui-react';
import { TextArea, Divider, Input, Menu } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom';
import firebase from '../Firebase/firebase.js';

class RequestEntry extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            display_status: 'NORMAL',
            text_content: '',
            provider_message: ''
        };
        
    }

    handleRemoveRequest = (event) => {
        const key = event.target.dataset.id;
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

    handleProvideRequest = () => {
        this.setState({display_status: 'SEND_AID'})
    }

    handleProviderMessageChange = (event) => {
        this.setState({provider_message: event.target.value});

    }
    normalGrid = (doc_id, display_name, dateTime, description, uid) => {
        return (<Grid columns={2} divided>
            <Grid.Row>
            <Grid.Column>
                
                <List.Content>
                    <List.Header as='a'>{<List.Icon name='github' size='large' verticalAlign='middle' />} {display_name}</List.Header>
                    
                    <List.Description as='a'>{dateTime}</List.Description>
                    <Segment style={{marginBottom: '5px'}}>
                        <List.Description as='a'>{description}</List.Description>
                    </Segment>
                    
                </List.Content>
            </Grid.Column>
            <Grid.Column>
                {(uid == this.props.current_uid) ? this.userRequests(doc_id) : this.otherRequests(doc_id)}
            </Grid.Column>
            </Grid.Row>
        </Grid>);
    }

    userRequests = (uid) => {
        return (<Form>
            <Button data-id={uid} color='blue' fluid size='small' type='button' onClick={this.handleRemoveRequest}>
                                    Remove Request
            </Button>
            <Button data-id={uid} color='teal' fluid size='small' type='button' onClick={this.handleEditRequest}>
                                    Edit Request
            </Button>
        </Form>);
    };

    otherRequests = (uid) => {
        return (<Button data-id={uid} color='yellow' fluid size='small' type='button' onClick={this.handleProvideRequest}>
                Send Aid
        </Button>);
    }

    sendAidGrid = (doc_id, display_name, dateTime, description, uid) => {
        return (<Grid columns={2} divided>
            <Grid.Row>
            <Grid.Column>
                
                <List.Content>
                    
                    <Segment style={{marginBottom: '5px'}}>
                        <Form>
                            <TextArea onChange={this.handleProviderMessageChange}
                                value={this.state.provider_message} placeholder='Enter a message to the requester' />
                        </Form>
                    </Segment>
                    
                </List.Content>
            </Grid.Column>
            
                <Grid.Column>
                <Form>
                    <Button data-id={uid} color='green' fluid size='small' type='button' onClick={() => this.handleConfirmAidRequest(doc_id, display_name, dateTime, description, uid)}>
                                        Send Message
                    </Button>
                    <Button data-id={uid} color='red' fluid size='small' type='button' onClick={this.handleCancelRequest}>
                                            Cancel
                    </Button>
                </Form>
                    
                </Grid.Column>
            
           
            </Grid.Row>
        </Grid>);
    }

    aidSentGrid = (doc_id, display_name, dateTime, description, uid) => {
        return (<Grid columns={2} divided>
            <Grid.Row>
            <Grid.Column>
                
                <List.Content>
                    <List.Header as='a'>{<List.Icon name='github' size='large' verticalAlign='middle' />} {display_name}</List.Header>
                    
                    <List.Description as='a'>{dateTime}</List.Description>
                    <Segment style={{marginBottom: '5px'}}>
                        <List.Description as='a'>{description}</List.Description>
                    </Segment>
                    
                </List.Content>
            </Grid.Column> 
            <Grid.Column>
                
                <List.Content>
                    
                    <Segment style={{marginBottom: '5px'}}>
                        Your message has been sent. Thank you for your contribution!
                    </Segment>
                    
                </List.Content>
            </Grid.Column>
            
              
            
           
            </Grid.Row>
        </Grid>);
    }

    handleConfirmAidRequest = (doc_id, display_name, dateTime, description, uid) => {
        
        console.log("IN HERE");
        const curr_id = firebase.auth().currentUser.uid;
        let db = firebase.firestore();
        db.collection("swipe_providers").doc(uid).collection("supporters").doc(curr_id).set({
            message: this.state.provider_message,
            requester_id: curr_id,
            time_posted: firebase.firestore.Timestamp.now(),
            
        })
        .then((result) => {
            this.setState({display_status: 'AID_SENT'});
        })
        .catch((error) => {
            console.log("FAILED: " + error);
        })
        
        //console.log("SENT");
    }

    handleCancelRequest = () => {
        this.setState({display_status: 'NORMAL'})
    }

    gridSelector = () => {
        let { display_status } = this.state;
        let { props } = this;
        if (display_status == 'NORMAL') {
            return this.normalGrid(props.doc_id, props.display_name, props.dateTime, props.description, props.uid);
        }
        else if (display_status == 'SEND_AID') {
            return this.sendAidGrid(props.doc_id, props.display_name, props.dateTime, props.description, props.uid);
        }
        else if (display_status == 'AID_SENT') {
            return this.aidSentGrid(props.doc_id, props.display_name, props.dateTime, props.description, props.uid);
        }
    }

    render() {
        
        let grid = this.gridSelector();
        return (
            grid
        )
    }
}

export default RequestEntry