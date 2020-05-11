import React, { Component } from 'react'
import { Text, Input, Button, Icon } from 'react-native-elements'
import { Platform, KeyboardAvoidingView, View, StyleSheet, Dimensions, FlatList } from 'react-native'
import MessageComponent from '../chatRoom/MessageComponent'
import firebase from 'firebase'

import _ from "lodash"
const arr = []


require('firebase/functions')
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const { width, height } = Dimensions.get('window')
export default class ChatRoom extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //tu esti 
            currentUser: "",
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
            sender: sender
        }
        //Adauga pe ecran instant
        let aru =[]
        aru=this.state.messages
        aru.push(newMessage)
        this.setState({message:aru})



        //seteaza in baza de date
        firebase.firestore().collection("messages").doc('p4SN9pvlRYeJMCyXJFQZ').update({
            messages: firebase.firestore.FieldValue.arrayUnion(newMessage)
        })
    }

    componentDidMount() {
        // console.log("--------------------------------------------------------")
        // console.log(this.props)

        // console.log(this.props.navigation.state.params.iqdif)
        // arr.push(this.state.currentUser)
        // arr.push(this.state.userId)
        // firebase.firestore().collection("messages").doc("p4SN9pvlRYeJMCyXJFQZ").add({
        //     userParticipating: arr,
        //     messages: []
        // })
        // console.log(this.state.currentUser)
        // console.log(this.state.userId)
        //this.createMessage("salut, va pup in cur pe toti")
        // this.waitAndMakeRequest(30000)
    }

    retrieveData = async () => {
        let arrMsg =[];
        let receivedQuery = await firebase.firestore().collection("messages").where("roomId", "==", "jSwlzeEEDjR30ot01dWY")
        let documentSnapshots = await receivedQuery.get()
        let documentData = documentSnapshots.docs.map(doc => doc.data())
        console.log("--------------------------------------------------------")
        documentData[0].messages.forEach(Element => {
            console.log(Element)
            arrMsg.push(Element)
        });
        var isEqual = _.isEqual(arrMsg, this.state.messages);
        if (this.state.messages.length === 0)
            this.setState({ messages: arrMsg })
        console.log(isEqual);
        if (!isEqual)
            this.setState({ messages: arrMsg })


        console.log("Aici conteaza", this.state.messages)

        console.log("--------------------------------------------------------")


        

        //    console.log(this.state.messages)

        // or lodash







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
                            <MessageComponent msg={item.msg} date={item.timestamp} sender={'florin salam'}/>
                            
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',

    },
})