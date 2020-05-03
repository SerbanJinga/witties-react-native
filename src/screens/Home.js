import React, { Component } from 'react'
import { Text, Button } from 'react-native-elements'
import { View, Dimensions, StyleSheet } from 'react-native'
import firebase from 'firebase'
import Swiper from 'react-native-swiper'
import HomeContainer from '../screens/containers/HomeContainer'
import TestContainer from '../screens/TestContainer'
const { width, height } = Dimensions.get('window')


export default class Home extends Component {
   
    constructor(props){
      super(props)
      this.state = {
        displayName: '',
        discriminator: ''
      }
    }


    _signOut = () => {
      firebase.auth().signOut().then(this.props.navigation.navigate('Loading'))
    }

   componentDidMount = () => {
    //ASA SE FACE REFUL 
    console.log(firebase.auth().currentUser.uid)
      firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
        friends: firebase.firestore().doc("users/" + "075JUbG0ZqfcU74IDzwnqwHT1lf1")
      })
   }

   

    

    render(){
        return(
            <View>
              <Button
                onPress = {this._signOut}
                style={{marginTop: 80}}
                title="Sign Out"
              />
              <TestContainer/>
            </View>
            
        )
    }
}

