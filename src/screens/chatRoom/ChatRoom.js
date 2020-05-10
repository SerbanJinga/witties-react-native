import React, { Component } from 'react'
import { Text, Input, Button } from 'react-native-elements'
import { Platform, KeyboardAvoidingView, View, TextInput } from 'react-native'
import { GiftedChat } from "react-native-gifted-chat";
import firebase from 'firebase'
const arr = []
require('firebase/functions')
export default class ChatRoom extends Component {
    
    constructor(props){
        super(props)
        this.state = {
            groupName: ""
        }
    }

    // createMessage = (message) => {
    //     const timestamp = Date.now()
    //     const msg = message
    //     const sender = this.state.currentUser

    //     const newMessage = {
    //         timestamp: timestamp,
    //         msg: msg,
    //         sender: sender
    //     }

    //     firebase.firestore().collection("messages").doc('6zOyaL5DFG4N3wrlwJmM').update({
    //         messages: firebase.firestore.FieldValue.arrayUnion(newMessage)
    //     })
    // }
 
    // componentDidMount(){
    //     arr.push(this.state.currentUser)
    //     arr.push(this.state.userId)
    //     firebase.firestore().collection("messages").add({
    //         userParticipating: arr,
    //         messages: []
    //     })
    //     console.log(this.state.currentUser)
    //     console.log(this.state.userId)
    //     this.createMessage("salut, va pup in cur pe toti")
    // }



    
    render(){
        return(
            <Input
                
            />    
        )    
    }
}