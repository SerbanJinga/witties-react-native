import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    SafeAreaView,
    KeyboardAvoidingView,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
    Image, Alert
} from 'react-native';
import { Text, Input, Button } from 'react-native-elements'
import firebase from 'firebase'
import 'firebase/firestore'
import * as Font from 'expo-font'
import * as Google from 'expo-google-app-auth'
import * as Facebook from 'expo-facebook'

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            errorMessage: '',
            loading: false
        }
    }

    async componentDidMount() {
        await Font.loadAsync({
            //font1 or 2 can be any name. This'll be used in font-family

            font1: require('../../../assets/SourceSansPro-Black.ttf'),
        });
    }

    isUserEqual = (googleUser, firebaseUser) => {
        if (firebaseUser) {
            var providerData = firebaseUser.providerData;
            for (var i = 0; i < providerData.length; i++) {
                if (
                    providerData[i].providerId ===
                    firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                    providerData[i].uid === googleUser.getBasicProfile().getId()
                ) {
                    // We don't need to reauth the Firebase connection.
                    return true;
                }
            }
        }
        return false;
    };

    onSignIn = googleUser => {
        console.log('Google Auth Response', googleUser);
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        var unsubscribe = firebase.auth().onAuthStateChanged(
            firebaseUser => {
                unsubscribe();
                // Check if we are already signed-in Firebase with the correct user.
                if (!this.isUserEqual(googleUser, firebaseUser)) {
                    // Build Firebase credential with the Google ID token.
                    var credential = firebase.auth.GoogleAuthProvider.credential(
                        googleUser.idToken,
                        googleUser.accessToken
                    );
                    // Sign in with credential from the Google user.
                    firebase
                        .auth()
                        .signInAndRetrieveDataWithCredential(credential)
                        .then(result => {
                            console.log(firebase.auth().currentUser.uid)

                            firebase.firestore().collection("friends").doc(firebase.auth().currentUser.uid).set({
                                prieteni: []
                            })
                        })


                } else {
                    console.log('User already signed-in Firebase.');
                }
            }
        );
    };

    signInWithGoogleAsync = async () => {
        try {
            const result = await Google.logInAsync({
                iosClientId: '178061533357-0hii23b04uupl074ggdpfg53s92thkvk.apps.googleusercontent.com',
                androidClientId: '178061533357-qv4brh779ah25i7m20lrfh9vbf2q00dn.apps.googleusercontent.com',
                scopes: ['profile', 'email'],
                behavior: 'web'
            });

            if (result.type === 'success') {
                this.onSignIn(result);
                return result.accessToken
            } else {
                return { cancelled: true }
            }
        } catch (e) {
            return { error: true }
        }
    }

    onLoginSuccess() {
        this.props.navigation.navigate('Home')
    }

    onLoginFailure(errorMessage) {
        this.setState({
            errorMessage: errorMessage,
            loading: false
        })
        const err = this.state.errorMessage
       
        Alert.alert(err)
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

    async signInWithEmail() {
        await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(this.onLoginSuccess.bind(this))
            .catch(error => {
                let errorCode = error.code
                let errorMessage = error.message
                if (errorCode == 'auth/weak-password') {
                    this.onLoginFailure.bind(this)('Weak Password!')
                } else {
                    this.onLoginFailure.bind(this)(errorMessage)
                }
            })
    }

    loginWithFacebook = async () => {
        try {
            await Facebook.initializeAsync('175604747105532');
            const result = await Facebook.logInWithReadPermissionsAsync({
                permissions: ['public_profile', 'email'],
            });
            if (result.type === 'success') {
                const token = result.token;
                console.log(token)
                const credential = firebase.auth.FacebookAuthProvider.credential(token)

                firebase.auth().signInWithCredential(credential).catch((error) => {
                    console.log(error)
                }).then(() => {
                    this.props.navigation.navigate('Loading')
                })
            }
        } catch (e) {
            console.log(e)
        }
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <View>
                    <View style={{ marginTop: 60, alignItems: "center", justifyContent: "center" }}>
                        {/* <Image source={require("../../../assets/logo.png")} /> */}
                        <Text style={[styles.text, { marginTop: 10, fontSize: 22, fontWeight: "500", marginBottom: 40 }]}>Witties</Text>
                    </View>
                    {/* <View style={{ marginTop: 48, flexDirection: "row", justifyContent: "center" }}>
                      <TouchableOpacity onPress={() => this.loginWithFacebook()}>
                          <View style={styles.socialButton}>
                              <Image source={require("../../../assets/facebook.png")} style={styles.socialLogo} />
                              <Text style={styles.text}>Facebook</Text>
                          </View>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.socialButton} onPress={() => this.signInWithGoogleAsync()}>
                          <Image source={require("../../../assets/google.png")} style={styles.socialLogo} />
                          <Text style={styles.text}>Google</Text>
                      </TouchableOpacity>
                  </View> */}
                    {/* <Text style={[styles.text, { color: "#ABB4BD", fontSize: 15, textAlign: "center", marginVertical: 20 }]}>or</Text> */}

                    <Input
                        autoCapitalize={false}
                        label="Email"
                        labelStyle={{ fontFamily: "font1" }}
                        style={styles.inputTitle}
                        //   style={{marginTop: 32, marginBottom: 8}}
                        returnKeyType="next"
                        textContentType="name"
                        value={this.state.email}
                        onChangeText={email => this.setState({ email })}
                    />
                    <Input
                        autoCapitalize={false}

                        label="Password"
                        labelStyle={{ fontFamily: "font1" }}
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
    },
    inputTitle: {
        color: "#ABB4BD",
        fontSize: 18,
        fontFamily: "font1"
    },
});



export default Login

