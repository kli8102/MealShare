import React from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment, GridColumn } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import firebase from '../Firebase/firebase.js';

class MainPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: null     
        };
        
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
    
    render() {

        if (this.state.redirect) {
            return <Redirect to={this.state.redirect}/>;
        }

        return (
            <Grid.Column style={{ maxWidth: 200 }}>
                <Form>
                    <Button color='blue' fluid size='large' type='button' onClick={this.handleSubmission}>
                            Logout
                    </Button>
                </Form>
            </Grid.Column>
        )
    }
}

export default MainPage;
