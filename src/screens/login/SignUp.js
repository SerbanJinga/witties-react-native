import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    SafeAreaView,
    TouchableOpacity,
    KeyboardAvoidingView,
    ActivityIndicator,
    Keyboard,
    TouchableWithoutFeedback,
    ImageBackground,
    Dimensions,
    Image

} from 'react-native';
import * as Facebook from 'expo-facebook'
import * as Google from 'expo-google-app-auth'
import * as Permissions from 'expo-permissions'
import { Notifications } from 'expo'
import * as Font from 'expo-font'
import * as Expo from 'expo'

import Toast, { DURATION } from 'react-native-easy-toast'
import { Text, Input, Button } from 'react-native-elements'
import firebase from 'firebase'
import 'firebase/firestore'
import Icon from 'react-native-vector-icons/Ionicons'
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons'
import wallp from "../../../assets/b1.png"
import { ScrollView } from 'react-native-gesture-handler';
require('firebase/functions')
//function pad(num) {
//    var s = "000000000" + num;
 //   return s.substr(s.length - 4);
//}
const { width: WIDTH, height: HEIGHT } = Dimensions.get('window')
class SignUp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            displayName: '',
            email: '',
            password: '',
            careScore: 0,
            discriminator: "",
            profilePicture: "",
            errorMessage: '',
            loading: false,
            friends: [],
            uid: "",
            notifToken: "",
            googleUser: null,
            fonstLoaded: false
        }
    }
    async componentDidMount(){
        // this.refs.toast.show('hello gigica')
        await Font.loadAsync({
            //font1 or 2 can be any name. This'll be used in font-family
             
            font1: require('../../../assets/SourceSansPro-Black.ttf'),                         
        });
        this.setState({fonstLoaded: true})
    }
   

    async calculateDiscrim(searchName) {
        try {
            console.log('merge')
            //to do trb sa vezi cand un query este invalid si sa setezi in cazul acela discriminatorul cu 0001
            //si sa schimbi in singup discrimiator
            function pad(num) {
                var s = "000000000" + num;
                return s.substr(s.length - 4);
            }

            let initialQuery = await firebase.firestore().collection("users").where("displayName", "==", searchName).orderBy("discriminator", "asc");
            let documentSnapshots = await initialQuery.get();
            if (documentSnapshots.empty) {
                this.setState({
                    discriminator: "0001"
                })
            } else {
                let documentData = documentSnapshots.docs.map(document => document.data());

                let dis = documentData[documentData.length - 1].discriminator;
                let nrdis = Number(dis) + 1;


                const discrim = pad(nrdis)
                this.setState({
                    discriminator: discrim
                })
                console.log(this.state.discriminator)

            }
            await firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
                discriminator: this.state.discriminator
            })
        } catch (err) { }
    }



    _retrieveDisplayName = async () => {
        const docRef = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid);
        docRef.get().then(doc => {
            if (doc.exists) {
                this.setState({ displayName: doc.data().displayName })
            } else {
                console.log('Undefined document')
            }
        }).catch(function (err) {
            console.log(err)
        })

        console.log(this.state.displayName)
        this.calculateDiscrim(this.state.displayName).then(this.props.navigation.navigate('Home'))
    }


    onLoginSuccess() {
        firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).set({
            email: this.state.email,
            displayName: this.state.displayName,
            careScore: this.state.careScore,
            discriminator: this.state.discriminator,
            profilePicture: this.state.profilePicture,
            friends: this.state.friends,
            uid: firebase.auth().currentUser.uid,
            status: "",
            customActivities: []
        }).then(this._retrieveDisplayName(), (error) => {
            console.log(error)
            alert(error)
        })
        firebase.firestore().collection("friends").doc(firebase.auth().currentUser.uid).set({
            prieteni: []
        })
        firebase.firestore().collection("private").doc(firebase.auth().currentUser.uid).set({
            statuses: []
        })
        firebase.firestore().collection("status-public").doc(firebase.auth().currentUser.uid).set({
            statuses: []
        })
    }

    onLoginFailure(errorMessage) {
        this.setState({
            errorMessage: errorMessage,
            loading: false
        })
        const err = this.state.errorMessage
        this.refs.error.show(err)
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
        await firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
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
                    firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).set({
                        email: result.user.email,
                        displayName: result.user.displayName,
                        careScore: this.state.careScore,
                        discriminator: this.state.discriminator,
                        profilePicture: result.user.photoURL,
                        friends: this.state.friends,
                        uid: firebase.auth().currentUser.uid,
                        status: "",
                        customActivities: []
                    }).then(this._retrieveDisplayName(), (error) => {
                        console.log(error)
                        alert(error)
                    })
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

    signInWithGoogleAsync = async() => {
        try{
            const result = await Google.logInAsync({
                iosClientId: '178061533357-0hii23b04uupl074ggdpfg53s92thkvk.apps.googleusercontent.com',
                androidClientId: '178061533357-qv4brh779ah25i7m20lrfh9vbf2q00dn.apps.googleusercontent.com',
                scopes: ['profile', 'email'],
                behavior: 'web'
            });

            if(result.type === 'success'){
                this.onSignIn(result);
                return result.accessToken
            }else {
                return { cancelled: true }
            }
        }catch(e){
            return { error: true }
        }
    }


    loginWithFacebook = async() => {
        try{
            await Facebook.initializeAsync('175604747105532');
           const result= await Facebook.logInWithReadPermissionsAsync({
                permissions: ['public_profile', 'email'],
              }); 
            if(result.type === 'success'){
            const token = result.token;
            console.log(token)
            const credential = firebase.auth.FacebookAuthProvider.credential(token)    
            const response = await fetch(
                `https://graph.facebook.com/me?access_token=${token}&fields=id,name,birthday,email,picture.type(large)`
            );
              const { picture, name, birthday, email } = await response.json();
              console.log(email)
            firebase.auth().signInWithCredential(credential).catch((error) => {
                console.log(error)
            }) .then(result => {
                console.log(firebase.auth().currentUser.uid)
                firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).set({
                    email: email,
                    displayName: name,
                    careScore: this.state.careScore,
                    discriminator: this.state.discriminator,
                    profilePicture: picture.data.url,
                    friends: this.state.friends,
                    uid: firebase.auth().currentUser.uid,
                    status: "",
                    customActivities: []
                }).then(this._retrieveDisplayName(), (error) => {
                    console.log(error)
                    alert(error)
                })
                firebase.firestore().collection("friends").doc(firebase.auth().currentUser.uid).set({
                    prieteni: []
                })
            })
            }     
        }catch(e){
            console.log(e)
        }
    }
   
    render() {
        const loaded = this.state.fonstLoaded
        if(loaded){
        return (
        
        <ScrollView style={styles.container}>
            <View>
            <View style={{ marginTop: 60, alignItems: "center", justifyContent: "center" }}>
                        {/* <Image source={require("../../../assets/logo.png")} /> */}
                        <Text style={[styles.text, { marginTop: 10, fontSize: 22, fontWeight: "500" }]}>Witties</Text>
                    </View>
                    <View style={{ marginTop: 48, flexDirection: "row", justifyContent: "center" }}>
                        <TouchableOpacity onPress = {() => this.loginWithFacebook()}>
                            <View style={styles.socialButton}>
                                <Image source={require("../../../assets/facebook.png")} style={styles.socialLogo} />
                                <Text style={styles.text}>Facebook</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.socialButton} onPress={() => this.signInWithGoogleAsync()}>
                            <Image source={require("../../../assets/google.png")} style={styles.socialLogo} />
                            <Text style={styles.text}>Google</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.text, { color: "#ABB4BD", fontSize: 15, textAlign: "center", marginVertical: 20 }]}>or</Text>

                <Input 
                    label="Name"
                    labelStyle={{fontFamily: "font1"}}
                    style={styles.inputTitle}
                    returnKeyType="next"
                    textContentType="name"
                    value={this.state.displayName}
                    onChangeText={displayName => this.setState({ displayName })}
                />
                <Input 
                    label="Email"
                    style={{marginTop: 32, marginBottom: 8}}
                    returnKeyType="next"
                    textContentType="name"
                    labelStyle={{fontFamily: "font1"}}
                    value={this.state.email}
                    onChangeText={email => this.setState({ email })}
                />
                <Input 
                    label="Password"
                    style={styles.inputTitle}
                    returnKeyType="next"
                    secureTextEntry={true}
                    labelStyle={{fontFamily: "font1"}}
                    textContentType="newPassword"
                    value={this.state.password}
                    onChangeText={password => this.setState({ password })}
                />
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
                            Signup
                        </Text>
                    </TouchableOpacity>
                    <Text
                        style={[
                            styles.text,
                            {
                                fontSize: 14,
                                color: "#ABB4BD",
                                textAlign: "center",
                                marginTop: 24,
                                marginBottom: 20
                            }
                        ]}
                    >
                        Already have an account? <Text style={[styles.text, styles.link]} onPress={() => this.props.navigation.navigate('LogIn')}>Login Now</Text>
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
        );}else{
            return(
                <View style={styles.container}>
                    <ActivityIndicator size={'large'}/>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 30
    },
    text: {
        fontFamily: "font1",
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
        fontSize: 14,
        fontFamily: "font1"
    },
    input: {
        paddingVertical: 12,
        color: "#1D2029",
        fontSize: 14,
        fontFamily: "font1"
    }
  });
  

export default SignUp

//