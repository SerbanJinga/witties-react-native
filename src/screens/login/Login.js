import React, { Component } from 'react'
import { Text, Button, Input } from 'react-native-elements'
import { View, StyleSheet, Dimensions } from 'react-native'
const { width, height } = Dimensions.get('window')
import * as theme from '../../styles/theme'
export default class Login extends Component {
    constructor(props){
        super(props)
        this.state = {
            email: "",
            password: "",
            loading: false,
            error: ""
        }
    }

    onLoginSuccess() {
        // this.props.navigation.navigate('Home');
      }

      onLoginFailure(errorMessage) {
        this.setState({ 
            error: errorMessage, 
            loading: false 
        });
      }

      renderLoading() {
        if (this.state.loading) {
          return (
            <View>
              <ActivityIndicator size={'large'} color={theme.colors.blue}/>
            </View>
          );
        }
    }

    async signInWithEmail() {
        await firebase
          .auth()
          .signInWithEmailAndPassword(this.state.email, this.state.password)
          .then(this.onLoginSuccess.bind(this))
          .catch(error => {
              let errorCode = error.code;
              let errorMessage = error.message;
              if (errorCode == 'auth/weak-password') {
                  this.onLoginFailure.bind(this)('Weak Password!');
              } else {
                  this.onLoginFailure.bind(this)(errorMessage);
              }
          });
    }
     

    componentDidMount = () => {

    }

    render(){
        return(
            <View style={styles.container}>
                <Text style={{marginTop: 80}}>Login</Text>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        height: height,
        width: width
    }
})