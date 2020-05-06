import React from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import firebase from '../Firebase/firebase.js';
import { Link } from 'react-router-dom';

class ResetPassword extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
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

    
    handleSubmission = (event) => {
        event.preventDefault();

        if (!this.checkFormData()) {
            console.log("EMAIL FORMAT INCORRECT");
            return;
        }

       
        firebase.auth().sendPasswordResetEmail(this.state.email).then(() => {
            // Email sent.
            this.setState({redirect: '/reset-password-success'});
        }).catch(function(error) {
            // An error happened.
            console.log("EMAIL FAILED TO BE SENT: " + error)
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
                    Reset Your Password
                </Header>
                <Form size='large'>
                    <Segment stacked>
                    <Form.Input fluid icon='user' iconPosition='left' placeholder='Email' 
                        onChange={this.handleUserChange} value={this.state.email}/>

                    <Button color='blue' fluid size='large' type='button' onClick={this.handleSubmission}>
                        Reset Password
                    </Button>
                    </Segment>
                </Form>
        
                </Grid.Column>
            </Grid>
            </div>
        )
    }
}

export default ResetPassword
