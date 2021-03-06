import React from 'react';
import { List, Button, Form, Grid, Header, Image, Message, Segment, GridColumn, GridRow } from 'semantic-ui-react';
import { TextArea, Divider, Input, Menu } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom';
import firebase from '../Firebase/firebase.js';

class ResponseEntry extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            display_status: 'NORMAL',
            text_content: '',
            provider_message: '',
            request_id: this.props.doc_id

        };
        
    }

    handleResolveRequest = (event) => {
        const key = event.target.dataset.id;
        console.log(this.props.doc_id)
        let db = firebase.firestore();

        db.collection("swipe_requests").doc(this.props.doc_id).delete()
        .then((result) => {
            this.forceUpdate();
            
        })
        .catch((error) => {
            console.log("FAILED TO DELETE: " + error);
        })

        db.collection("swipe_providers").doc(this.props.uid).collection("supporters").doc(this.props.supporter).delete()
            .then((result) => {
                
                db.collection("swipe_providers").doc(this.props.supporter).collection("supportees").doc(this.props.uid).delete()
                .then((result) => {
                    this.forceUpdate();
                })
                .catch((error) => {
                    console.log("FAILED TO DELETE: " + error);
                })
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
                    <List.Header as='a'>{<List.Icon name='github' size='large' verticalAlign='middle' />} {this.props.supporter_name}</List.Header>
                    
                    <List.Description as='a'>{this.props.supporter_ts}</List.Description>
                    <Segment style={{marginBottom: '5px'}}>
                        <List.Description as='a'>{this.props.message}</List.Description>
                    </Segment>
                    
                </List.Content>
            </Grid.Column>
            <Grid.Column>
                {this.resolveRequests(doc_id)}
            </Grid.Column>
            </Grid.Row>
        </Grid>);
    }

    resolveRequests = (doc_id) => {
        return (<Form>
            <Button data-id={doc_id} color='pink' fluid size='small' type='button' onClick={this.handleResolveRequest}>
                                    Resolve Request
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
        const ts = firebase.firestore.Timestamp.now();
        db.collection("swipe_providers").doc(uid).collection("supporters").doc(curr_id).set({
            doc_id: this.state.request_id,
            supporter_id: curr_id,
            time_posted: ts,
            
        })
        .then((result) => {


            db.collection("swipe_providers").doc(curr_id).collection("supportees").doc(uid).set({
                doc_id: this.state.request_id,
                supportee_id: curr_id,
                time_posted: ts,
            })
            .then((result) => {
                this.setState({display_status: 'AID_SENT'});
            })
            .catch((error) => {
                console.log("FAILED: " + error);
            })
            
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

export default ResponseEntry