import React, { Component } from 'react'
import firebase from 'firebase'
import { Text, Button, Input } from 'react-native-elements'
import {
    StyleSheet,
    View,
    SafeAreaView,
    KeyboardAvoidingView,
    Keyboard,
    Dimensions,
    ImageBackground,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import wallp from "../../../assets/b1.png"
import { Font } from 'expo-font'
import Toast, { DURATION } from 'react-native-easy-toast'
const { width, height } = Dimensions.get('window')
class ForgotPassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: "",
            loading: false,
            errorMessage: ""
        }
    }
    async componentDidMount(){
        await Font.loadAsync({
            //font1 or 2 can be any name. This'll be used in font-family
             
            font1: require('../../../assets/SourceSansPro-Black.ttf'),                         
        });
    }

    renderLoading() {
        if (this.state.loading) {
            return (
                <View>
                    <ActivityIndicator size={'large'} />
                </View>
            )
        }
    }

    onResetSuccess() {
        alert('An email has been sent to ' + this.state.email)
    }

    onResetFailure(errorMessage) {
        this.setState({
            errorMessage: errorMessage,
            loading: false
        })
        const err = this.state.errorMessage
        this.refs.error.show(err)
    }

    async resetPassword() {
        
        await firebase.auth().sendPasswordResetEmail(this.state.email)
            .then(this.onResetSuccess.bind(this))
            .catch(error => {
                let errorCode = error.code
                let errorMessage = error.message
                if (errorCode == 'auth/weak-password') {
                    this.onResetFailure.bind(this)('Weak Password!')
                } else {
                    this.onResetFailure.bind(this)(errorMessage)
                }
            })
    }

    render() {
        return (
            <ScrollView style={styles.container}>
            <View>
            <View style={{ marginTop: 60, alignItems: "center", justifyContent: "center" }}>
                      {/* <Image source={require("../../../assets/logo.png")} /> */}
                      <Text style={[styles.text, { marginTop: 10, fontSize: 22, fontWeight: "500",marginBottom: 40 }]}>Forgot Password?</Text>
            </View>

                        <Input
                        autoCapitalize={true} 
                            label="Email"
                            labelStyle={{fontFamily: "font1"}}
                            style={styles.inputTitle}
                            // style={{marginTop: 32, marginBottom: 8}}
                            returnKeyType="next"
                            textContentType="name"
                            value={this.state.email}
                            onChangeText={email => this.setState({ email })}
                      />
                      <TouchableOpacity 
                  style={styles.submitContainer}
                  onPress={() => this.resetPassword()}
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
                          Reset password
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
                      Remember your password?<Text style={[styles.text, styles.link]} onPress={() => this.props.navigation.navigate('LogIn')}> Login here</Text>
                     
                  </Text>
                  <Toast 
                        ref="error"
                        style={{backgroundColor: '#282828'}}
                        textStyle={{color: '#fff'}}
                        position='bottom'
                        opacity={0.8}
                        fadeInDuration={750}
                 />
            </View>
        </ScrollView>
        )
    }
}
export default ForgotPassword




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
        marginTop: 20,
        alignItems: "center",
        justifyContent: "center",
        color: "#FFF",
        shadowColor: "rgba(9,132,227, 0.24)",
        shadowOffset: { width: 0, height: 9 },
        shadowOpacity: 1,
        shadowRadius: 20,
        elevation: 5
    },
    inputTitle: {
        color: "#ABB4BD",
        fontSize: 18,
        fontFamily: "font1"
    },
  });
  