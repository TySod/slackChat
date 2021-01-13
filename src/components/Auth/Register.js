import React, { Component } from "react";
import firebase from '../../firebase'
import md5 from "md5";
import {
  Grid,
  Form,
  Header,
  Segment,
  Button,
  Message,
  Icon,
} from "semantic-ui-react";
import { Link } from "react-router-dom";

export default class Register extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    errors:[],
    loading: false,
    userRef:firebase.database().ref('users')
  };

  isFormValid= () =>{
    let errors = [];
    let error
    if(this.isFormEmpty(this.state)){
      error = {message: 'Fill in all fields'}
      this.setState({errors: errors.concat(error)})
      return false;
    } else if(!this.isPasswordValid(this.state)){
       error = {message: 'Password is invalid'}
       this.setState({errors: errors.concat(error)})
       return false
    }else
    return true;
  }

  isFormEmpty = ({username,email,password, passwordConfirmation}) =>{
    return !username.length || !email.length || !password.length || !passwordConfirmation.length
  }
  isPasswordValid = ({password, passwordConfirmation}) =>{
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false;
    }else if (password !== passwordConfirmation){
      return false
    }else return true

  }
  displayErrors = errors => errors.map((error,i) => <p key ={i}>{error.message}</p>)

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = event => {
    if(this.isFormValid()){
      this.setState({errors:[], loading: true})
      event.preventDefault()
      firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(createdUser =>{
        console.log(createdUser);
        createdUser.user.updateProfile({
          displayName: this.state.username,
          photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
        })
        .then(()=>{
          this.savedUser(createdUser).then(() =>{
            console.log('user saved')
          })
          this.setState({loading: false})
        })
      .catch(err =>{
        console.log(err);
        this.setState({errors: this.state.errors.concat(err), loading: false})
      })
      .catch(err =>{
        console.log(err);
        this.setState({errors: this.state.errors.concat(err), loading: false})
      })
    })
  }
}

savedUser = createdUser => {
  return this.state.userRef.child(createdUser.user.uid).set({    
    name: createdUser.user.displayName,
    photoURL: createdUser.user.photoURL
  })
}

  handleInputError = (errors, inputName) =>{
    return errors.some(error => error.message.toLowerCase().includes(inputName)) ? 'error' : ""
  }

  

  render() {
    const { username, email, passwordConfirmation, password, errors, loading } = this.state;
    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" icon color="teal" textAlign="center">
            <Icon name="user plus" color="teal" />
            Register for SlackChat
          </Header>
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>
              <Form.Input
                fluid
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="Username"
                onChange={this.handleChange}
                type="text"
                value={username}
              />

              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email"
                onChange={this.handleChange}
                type="email"
                value={email}
                className={this.handleInputError(errors, 'email')}
                />

              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                onChange={this.handleChange}
                type="password"
                className={this.handleInputError(errors, 'password')}
                value={password}
              />

              <Form.Input
                fluid
                name="passwordConfirmation"
                icon="lock"
                iconPosition="left"
                placeholder="Password Confrmation"
                onChange={this.handleChange}
                type="password"
                className={this.handleInputError(errors, 'password')}
                value={passwordConfirmation}
              />

              <Button disabled={loading} className={loading? 'loading': ""} color="teal" fluid size="large">
                Submit
              </Button>
            </Segment>
          </Form>
          {errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(errors)}
            </Message>
          )}
          <Message>
            Already have an Account? <Link to="/login">Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}
