import React from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment, GridColumn, GridRow } from 'semantic-ui-react';
import { TextArea, Input, Menu } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom';
import firebase from '../Firebase/firebase.js';
import RequestBox from '../components/RequestBox';

class MainPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeItem: 'home',
            redirect: null,
            description: "",
            requests: []
        };
        
    }

    componentDidMount = () => {
        let db = firebase.firestore();
        
        db.collection("swipe_requests").orderBy("time_posted", "desc")
        .onSnapshot((querySnapshot) => {
            let swipe_requests = [];
            
            querySnapshot.forEach((doc) => {
                swipe_requests.push(doc);
                
            });
            this.setState({requests: swipe_requests});
        });    
    }

    handleSubmission = () => {
        firebase.auth().signOut().then(() => {
            // Sign-out successful.
            this.setState({redirect: '/'});
        }).catch(function(error) {
            // An error happened.
            console.log("ERROR IN LOGOUT " + error);
        });
    }

    handleSwipeRequest = () => {
        let user = firebase.auth().currentUser;
        console.log(user);
        let db = firebase.firestore();
        db.collection("swipe_requests").add({
            description: this.state.description,
            display_name: user.displayName,
            time_posted: firebase.firestore.Timestamp.now(),
            uid: firebase.auth().currentUser.uid
        })
        .then((result) => {
            this.setState({description: ""});
        })
        .catch((error) => {
            console.log("ERROR " + error);
        });
    
    }

    handleDescriptionChange = (event) => {
        this.setState({description: event.target.value});
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })
    
    render() {

        if (this.state.redirect) {
            return <Redirect to={this.state.redirect}/>;
        }

        const { activeItem } = this.state

        return (
            <div>
                <Menu pointing>
                {/* <Menu.Item>
                    <Image src={require('../images/logo.png')}></Image>
                </Menu.Item> */}
                
                <Menu.Item
                    name='home'
                    active={activeItem === 'home'}
                    onClick={this.handleItemClick}
                />
                <Menu.Item
                    name='messages'
                    active={activeItem === 'messages'}
                    onClick={this.handleItemClick}
                />
                <Menu.Item
                    name='friends'
                    active={activeItem === 'friends'}
                    onClick={this.handleItemClick}
                />
                
                <Menu.Menu position='right'>
                    <Menu.Item>
                        <Form>
                            <Button color='blue' fluid size='small' type='button' onClick={this.handleSubmission}>
                                    Logout
                            </Button>
                        </Form>
                    </Menu.Item>
                </Menu.Menu>
                </Menu>

                <Grid columns={2} divided>
                    <Grid.Row>
                    <Grid.Column>
                           <Segment stacked>
                                <Message color='blue' align='center'>Welcome {firebase.auth().currentUser.displayName}</Message>
                           </Segment>
                           <Segment> 
                            <Form>
                                <Button color='blue' fluid size='small' type='button' onClick={this.handleSwipeRequest}>
                                        Request a Swipe
                                </Button>
                                <TextArea onChange={this.handleDescriptionChange}
                                    value={this.state.description} placeholder='Enter a description' />
                            </Form>
                            </Segment>
                            
                    </Grid.Column>
                    <Grid.Column>
                        <Segment style={{overflow: 'auto', maxHeight: 800}}>
                            <RequestBox uid={firebase.auth().currentUser.uid} swipe_requests={this.state.requests}/>
                        </Segment>
                    </Grid.Column>

                    </Grid.Row>
                    
                    
                </Grid>

                
            </div>
            
            
        )
    }
}

export default MainPage;
