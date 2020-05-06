import React from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import firebase from '../Firebase/firebase.js';
import { Link } from 'react-router-dom';

class SignUp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            confirmPassword: "",
            redirect: null,
            alertValidateE: true, // Not yet used. Will be used to determine if there is validation error
        };
        
    }

    // componentDidMount = () => {
    //     firebase.auth().onAuthStateChanged((user) => {
    //         if (user) {
    //             this.setState({redirect: '/account/' + user.uid});
    //         }
    //         return;
    //     });
    // }

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
            return;
        }

        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((result) => {
            
            let user = firebase.auth().currentUser;

            user.sendEmailVerification().then(function() {
                // Email sent.
                firebase.auth().signOut();
                
            }).catch(function(error) {
                // An error happened.
                console.log("AN ERROR OCCURED IN SENDING EMAIL VERIFICATION");
            });
        })
        .then((result) => {
            this.setState({redirect: '/account-created'});
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
                        icon='lock'
                        iconPosition='left'
                        placeholder='Password'
                        type='password'
                        onChange={this.handlePasswordChange}
                        value={this.state.password}
                    />
                    <Form.Input
                        fluid
                        icon='lock'
                        iconPosition='left'
                        placeholder='Confirm Password'
                        type='password'
                        onChange={this.handleConfirmPasswordChange}
                        value={this.state.confirmPassword}
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
