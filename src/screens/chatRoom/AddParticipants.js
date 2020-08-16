import React, { Component } from 'react'
import { View, SafeAreaView, Dimensions, TouchableOpacity, Text } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { FlatList } from 'react-native-gesture-handler'
import firebase from 'firebase'
import AddParticipant from './AddParticipant'
const { width, height } = Dimensions.get('window')
let arr = []
export default class AddParticipants extends Component {
    constructor(props){
        super(props)
        this.state = {
            documentData: [],
            chatRoomIds: []
        }
    }

    componentDidMount = async() => {
        arr = []
        await this.retrieveData()
    }

    addUserToChatRoom = (uid) => {
        const chatRoomIdsFinal = this.state.chatRoomIds
        chatRoomIdsFinal.push(uid)
        this.setState({chatRoomIds: chatRoomIdsFinal})
console.log(this.state.chatRoomIds)

    }

    removeUserFromChatRoom = (uid) => {
        let chatRoomIdsFinal = this.state.chatRoomIds
        for(let i = 0; i < chatRoomIdsFinal.length; i++)
            if(chatRoomIdsFinal[i] == uid)
                chatRoomIdsFinal.splice(i, 1)
        this.setState({chatRoomIds: chatRoomIdsFinal})
        console.log(this.state.chatRoomIds)

    }



    retrieveData = async() => {
        let query = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).get()
        let data = await query.data().friends
        let messagesQuery = await firebase.firestore().collection('messages').doc(this.props.roomId).get()
        let messagesData = await messagesQuery.data().usersParticipating

        console.log(messagesData, 'Datatata', data, 'dadaldlal')

        data = data.filter(element => !messagesData.includes(element))
        data.forEach(async friend => this.getFriendData(friend))
    }

    getFriendData = async(friend) => {
        let query = await firebase.firestore().collection('users').doc(friend).get()
        let data = await query.data()
        arr.push(data)
        this.setState({
            documentData: arr
        })
    }

    addParticipants = async () => {
        this.state.chatRoomIds.forEach(element => {
        firebase.firestore().collection('messages').doc(this.props.roomId).update({
            usersParticipating: firebase.firestore.FieldValue.arrayUnion(element)
        })})
    }

    render(){
        return(
            <SafeAreaView style={{flex: 1}}>
                   <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 }}>
                        <TouchableOpacity onPress={() => this.props.close()}>
                            <AntDesign
                                size={26}
                                name="down"
                                color="#b2b8c2"
                            />
                        </TouchableOpacity>
                        <Text style={{ fontFamily: 'font1', fontSize: 20 }}>Add Particpants</Text>
                        <TouchableOpacity onPress={() => this.addParticipants()}>
                        <AntDesign
                            size={26}
                            name="check"
                            color="#b2b8c2"
                        />
                        </TouchableOpacity>
                    </View>
                    {this.state.documentData.length !== 0 ? 
                    <FlatList   
                        data={this.state.documentData}
                        renderItem={({ item, index }) => (
                            <View>
                                    <AddParticipant uid={item.uid} mama={this.addUserToChatRoom} tata={this.removeUserFromChatRoom} profilePicture={item.profilePicture} displayName={item.displayName} discriminator={item.discriminator}/>
                            </View>
                        )}
                    /> : <Text style={{fontFamily: 'font1', fontSize: 15, margin: 4, alignSelf: 'center'}}>All of your friends are in this chat.</Text>}
            </SafeAreaView>
        )
    }
}