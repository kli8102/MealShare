import React from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment, Popup } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import firebase from '../Firebase/firebase.js';
import { Link } from 'react-router-dom';

class SignUp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            first_name: "",
            last_name: "",
            password: "",
            confirmPassword: "",
            incorrectPassword: false,
            isOpen: false,
            redirect: null,
            alertValidateE: true, // Not yet used. Will be used to determine if there is validation error
        };
        
    }

    componentWillUnmount = () => {

    }
    // componentDidMount = () => {
    //     firebase.auth().onAuthStateChanged((user) => {
    //         if (user) {
    //             this.setState({redirect: '/account/' + user.uid});
    //         }
    //         return;
    //     });
    // }

    handleOpen = () => {
        this.setState({ isOpen: false })
      }
    
    handleClose = () => {
        this.setState({ isOpen: true })
    }

    checkFormData = () => {
        // Will implement in future if checks become necessary
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

    handleFirstNameChange = (event) => {
        this.setState({first_name: event.target.value});
    }

    handleLastNameChange = (event) => {
        this.setState({last_name: event.target.value});
    }

    handlePasswordChange = (event) => {
        this.setState({password: event.target.value});
    }

    handleConfirmPasswordChange = (event) => {
        this.setState({confirmPassword: event.target.value});
    }

    handleSubmission = (event) => {
        event.preventDefault();

        if (!this.checkFormData()) {
            console.log("EMAIL FORMAT INCORRECT");
            return;
        }

        if (this.state.password !== this.state.confirmPassword) {
            console.log("PASSWORDS DON'T MATCH");
            this.setState({ 
                incorrectPassword: true,
                password : "", 
                confirmPassword : "",
            });
            return;
        }

        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((result) => {
            
            let user = firebase.auth().currentUser;
            result.user.updateProfile({
                displayName: this.state.first_name + " " + this.state.last_name
            })

            user.sendEmailVerification().then(function() {
                // Email sent.
                firebase.auth().signOut();
                
            })
            .then((result) => {
                let db = firebase.firestore();
                db.collection('user_information').doc(user.uid).set({
                    email: this.state.email,
                    first_name: this.state.first_name,
                    last_name: this.state.last_name
                })
                .then((result) => {
                    this.setState({redirect: '/account-created'});
                    return;
                })
                .catch(function(error) {
                    // An error happened.
                    console.log("AN ERROR OCCURED IN DATABASE STORE");
                    return;
                });
            })
            .catch(function(error) {
                // An error happened.
                console.log("AN ERROR OCCURED IN SENDING EMAIL VERIFICATION");
                return;
            });
        })
        .catch(function(error) {
            // Handle Errors here.
            console.log("REGISTRATION FAILED " + error);
            return
            // ...
        });
        
    }   

    render() {

        

        if (this.state.redirect) {
            // Access the ID prop in the blurbs page component
            return <Redirect to={this.state.redirect}/>;
        }

        return (
            <div style={{ backgroundColor: '#e6f2ff' }}>
            <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                <Header as='h2' color='blue' textAlign='center'>
                    Register Your Account
                </Header>
                <Form size='large'>
                    <Segment stacked>
                    <Form.Input fluid icon='user' iconPosition='left' placeholder='Email' 
                        onChange={this.handleUserChange} value={this.state.email}/>
                    <Form.Input
                        fluid
                        icon='user'
                        iconPosition='left'
                        placeholder='First Name'
                        onChange={this.handleFirstNameChange}
                        value={this.state.first_name}
                    />
                    <Form.Input
                        fluid
                        icon='user'
                        iconPosition='left'
                        placeholder='Last Name'
                        onChange={this.handleLastNameChange}
                        value={this.state.last_name}
                    />
                    <Form.Input
                        fluid
                        icon='lock'
                        iconPosition='left'
                        placeholder='Password'
                        type='password'
                        onChange={this.handlePasswordChange}
                        value={this.state.password}
                    />
                    <Popup 
                        trigger={
                            <Form.Input
                                fluid
                                icon='lock'
                                iconPosition='left'
                                placeholder='Confirm Password'
                                type='password'
                                onChange={this.handleConfirmPasswordChange}
                                value={this.state.confirmPassword}
                            />
                        }
                        content='Passwords do not match.'
                        on='hover'
                        open={this.state.incorrectPassword && this.state.isOpen}
                        onClose={this.handleClose}
                        onOpen={this.handleOpen}
                        position='right center'
                    />
                    

                    <Button color='blue' fluid size='large' type='button' onClick={this.handleSubmission}>
                        Register
                    </Button>
                    </Segment>
                </Form>
                <Message>
                    Have an account already? <Link to={'/'}> Sign In Here </Link>
                </Message>
                </Grid.Column>
            </Grid>
            </div>
        )
    }
}

export default SignUp
