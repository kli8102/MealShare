import React from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';


class PasswordResetSuccessful extends React.Component {
    constructor(props) {
        super(props);
        this.state = {         
        };   
    }

    render() {
        return (
            <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as='h2' color='blue' textAlign='center'>
                        An email has been sent to reset your account password.
                    </Header>
                    
                    <Link color='red' to={'/'}> Sign In Here </Link>
                    
                </Grid.Column>
            </Grid>
        )
    }
}

export default PasswordResetSuccessful
