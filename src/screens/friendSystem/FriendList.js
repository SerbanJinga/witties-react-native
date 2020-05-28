import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, ActivityIndicator, SafeAreaView, Button } from 'react-native'
import { Text, Divider, CheckBox, Input } from 'react-native-elements'
import firebase from 'firebase'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import { Notifications } from 'expo'
import * as Permissions from 'expo-permissions'
import Constants from 'expo-constants';
import ChatRoom from '../../screens/chatRoom/ChatRoom'
import Friend from '../../components/Friend'
const { width, height } = Dimensions.get('window')
import { withNavigation } from 'react-navigation';

let arr = []

 class FriendList extends Component {
    constructor(props){
        super(props)
        this.state = {
            documentData: [],
            friendRequestsReceived: [],
            chatRoomIds: [],
            groupName : ""
        }

        this.addUserToChatRoom = this.addUserToChatRoom.bind(this)
        this.removeUserFromChatRoom = this.removeUserFromChatRoom.bind(this)
    }

    addUserToChatRoom = (uid) => {
        const chatRoomIdsFinal = this.state.chatRoomIds
        chatRoomIdsFinal.push(uid)
        this.setState({chatRoomIds: chatRoomIdsFinal})


    }

    removeUserFromChatRoom = (uid) => {
        let chatRoomIdsFinal = this.state.chatRoomIds
        for(let i = 0; i < chatRoomIdsFinal.length; i++)
            if(chatRoomIdsFinal[i] == uid)
                chatRoomIdsFinal.splice(i, 1)
        this.setState({chatRoomIds: chatRoomIdsFinal})

    }

   

    _retrieveFriends = async() => {
        let initialQuery = await firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid)
        let documentSnapshots = await initialQuery.get()
        let documentData = await documentSnapshots.data().friends
        documentData.forEach(document => this._getUserFromUid(document))

    }


    _getUserFromUid = async(uid) => {
        let initialQuery = await firebase.firestore().collection("users").doc(uid)
        let documentSnapshots = await initialQuery.get()
        let documentData = await documentSnapshots.data()
        arr.push(documentData)
        this.setState({
            documentData: arr
        })

    }

    createChatRoom = () => {
        const uid = firebase.firestore().collection("messages").doc().id
        firebase.firestore().collection("messages").doc(uid).set({
            usersParticipating: this.state.chatRoomIds,
            messages: [],
            roomId: uid,
            chatRoomName: this.state.groupName
        }).then(this.props.navigation.navigate('ChatRoom', {iqdif:this.state.groupName, roomId: uid})).catch(err => console.log(err))
    }


    componentDidMount = async() => {
        this.state.chatRoomIds.push(firebase.auth().currentUser.uid)

        await this._retrieveFriends()
    }

    render(){
        return(
            <View>
                <Text style={{fontSize: 40, textAlign: 'center', marginTop: 20}}>prieteni</Text>
                <Input
                    placeholder="Group Name"
                    returnKeyType="next"
                    textContentType="name"
                    inputContainerStyle={styles.input}
                    value={this.state.groupName}
                    onChangeText={groupName => this.setState({ groupName })}
                />
            <Button
                title="Create Chat"
                onPress={this.createChatRoom}
            />
                <SafeAreaView style={styles.container}>
                <FlatList
                 data = {this.state.documentData}
                    renderItem={({item}) => (
                        <Friend discriminator={item.discriminator} mama={this.addUserToChatRoom} tata={this.removeUserFromChatRoom} profilePicture={item.profilePicture} name={item.displayName} uid={item.uid} />
                    )}   
                keyExtractor={(item, index) => String(index)}
                ListHeaderComponent={this.renderHeader}
                ListFooterComponent={this.renderFooter}
                onEndReached={this.retrieveMore}
                onEndReachedThreshold={0}
                refreshing={this.state.refreshing}
                />
            </SafeAreaView>
            </View>
        )
    }
    
  
}

export default withNavigation(FriendList)

const styles = StyleSheet.create({
  container: {
    height: height,
    width: width,
  },
  headerText: {
    fontFamily: 'System',
    fontSize: 36,
    fontWeight: '600',
    color: '#000',
    marginLeft: 12,
    marginBottom: 12,
  },
  itemContainer: {
    width: width,
    borderWidth: 10,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '400',
    color: '#000',
  },
});

