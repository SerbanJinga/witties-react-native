import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    SafeAreaView,
    KeyboardAvoidingView,
    ActivityIndicator,
    Keyboard,
    TouchableWithoutFeedback
  } from 'react-native';
  import { Text, Input, Button } from 'react-native-elements'
import firebase from 'firebase'
import 'firebase/firestore'

class Login extends Component{
    constructor(props){
        super(props)
        this.state = {
            email: '',
            password: '',
            errorMessage: '',
            loading: false
        }
    }
    

   

    onLoginSuccess(){
      this.props.navigation.navigate('Home')
    }

    onLoginFailure(errorMessage){
        this.setState({
            error: errorMessage, 
            loading: false
        })
    }

    renderLoading(){
        if(this.state.loading){
            return(
                <View>
                    <ActivityIndicator size={'large'}/>
                </View>
            )
        }
    }

    async signInWithEmail(){
        await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
                        .then(this.onLoginSuccess.bind(this))
                        .catch(error => {
                            let errorCode = error.code
                            let errorMessage = error.message
                            if(errorCode == 'auth/weak-password'){
                                this.onLoginFailure.bind(this)('Weak Password!')
                            }else{
                                this.onLoginFailure.bind(this)(errorMessage)
                            }
                        })
    }

      render(){
        return (
            <TouchableWithoutFeedback
              onPress={() => {
                Keyboard.dismiss();
              }}
            >
              <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView style={styles.container} behavior="padding">
                  <Text style={{ marginTop: 40, fontSize: 32, fontWeight: '700', color: 'gray' }}>
                    Witties
                  </Text>
                  <View style={styles.form}>
                    <Input
                      style={styles.input}
                      placeholder="Email"
                      placeholderTextColor="#B1B1B1"
                      returnKeyType="next"
                      keyboardType="email-address"
                      textContentType="emailAddress"
                      value={this.state.email}
                      onChangeText={email => this.setState({ email })}
                    />
                    <Input
                      style={styles.input}
                      placeholder="Password"
                      placeholderTextColor="#B1B1B1"
                      returnKeyType="done"
                      textContentType="newPassword"
                      secureTextEntry={true}
                      value={this.state.password}
                      onChangeText={password => this.setState({ password })}
                    />
                  </View>
                  {this.renderLoading()}
                  <Text
                    style={{
                      fontSize: 18,
                      textAlign: 'center',
                      color: 'red',
                      width: '80%'
                    }}
                  >
                    {this.state.error}
                  </Text>
                    <View style={{ marginTop: 10 }}>
                   
                  <Button
                    onPress={() => this.signInWithEmail()}
                    type="solid"
                    title="Login"
                    style={styles.button}
                    loading={this.state.loading}
                    
                />
                    <Text
                      style={{ fontWeight: '200', fontSize: 17, textAlign: 'center', marginTop: 20 }}
                      onPress={() => {
                        this.props.navigation.navigate('SignUp');
                      }}
                    >
                      Don't have an account?
                    </Text>
                  </View>
                  <Button
                    type="clear"
                     title="Forgot Password?"
                      style={{ fontWeight: '200', fontSize: 17, textAlign: 'center', marginTop: 20 }}
                      onPress={() => {
                        this.props.navigation.navigate('ForgotPassword');
                      }}
                    />
                </KeyboardAvoidingView>
              </SafeAreaView>
            </TouchableWithoutFeedback>
          );
      }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center'
    },
    form: {
      width: '86%',
      marginTop: 15
    },
    logo: {
      marginTop: 20
    },
    input: {
      fontSize: 20,
      borderColor: '#707070',
      borderBottomWidth: 1,
      paddingBottom: 1.5,
      marginTop: 25.5
    },
    button: {
     
    },
    googleButton: {
      backgroundColor: '#FFFFFF',
      height: 44,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 22,
      borderWidth: 1,
      borderColor: '#707070'
    }
  });
  

export default Login

//