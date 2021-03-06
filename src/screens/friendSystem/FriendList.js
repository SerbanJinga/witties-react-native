import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, ActivityIndicator, SafeAreaView, TouchableOpacity, Alert } from 'react-native'
import { Text, Divider, CheckBox, Input, Overlay, Avatar } from 'react-native-elements'
import firebase from 'firebase'
import { FlatList,  } from 'react-native-gesture-handler'
import * as Permissions from 'expo-permissions'
import Constants from 'expo-constants';
import ChatRoom from '../../screens/chatRoom/ChatRoom'
import Friend from '../../components/Friend'
const { width, height } = Dimensions.get('window')
import { withNavigation } from 'react-navigation';
import { MaterialIcons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import Toast from 'react-native-toast-message'
let arr = []
let twoUserArr = []
let roomArrId = []

 class FriendList extends Component {
    constructor(props){
        super(props)
        this.state = {
            documentData: [],
            friendRequestsReceived: [],
            chatRoomIds: [],
            groupName : "",
            nextOverlay: false,
            imageUri: "",
            roomId: "",
            display: 'none'
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

    create = () => {
        if(this.state.groupName.trim().length <= 2 || !this.state.groupName.replace((/\s/g, '')).length){
            Alert.alert('Group names must be at least 2 characters long.')
            return
        }
    const uid = firebase.firestore().collection("messages").doc().id
    
        
        firebase.firestore().collection("messages").doc(uid).set({
            usersParticipating: this.state.chatRoomIds,
            messages: [],
            roomId: uid,
            chatRoomName: this.state.groupName,
            profilePicture: "http://www.gstatic.com/images/icons/material/system/2x/photo_camera_grey600_24dp.png",
            lastUpdated: Date.now(),
            groupScore: 0,
            twoUserChat: false,
            userWhoCreated: firebase.auth().currentUser.uid
        }).then(this.uploadToStorage(uid))
        this.state.chatRoomIds.forEach(id => {
            firebase.firestore().collection("users").doc(id).update({
                chatRoomsIn: firebase.firestore.FieldValue.arrayUnion(uid)
            })
        })
        firebase.firestore().collection("messages").doc(uid).collection('chats').add({
            msg: "This is the beggining of the conversation. Send a message.",
            timestamp: Date.now(),
            sender: 'alkdaldka'
        })
        this.setState({
            nextOverlay: false,
        })
        // this.props.navigation.navigate('Home')
        this.props.close()
    }

    createChatRoom = () => {
        if(this.state.chatRoomIds.length === 1){
            Alert.alert('You have not selected at least one friend!')
            return
        }
        this.setState({
            nextOverlay: true
        })
    }

    closeOverlay = () => {
        this.setState({
            nextOverlay: false
        })
    }

    onAvatarPress = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3]
        })

        if(!result.cancelled){
            this.setState({
                imageUri: result.uri
            })
        }
    }

    uploadToStorage = async (uid) => {
        const path = `messages/profile-picture/${uid}`
        const response = await fetch(this.state.imageUri)
        const file = await response.blob()
    
        let upload = firebase.storage().ref(path).put(file)
        upload.on("state_changed", snapshot => {}, err => {
            console.log(err)
        },
        async () => {
            const url = await upload.snapshot.ref.getDownloadURL()
            console.log(url)
            this.setState({imageUri: url})
            this._uploadToFirestore(url, uid)
        })
    }
    _uploadToFirestore = (url, uid) => {
        firebase.firestore().collection("messages").doc(uid).update({
            profilePicture: url
        })
    }


    componentDidMount = async() => {
        twoUserArr = []
        arr = []
        this.state.chatRoomIds.push(firebase.auth().currentUser.uid)

        await this._retrieveFriends()
    }
    renderDisplay = () => {
        if(this.state.chatRoomIds.length !== 0){
            this.setState({
                display: 'flex'
            })
        }
    }

    // componentDidUpdate = () => {
    //     this.renderDisplay()
    // }

    press = async(uid, profilePicture, name) => {
        roomArrId = []
        twoUserArr.push(firebase.auth().currentUser.uid)
        twoUserArr.push(uid)

        roomArrId.push(firebase.auth().currentUser.uid)
        roomArrId.push(uid)
        roomArrId.sort()
        let roomId = "";
        roomArrId.forEach(room => {
            roomId += room
        })
        // const roomId = firebase.auth().currentUser.uid + "_" + uid
        let initialQuery = await firebase.firestore().collection("messages").doc(roomId)
        let initalSnapshots = await initialQuery.get()
        if(!initalSnapshots.exists){
        firebase.firestore().collection("messages").doc(roomId).set({
            chatRoomName: name,
            messages: [],
            profilePicture: profilePicture,
            roomId: roomId,
            otherUser: uid,
            usersParticipating: twoUserArr,
            userWhoCreated: firebase.auth().currentUser.uid,
            twoUserChat: true,
            groupScore: 0
        })
        firebase.firestore().collection("users").doc(uid).update({
            chatRoomsIn: firebase.firestore.FieldValue.arrayUnion(roomId)
        })
        
        firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
            chatRoomsIn: firebase.firestore.FieldValue.arrayUnion(roomId)
        })
        this.props.close()
        this.props.navigation.navigate("ChatRoom", { iqdif: name, roomId: roomId, profilePicture: profilePicture})
        }else{
            this.props.close()
            this.props.navigation.navigate("ChatRoom", { iqdif: name, roomId: roomId, profilePicture: profilePicture})
                
        }
    }
    render(){
        return(
            <SafeAreaView style={{flex: 1, flexDirection: 'column'}}>

                <SafeAreaView style={{flex: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20}}>
                <TouchableOpacity
                        onPress={()=> this.props.close()}
                                style={{
                                    alignSelf: 'flex-end',
                                    alignItems: 'center',
                                    backgroundColor: 'transparent',                  
                                }}>
                            <AntDesign
                                name="close"
                                size={20}

                            />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.createChatRoom}>
                            <Text style={{fontSize: 18, fontFamily: 'font1', marginLeft: 4, opacity: 20}}>Next</Text>
                            </TouchableOpacity>
                </SafeAreaView>
                
            
                <View style={styles.container}>
                {this.state.documentData.length === 0 ? <Text onPress={() => {this.props.close()
                this.props.addFriends()}} style={{marginTop: 40, fontFamily: 'font1', fontSize: 15, margin: 4, alignSelf: 'center'}}>You currently have no Friends. Add More!</Text> : 
                <FlatList
                 data = {this.state.documentData}
                    renderItem={({item}) => (
                        <Friend press={() => this.state.chatRoomIds.length > 1 ? console.log('da') : this.press(item.uid, item.profilePicture, item.displayName)} discriminator={item.discriminator} mama={this.addUserToChatRoom} tata={this.removeUserFromChatRoom} profilePicture={item.profilePicture} displayName={item.displayName} uid={item.uid} />
                    )}   
                keyExtractor={(item, index) => String(index)}
                ListHeaderComponent={this.renderHeader}
                ListFooterComponent={this.renderFooter}
                onEndReached={this.retrieveMore}
                onEndReachedThreshold={0}
                refreshing={this.state.refreshing}
                />}
            </View>

            <Overlay fullScreen animationType="fade" isVisible={this.state.nextOverlay}>

                    <SafeAreaView style={{flex: 1, flexDirection: 'column'}}>
                    <View style={{flex: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <TouchableOpacity
                        onPress={()=> this.closeOverlay()}
                                style={{
                                    alignSelf: 'flex-end',
                                    alignItems: 'center',
                                    backgroundColor: 'transparent',                  
                                }}>
                            <MaterialCommunityIcons
                                name="arrow-left"
                                style={{ color: "#000", fontSize: 30}}
                                
                            />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.create}>
                            <Text style={{fontSize: 18, fontFamily: 'font1', marginLeft: 4}}>Create </Text>
                            </TouchableOpacity>
                </View>
                        <View style={{flex: 1, flexDirection: 'row', padding: 20}}>
                        <Avatar source={{uri: this.state.imageUri === '' ? 'http://www.gstatic.com/images/icons/material/system/2x/photo_camera_grey600_24dp.png' : this.state.imageUri}} size={50} rounded onPress={()=>this.onAvatarPress()}/>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                        <Divider/>
                        <Input
                            
                            placeholder="Group Name"
                            returnKeyType="next"
                            textContentType="name"
                            containerStyle={{borderWidth: 0, borderColor: '#fff'}}
                            style={{borderWidth: 0, borderColor: '#fff'}}
                            inputStyle={{borderWidth: 0, borderColor: '#fff'}}
                            inputContainerStyle={{borderWidth: 0, borderColor: '#fff'}}
                            value={this.state.groupName}
                            onChangeText={groupName => this.setState({ groupName })}
                        />
                        <Divider/>
                        </View>
                        </View>
                    </SafeAreaView>
            </Overlay>
            </SafeAreaView>
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

