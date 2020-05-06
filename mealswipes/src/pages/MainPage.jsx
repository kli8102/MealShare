import React from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment, GridColumn } from 'semantic-ui-react';
import { Input, Menu } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom';
import firebase from '../Firebase/firebase.js';

class MainPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeItem: 'home',
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

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })
    
    render() {

        if (this.state.redirect) {
            return <Redirect to={this.state.redirect}/>;
        }

        const { activeItem } = this.state

        return (
            <div>
                <Menu pointing>
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
                <Menu.Item position='right'>   
                <Form>
                    <Button color='blue' fluid size='large' type='button' onClick={this.handleSubmission}>
                            Logout
                    </Button>
                </Form>
                </Menu.Item>
                <Menu.Menu position='right'>
                    <Menu.Item>
                    <Input icon='search' placeholder='Search...' />
                    </Menu.Item>
                </Menu.Menu>
                </Menu>

                <Segment>
                    <Image src={require('../images/logo.png')} /> 
                </Segment>

                
            </div>
            
            
        )
    }
}

export default MainPage;
