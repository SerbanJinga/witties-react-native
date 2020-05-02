import React, { Component } from 'react'
import firebase from 'firebase'
import {Text, Button, Input } from 'react-native-elements'
import {
    StyleSheet,
    View,
    SafeAreaView,
    KeyboardAvoidingView,
    Keyboard,
    Dimensions,
    TouchableWithoutFeedback
  } from 'react-native';
 
const { width, height } = Dimensions.get('window')

class ForgotPassword extends Component {
    constructor(props){
        super(props)
        this.state = {
            email: "",
            loading: false,
            errorMessage: ""
        }
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

    onResetSuccess(){
        alert('bravo')
    }
  
      onResetFailure(errorMessage){
          this.setState({
              error: errorMessage, 
              loading: false
          })
      }
  
   async resetPassword(){
    await firebase.auth().sendPasswordResetEmail(this.state.email)
    .then(this.onResetSuccess.bind(this))
    .catch(error => {
        let errorCode = error.code
        let errorMessage = error.message
        if(errorCode == 'auth/weak-password'){
            this.onResetFailure.bind(this)('Weak Password!')
        }else{
            this.onResetFailure.bind(this)(errorMessage)
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
                    Forgot Password?
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
                    onPress={() => this.resetPassword()}
                    type="solid"
                    title="Send reset password"
                    style={styles.button}
                    loading={this.state.loading}
                    />
                    <Text
                      style={{ fontWeight: '200', fontSize: 17, textAlign: 'center', marginTop: 20 }}
                      onPress={() => {
                        this.props.navigation.navigate('LogIn');
                      }}
                    >
                      Remember Password?
                    </Text>
                </View>
             </KeyboardAvoidingView>
              </SafeAreaView>
            </TouchableWithoutFeedback>
        )
    }
}
export default ForgotPassword




const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center'
    },
    form: {
      width: '86%',
      marginTop: 40
    },
    logo: {
      marginTop: 20
    },
    input: {
      fontSize: 20,
      borderColor: '#707070',
      borderBottomWidth: 1,
      paddingBottom: 1.5,
      marginTop: 40
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
  