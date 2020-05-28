import React from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment, Popup } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import firebase from '../Firebase/firebase.js';
import { Link } from 'react-router-dom';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            incorrectPassword: false,
            isOpen: false,
            redirect: null,
            alertValidateE: true, // Not yet used. Will be used to determine if there is validation error
        };
        
    }

    componentDidMount = () => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {  
                firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then((idToken) => {
                    // Send token to your backend via HTTPS
                    this.setState({redirect: '/account/' + user.uid});
                    // ...
                }).catch(function(error) {
                    // Handle error
                });       
                // this.setState({redirect: '/account/' + user.uid});    
            }
            return;
        });
    }

    handleOpen = () => {
        this.setState({ isOpen: false })
      }
    
    handleClose = () => {
        this.setState({ isOpen: true })
    }

    checkFormData = () => {
        let check = true;
        if (this.state.email.trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) === null) {
            this.setState({alertValidateE: true});
            check = false;
        }

        return check;
    }

    handleUserChange = (event) => {
        this.setState({email: event.target.value});
    }

    handlePasswordChange = (event) => {
        this.setState({password: event.target.value});
    }

    handleSubmission = (event) => {
        event.preventDefault();

        if (!this.checkFormData()) {
            console.log("EMAIL FORMAT INCORRECT");
            return;
        }

        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((result) => {
            
            if (!firebase.auth().currentUser.emailVerified) {
                firebase.auth().signOut();
                console.log("EMAIL NOT VERIFIED");
            }
            else {
                firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then((idToken) => {
                    // Send token to your backend via HTTPS
                    this.setState({redirect: '/account/' + firebase.auth().currentUser.uid});
                    // ...
                }).catch(function(error) {
                    // Handle error
                });       
                // this.setState({redirect: '/account/' + firebase.auth().currentUser.uid});
            }
        })
        .catch((error) => {
            // Handle Errors here.
            console.log("INVALID CREDENTIALS");
            this.setState({ 
                incorrectPassword: true,
                password : "", 
            });
            // ...
        });
    }   

    render() {

        // firebase.auth().onAuthStateChanged((user) => {
        //     if (user) {
        //         return <Redirect to={'/account/' + user.uid}/>;
        //     }
            
        // })

        if (this.state.redirect) {
            // Access the ID prop in the blurbs page component
            return <Redirect to={this.state.redirect}/>;
        }

        return (
            <div style={{ backgroundColor: '#e6f2ff' }}>
                <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as='h1' color='blue' textAlign='center'>
                        <Image src={require('../images/logo.png')} /> 
                        Share Meal Swipes!
                    </Header>
                    <Header as='h2' color='blue' textAlign='center'>
                        {/* <Image src={require('./images/logo_image.png')} /> Log-in to your account */}
                        Log into your account
                    </Header>
                    <Form size='large'>
                        <Segment stacked>
                        <Form.Input fluid icon='user' iconPosition='left' placeholder='Email' 
                            onChange={this.handleUserChange} value={this.state.email}/>
                        <Popup
                            //style={{ backgroundColor: '#be4b49' }}
                            trigger={
                                <Form.Input
                                    fluid
                                    icon='lock'
                                    iconPosition='left'
                                    placeholder='Password'
                                    type='password'
                                    onChange={this.handlePasswordChange}
                                    value={this.state.password}
                                />
                            }
                            content='The password you entered is incorrect.'
                            on='hover'
                            open={this.state.incorrectPassword && this.state.isOpen}
                            onClose={this.handleClose}
                            onOpen={this.handleOpen}
                            position='right center'
                        />
                        <Button color='blue' fluid size='large' type='button' onClick={this.handleSubmission}>
                            Log In
                        </Button>
                        </Segment>
                    </Form>
                    <Message>
                        Don't have an account? <Link to={'/register'}> Sign Up </Link>
                    </Message>
                    <Message>
                        <Link to={'/reset-password'}> Forgot Password? </Link>
                    </Message>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}

export default Login
