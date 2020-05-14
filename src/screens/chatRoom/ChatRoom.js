import React, { Component } from 'react'
import { Text, Input, Button, Icon } from 'react-native-elements'
import { Platform, KeyboardAvoidingView, View, StyleSheet, Dimensions, FlatList } from 'react-native'
import MessageComponent from '../chatRoom/MessageComponent'
import firebase from 'firebase'

import _ from "lodash"
import { withNavigation } from 'react-navigation'
const arr = []


require('firebase/functions')
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const { width, height } = Dimensions.get('window')
 class ChatRoom extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //tu esti 
            currentUser: firebase.auth().currentUser.uid,
            //cu asta vorbesti acum 
            roomId: props.navigation.state.params.roomId,
            roomName: props.navigation.state.params.iqdif,
            userId: "",
            messages: [],
            currentMessage: '',
        }
    }
    async waitAndMakeRequest(update_rate) {
        this.retrieveData()
        await delay(update_rate).then(() => {

            this.waitAndMakeRequest(update_rate);
        }

        )
    }
    createMessage = (message) => {
        const timestamp = Date.now()
        const msg = message
        const sender = this.state.currentUser

        const newMessage = {
            timestamp: timestamp,
            msg: msg,
            sender: firebase.auth().currentUser.uid
        }
        //Adauga pe ecran instant
        let aru =[]
        aru=this.state.messages
        aru.push(newMessage)
        this.setState({message:aru})



        //seteaza in baza de date
        firebase.firestore().collection("messages").doc(this.state.roomId).update({
            messages: firebase.firestore.FieldValue.arrayUnion(newMessage)
        })
    }

    componentDidMount() {
        this.retrieveData()
       
    }

    retrieveData = async () => {
        let arrMsg =[];
        let receivedQuery = await firebase.firestore().collection("messages").where("roomId", "==", this.state.roomId)
        let documentSnapshots = await receivedQuery.get()
        let documentData = documentSnapshots.docs.map(doc => doc.data())
        documentData[0].messages.forEach(Element => {
            arrMsg.push(Element)
        });
        var isEqual = _.isEqual(arrMsg, this.state.messages);
        if (this.state.messages.length === 0)
            this.setState({ messages: arrMsg })
        if (!isEqual)
            this.setState({ messages: arrMsg })
    }


    render() {
        return (
            <View style={styles.container}>
                <Text>id of the room is {this.state.roomId}</Text>
                <Text>Name of the room is {this.state.roomName}</Text>
                <Button title='apasa' style={{ marginTop: 100 }} onPress={() => { this.retrieveData() }} />
                <Text h1>da</Text>
                <View style={{ width: width * .8, height: height }}>
                    <Input

                        placeholder={"scrie un mesaj " + "Mihaitza Piticu" + '!'}
                        placeholderTextColor="#B1B1B1"
                        returnKeyType="done"
                        textContentType="newPassword"
                        rightIcon={<Icon type='ionicon' name='ios-send' size={24} onPress={() => {
                            if (this.state.currentMessage != "")
                                this.createMessage(this.state.currentMessage)
                            this.setState({ currentMessage: '' })
                        }} />}
                        containerStyle={{ marginBottom: 0, paddingBottom: 0 }}
                        value={this.state.currentMessage}
                        onChangeText={currentMessage => this.setState({ currentMessage })}
                    />

                    <FlatList
                        data={this.state.messages}
                        renderItem={({ item }) => (
                            <MessageComponent msg={item.msg} date={item.timestamp} sender={item.sender}/>
                            
                        )}
                        keyExtractor={(item, index) => String(index)}
                        ListHeaderComponent={this.renderHeader}
                        ListFooterComponent={this.renderFooter}
                        onEndReached={this.retrieveMore}
                        onEndReachedThreshold={0}
                        refreshing={this.state.refreshing}
                    />
                </View>
            </View>)


    }
}


export default withNavigation(ChatRoom)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',

    },
})