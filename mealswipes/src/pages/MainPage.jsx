import React from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment, GridColumn, GridRow } from 'semantic-ui-react';
import { TextArea, Input, Menu } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom';
import firebase from '../Firebase/firebase.js';
import RequestBox from '../components/RequestBox';
import MyResponses from '../components/MyResponses';

class MainPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeItem: 'home',
            redirect: null,
            description: "",
            requests: [],
            responses: []
        };
        
    }

    componentDidMount = () => {
        let db = firebase.firestore();
        let currentUser = firebase.auth().currentUser.uid;
        db.collection("swipe_requests").orderBy("time_posted", "desc")
        .onSnapshot((querySnapshot) => {
            let swipe_requests = [];
            
            querySnapshot.forEach((doc) => {

                swipe_requests.push(doc);
                
            });
            //this.setState({requests: swipe_requests});
            db.collection("swipe_providers").doc(currentUser).collection("supporters").get()
            .then(async (querySnapshot) => {
                // if (querySnapshot.empty) {
                //     return;
                // }
                
               
                let swipe_responses = [];
                
                let processProviderDocs = async (doc) => {
                    
                    // console.log("DOC_ID: " + doc.data().doc_id);
                    
                    await db.collection('swipe_requests').doc(doc.data().doc_id).get()
                    .then((response) => {
                        
                        let add_data = {
                            swipes: response,
                            supporter: doc.data().supporter_id,
                            supporter_time_posted: doc.data().time_posted, 
                            supporter_name: doc.data().supporter_name,
                            message: doc.data().message,
                            doc_id: doc.data().doc_id
                        };
                        swipe_responses.push(add_data);
                        
                        
                        
                    })
                    .catch((error) => {
                        
                        console.log("Error fetching data: " + error);
                    }) 
                    
                    
                        
                    
                }
                console.log(querySnapshot.docs.length)
                for (let i = 0; i < querySnapshot.docs.length; i++) {
                    await processProviderDocs(querySnapshot.docs[i]);
                }
                this.setState({requests: swipe_requests, responses: swipe_responses});


                // querySnapshot.forEach(async (doc) => {
                    
                //     // console.log("DOC_ID: " + doc.data().doc_id);
                    
                //     await db.collection('swipe_requests').doc(doc.data().doc_id).get()
                //     .then((response) => {
                        
                //         let add_data = {
                //             swipes: response,
                //             supporter: doc.data().supporter_id,
                //             supporter_time_posted: doc.data().time_posted
                //         };
                //         swipe_responses.push(add_data);
                //         console.log("IN QUERY: " + swipe_responses.length)
                //         counter++;
                //         if (counter == querySnapshot.length) {
                //             this.setState({requests: swipe_requests, responses: swipe_responses});
                //         }
                        
                        
                //     })
                //     .catch((error) => {
                        
                //         console.log("Error fetching data: " + error);
                //     }) 
                    
                    
                        
                    
                // })
                

                
                
                
                
                
            }, 
            error => {
                console.log(error)
            })
            
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

                            <Segment style={{overflow: 'auto', maxHeight: 550}}>
                                <MyResponses uid={firebase.auth().currentUser.uid} swipe_responses={this.state.responses}/>
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
