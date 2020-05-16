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
import GoogleSignIn from 'expo-google-sign-in'
import * as Permissions from 'expo-permissions'
import { Notifications } from 'expo'
import * as Font from 'expo-font'

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
            notifToken: ""
        }
    }
    async componentDidMount(){
        await Font.loadAsync({
            //font1 or 2 can be any name. This'll be used in font-family
             
            font1: require('../../../assets/SourceSansPro-Black.ttf'),                         
        });
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
            status: ""

        }).then(this._retrieveDisplayName(), (error) => {
            console.log(error)
            alert(error)
        })
        firebase.firestore().collection("friends").doc(firebase.auth().currentUser.uid).set({
            prieteni: []
        })
    }

    onLoginFailure(errorMessage) {
        this.setState({
            error: errorMessage,
            loading: false
        })
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

    async signInWithGoogle() {
      const provider = firebase.auth.GoogleAuthProvider()
        firebase.auth().signInWithPopup(provider).then(function(result){
            const token = result.credential.accessToken;
            console.log('a mers')
        })
    }

    render() {
        return (<ScrollView style={styles.container}>
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

                        <TouchableOpacity style={styles.socialButton} onPress={console.log('da')}>
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