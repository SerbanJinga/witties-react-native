import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    SafeAreaView,
    KeyboardAvoidingView,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
    Image
  } from 'react-native';
  import { Text, Input, Button } from 'react-native-elements'
import firebase from 'firebase'
import 'firebase/firestore'
import * as Font from 'expo-font'

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
    
    async componentDidMount(){
        await Font.loadAsync({
            //font1 or 2 can be any name. This'll be used in font-family
             
            font1: require('../../../assets/SourceSansPro-Black.ttf'),                         
        });
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
          <ScrollView style={styles.container}>
          <View>
          <View style={{ marginTop: 60, alignItems: "center", justifyContent: "center" }}>
                      {/* <Image source={require("../../../assets/logo.png")} /> */}
                      <Text style={[styles.text, { marginTop: 10, fontSize: 22, fontWeight: "500" }]}>Witties</Text>
                  </View>
                  <View style={{ marginTop: 48, flexDirection: "row", justifyContent: "center" }}>
                      <TouchableOpacity>
                          <View style={styles.socialButton}>
                              <Image source={require("../../../assets/facebook.png")} style={styles.socialLogo} />
                              <Text style={styles.text}>Facebook</Text>
                          </View>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.socialButton}>
                          <Image source={require("../../../assets/google.png")} style={styles.socialLogo} />
                          <Text style={styles.text}>Google</Text>
                      </TouchableOpacity>
                  </View>
                  <Text style={[styles.text, { color: "#ABB4BD", fontSize: 15, textAlign: "center", marginVertical: 20 }]}>or</Text>

              <Input 
                  label="Email"
                  labelStyle={{fontFamily: "font1"}}
                  style={{marginTop: 32, marginBottom: 8}}
                  returnKeyType="next"
                  textContentType="name"
                  value={this.state.email}
                  onChangeText={email => this.setState({ email })}
              />
              <Input 
                  label="Password"
                  labelStyle={{fontFamily: "font1"}}
                  style={styles.inputTitle}
                  returnKeyType="next"
                  secureTextEntry={true}
                  textContentType="newPassword"
                  value={this.state.password}
                  onChangeText={password => this.setState({ password })}
              />
            <Text style={[styles.text, styles.link, { textAlign: "right" }]} onPress={() => this.props.navigation.navigate('ForgotPassword')}>Forgot Password?</Text>

              <TouchableOpacity 
                  style={styles.submitContainer}
                  onPress={() => this.signInWithEmail()}
                  >
                      <Text                            
                          style={[
                              styles.text,
                              {
                                  color: "#FFF",
                                  fontWeight: "600",
                                  fontSize: 16
                              }
                          ]}
                      >
                          Login
                      </Text>
                  </TouchableOpacity>
                  <Text
                      style={[
                          styles.text,
                          {
                              fontSize: 14,
                              color: "#ABB4BD",
                              textAlign: "center",
                              marginTop: 24
                          }
                      ]}
                  >
                      Don't have an account? <Text style={[styles.text, styles.link]} onPress={() => this.props.navigation.navigate('SignUp')}>Register Now</Text>
                  </Text>
          </View>        
      </ScrollView>
          );
      }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: "#fff",
      paddingHorizontal: 30
  },
  text: {
      fontFamily: 'font1',
      color: "#1D2029"
  },
  socialButton: {
      flexDirection: "row",
      marginHorizontal: 12,
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: "rgba(171, 180, 189, 0.65)",
      borderRadius: 4,
      backgroundColor: "#fff",
      shadowColor: "rgba(171, 180, 189, 0.35)",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 1,
      shadowRadius: 20,
      elevation: 5
  },
  socialLogo: {
      width: 16,
      height: 16,
      marginRight: 8
  },
  link: {
      color: "#0984e3",
      fontSize: 14,
      fontWeight: "500"
  },
  submitContainer: {
      backgroundColor: "#0984e3",
      fontSize: 16,
      borderRadius: 4,
      paddingVertical: 12,
      marginTop: 32,
      alignItems: "center",
      justifyContent: "center",
      color: "#FFF",
      shadowColor: "rgba(9,132,227, 0.24)",
      shadowOffset: { width: 0, height: 9 },
      shadowOpacity: 1,
      shadowRadius: 20,
      elevation: 5
  }
});

  

export default Login

//