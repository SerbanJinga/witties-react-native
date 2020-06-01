import React, { Component } from 'react'
import { Text, Input, Button, Icon, Divider, Header } from 'react-native-elements'
import { Platform, KeyboardAvoidingView, View, StyleSheet, Dimensions, FlatList, Keyboard, TouchableWithoutFeedback, ScrollView, SafeAreaView } from 'react-native'
import MessageComponent from '../chatRoom/MessageComponent'
import firebase from 'firebase'

import _ from "lodash"
import { withNavigation } from 'react-navigation'
import ChatRoomPost from './ChatRoomPost'
const arr = []
const self = this;

require('firebase/functions')
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const { width, height } = Dimensions.get('window')
const { width2, height2 } = Dimensions.get("screen")
class ChatRoom extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //tu esti 
            currentUser: firebase.auth().currentUser.uid,
            //cu asta vorbesti acum 
            roomId: props.navigation.state.params.roomId,
            // roomId: 'qqKiPxB3zeFZA6Uhsd2B',
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
        let aru = []
        aru = this.state.messages
        aru.push(newMessage)
        this.setState({ message: aru })



        //seteaza in baza de date
        firebase.firestore().collection("messages").doc(this.state.roomId).update({
            messages: firebase.firestore.FieldValue.arrayUnion(newMessage)
        })
    }

    componentDidMount() {
        this.retrieveData()

    }

    renderHeader() {
        return (<View>
            <Text>TIMELINE</Text>
            <Divider />
        </View>)
    }


    retrieveData = async () => {
        let arrMsg = [];
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

        arrMsg = arrMsg.reverse()
        this.setState({
            messages: arrMsg
        })
    }


    render() {
        return (
            <View style={styles.container}>
                
                
                    <Input
                        placeholder={"scrie un mesaj " + "Mihaitza Piticu" + '!'}
                        placeholderTextColor="#B1B1B1"
                        returnKeyType="done"
                        textContentType="newPassword"
                        rightIcon={<Icon type='ionicon' name='ios-send' size={30} onPress={() => {
                            if (this.state.currentMessage != "")
                                this.createMessage(this.state.currentMessage)
                            this.setState({ currentMessage: '' })
                        }} />}
                        containerStyle={{position:'absolute',bottom:10, }}
                        inputContainerStyle={{ paddingHorizontal: 15, borderWidth: 1, borderColor: "black", borderRadius: 30, height: 50}}
                        value={this.state.currentMessage}
                        onChangeText={currentMessage => this.setState({ currentMessage })}
                        renderErrorMessage={false}
                    />
                
                
                <FlatList
                    inverted
                    data={this.state.messages}
                    renderItem={({ item }) => (
                        <View>
                            {(typeof (item.location) === 'undefined') ? <MessageComponent msg={item.msg} date={item.timestamp} sender={item.sender} /> :
                                                <ChatRoomPost
                                                    postedFor={item.hoursPosted}
                                                    activity={item.activity}
                                                    mood={item.mood}
                                                    text={item.text}
                                                    creatorId={item.creatorId}
                                                    timestamp={item.timestamp}
                                                    image={item.image} />}
                            {/* <MessageComponent msg={item.msg} date={item.timestamp} sender={item.sender} /> */}
                        </View>
                    )}
                    keyExtractor={(item, index) => String(index)}
                    ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={this.Renderpizdamatii}
                    onEndReached={this.retrieveMore}
                    onEndReachedThreshold={0}
                    refreshing={this.state.refreshing}
                    renderHeader={this.renderHeader}
                    style={{position:'absolute',top:0,bottom:65,left:5,right:5}}
                />
                </View>
                


            

            // <SafeAreaView>
            //     <KeyboardAvoidingView
            //         behavior="position"
            //         style={styles.container}>

            //         <View style={styles.container}>

            //             <View style={{ width: width, height: height - 100 }}>

            //                 <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

            //                     <FlatList
            //                         data={this.state.messages}
            //                         renderItem={({ item }) => (
            //                             <View>
            //                                 {/* {(typeof (item.location) === 'undefined') ? <MessageComponent msg={item.msg} date={item.timestamp} sender={item.sender} /> :
            //                                     <ChatRoomPost
            //                                         postedFor={item.hoursPosted}
            //                                         activity={item.activity}
            //                                         mood={item.mood}
            //                                         text={item.text}
            //                                         creatorId={item.creatorId}
            //                                         timestamp={item.timestamp}
            //                                         image={item.image} />} */}
            //                                         <MessageComponent msg={item.msg} date={item.timestamp} sender={item.sender} />
            //                             </View>
            //                         )}
            //                         keyExtractor={(item, index) => String(index)}
            //                         ListHeaderComponent={this.renderHeader}
            //                         ListFooterComponent={this.renderFooter}
            //                         onEndReached={this.retrieveMore}
            //                         onEndReachedThreshold={0}
            //                         refreshing={this.state.refreshing}
            //                         renderHeader={this.renderHeader}


            //                     />
            //                 </TouchableWithoutFeedback>
            //                 <View style={{ paddingTop: 5 }}>
            //                     <Input

            //                         placeholder={"scrie un mesaj " + "Mihaitza Piticu" + '!'}
            //                         placeholderTextColor="#B1B1B1"
            //                         returnKeyType="done"
            //                         textContentType="newPassword"
            //                         rightIcon={<Icon type='ionicon' name='ios-send' size={30} onPress={() => {
            //                             if (this.state.currentMessage != "")
            //                                 this.createMessage(this.state.currentMessage)
            //                             this.setState({ currentMessage: '' })
            //                         }} />}
            //                         containerStyle={{ height: 0 }}
            //                         inputContainerStyle={{ paddingHorizontal: 15, borderWidth: 1, borderColor: "black", borderRadius: 30, height: 50 }}

            //                         value={this.state.currentMessage}
            //                         onChangeText={currentMessage => this.setState({ currentMessage })}
            //                         renderErrorMessage={false}
            //                     />
            //                 </View>
            //             </View>
            //         </View>

            //     </KeyboardAvoidingView>
            // </SafeAreaView>
        )


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