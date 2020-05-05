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
    TouchableWithoutFeedback
} from 'react-native';
import wallp from "../../../assets/b1.png"

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
        alert('bravo')
    }

    onResetFailure(errorMessage) {
        this.setState({
            error: errorMessage,
            loading: false
        })
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
        return (<ImageBackground source={wallp} style={styles.backgroundContainer}>
            <TouchableWithoutFeedback
                onPress={() => {
                    Keyboard.dismiss();
                }}
            >
                <SafeAreaView style={{ flex: 1, width: width - 455, alignItems: 'center' }}>
                    
                        <Text style={{ marginTop: 40, fontSize: 32, fontWeight: '700', color: '#f5f6fa' }}>
                            Forgot Password?
                        </Text>
                        <View style={styles.form}>
                            <Input
                                style={styles.textInput}
                                inputStyle={styles.textInput}
                                inputContainerStyle={styles.input}
                                placeholder="Email"
                                placeholderTextColor={'rgba(255,255,255,0.9)'}

                                returnKeyType="next"
                                keyboardType="email-address"
                                textContentType="emailAddress"
                                value={this.state.email}
                                onChangeText={email => this.setState({ email })}
                            />
                        </View>
                        {this.renderLoading()}

                    <View style={{ width: width * 0.6 }}>

                            <Button
                                onPress={() => this.resetPassword()}
                                type="solid"
                                title="Send reset password"
                                
                                loading={this.state.loading}
                            />
                            <Text
                                style={{
                                    paddingTop:10,
                                    fontSize: 18,
                                    textAlign: 'center',
                                    color: 'red',
                                    width: width * 0.6,
                                }}
                            >
                                {this.state.error}
                            </Text>
                            <Text
                                style={{ fontWeight: '200', fontSize: 17, textAlign: 'center',color: '#f5f6fa' }}
                                onPress={() => {
                                    this.props.navigation.navigate('LogIn');
                                }}
                            >
                                Remember Password?
                            </Text>
                        </View>
                    
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </ImageBackground>
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
    backgroundContainer: {
        flex: 1,
        width: width,
        height: height,
        position: 'absolute',
        justifyContent: "center",
        alignItems: 'center'
    },
    form: {
        width: width * 0.8,
        marginTop: 15
    },
    logo: {
        marginTop: 20
    },
    input: {
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(0,0,0,0.4)',
        color: 'rgba(255,255,255,0.7)',
        marginHorizontal: 25,
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
    },
    textInput: {
        paddingLeft: 50,
        color: "#f5f6fa"
    }
});