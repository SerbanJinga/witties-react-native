import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, ActivityIndicator } from 'react-native'
import firebase from 'firebase'
import * as theme from '../styles/theme'
const { width, height } = Dimensions.get('window');
import * as Font from 'expo-font'
import AsyncStorage from '@react-native-community/async-storage';
let arr = []

let settings 
export default class LoadingScreen extends Component {

    constructor(props){
        super(props)
        this.state = {
            fontLoaded: false,
            documentData: []
        }
    }

    setUpSettingsFirebase = async() => {
        let query = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).get()
        if(typeof query.data().userSettings !== 'undefined') {
            return
        }

        let foo = {
            'receive_map_notifications': true,
            'receive_chat_notifications': true,
        }
        firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({
            userSettings: foo
        })
    }

  
     componentDidMount =  async() => {
         arr = []

        await Font.loadAsync({
            font1: require('../../assets/SourceSansPro-Black.ttf')
        })

            
        
        firebase.auth().onAuthStateChanged(async user => {
            if(user){
                await this.setUpSettingsFirebase().then(
                this.props.navigation.navigate('Home'))
                // await this.retrieveDataFromFriends()
                }else{
                this.props.navigation.navigate('SignUp')
            }
        })
    }

    retrieveDataFromFriends = async() => {
        arr = []
        const currentId = firebase.auth().currentUser.uid
        let friendsQuery = await firebase.firestore().collection('users').doc(currentId).get()
        let friendsData = await friendsQuery.data().friends
        friendsData.forEach(async friend => await this.getStoriesFromFriend(friend))
      }
  
      getStoriesFromFriend = async(friend) => {
        let initialQuery = await firebase.firestore().collection('status-public').doc(friend).collection('statuses').get()
        if(initialQuery.empty){ return }
        let friendStories = initialQuery.docs.map(doc => doc.data())
        arr.push(friendStories[0])
        this.setState({
          documentData: arr
        })
        this.props.navigation.navigate('Home', {stories: arr})
    }


    render(){
        return(
            <View style={styles.container}>
             </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        flex: 1,
    }
})


