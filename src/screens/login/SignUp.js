import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    SafeAreaView,
    TouchableOpacity,
    KeyboardAvoidingView,
    ActivityIndicator,
    Keyboard,
    TouchableWithoutFeedback
  } from 'react-native';
  import { Text, Input, Button } from 'react-native-elements'
import firebase from 'firebase'
import 'firebase/firestore'
import idCreation from '../../utils/idCreation'
const p = idCreation;
function pad(num) {
  var s = "000000000" + num;
  return s.substr(s.length - 4);
}

class SignUp extends Component{
    constructor(props){
        super(props)
        this.state = {
            displayName: '',
            email: '',
            password: '',
            careScore: 0,
            discriminator: "",
            profilePicture: "" ,
            errorMessage: '',
            loading: false,
            friends: [],
            uid: ""
        }
    }

    // recievedDiscrim(rez, nume) {
    //   console.log("Rez este ", rez)
    
    
    //   firebase.firestore().collection("users").doc().set({ displayName: nume, discriminator:rez })
    //   firebase.auth().currentUser.metadata.lastSignInTime
    // }

    async calculateDiscrim  (searchName) {
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
          if(documentSnapshots.empty){
            this.setState({
              discriminator: "0001"
            })
          }else{
            let documentData = documentSnapshots.docs.map(document => document.data());
            
            let dis = documentData[documentData.length - 1].discriminator;
            let nrdis = Number(dis)+1;
          

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
        if(doc.exists){
          this.setState({displayName: doc.data().displayName})
        }else{
          console.log('Undefined document')
        }
      }).catch(function(err){
        console.log(err)
      })

      console.log(this.state.displayName)
      this.calculateDiscrim(this.state.displayName).then(this.props.navigation.navigate('Home'))
    }
    

   
    onLoginSuccess(){
      firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).set({
        email: this.state.email,
        displayName: this.state.displayName,
        careScore: this.state.careScore,
        discriminator: this.state.discriminator,
        profilePicture: this.state.profilePicture,
        friends: this.state.friends,
        uid: firebase.auth().currentUser.uid
      }).then(this._retrieveDisplayName(), (error) => {
        console.log(error)
        alert(error)
      })
      firebase.firestore().collection("friends").doc(firebase.auth().currentUser.uid).set({
        prieteni: []
      })
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
        await firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
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

    async signInWithGoogle() {
        try {
          await GoogleSignIn.askForPlayServicesAsync();
          const { type, user } = await GoogleSignIn.signInAsync();
          if (type === 'success') {
            await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
            const credential = firebase.auth.GoogleAuthProvider.credential(user.auth.idToken, user.auth.accessToken,);
            const googleProfileData = await firebase.auth().signInWithCredential(credential);
            this.onLoginSuccess.bind(this);
          }
        } catch ({ message }) {
          alert('login: Error:' + message);
        }
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
                      placeholder="Name"
                      placeholderTextColor="#B1B1B1"
                      returnKeyType="next"
                      textContentType="name"
                      value={this.state.displayName}
                      onChangeText={displayName => this.setState({ displayName })}
                    />
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
                    title="Sign Up"
                    style={styles.button}
                    loading={this.state.loading}
                    
                />
                    <Text
                      style={{ fontWeight: '200', fontSize: 17, textAlign: 'center', marginTop: 20 }}
                      onPress={() => {
                        this.props.navigation.navigate('LogIn');
                      }}
                    >
                      Already have an account?
                    </Text>
                  </View>
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
  

export default SignUp

//