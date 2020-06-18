import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions, Alert } from 'react-native'
import { ListItem, Button, Text, Avatar, Divider, Overlay } from 'react-native-elements'
import * as Font from 'expo-font'
import { AntDesign, Entypo } from '@expo/vector-icons'
import AwesomeAlert from 'react-native-awesome-alerts'
import firebase from 'firebase'
import { withNavigation } from 'react-navigation'
import { FlatList } from 'react-native-gesture-handler'
let twoUserArr = []
let arr = []
let finalArr = []

const { width, height } = Dimensions.get('window')
 class AllFriendsComponent extends Component {
    constructor(props){
        super(props)
        this.state = {
            fontsLoaded: false,
            overlayOpened: false,
            showFullProfile: false,
            options: false,
            blockAlert: false,
            removeAlert: false,
            suggestedFriends: []
        }
    }

    _retrieveSuggestedFriends = async () => {
        const func = firebase.functions().httpsCallable('recommendedFriends')
        func({uid: this.props.uid}).then(res => this.setState({
            suggestedFriends: res.data.documentData
        }))
    }


    showBlockAlert = (name, uid) => {
        Alert.alert(
            `Block ${name}?`,
            "You can not turn back.",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log('nimic '),
                    style: 'cancel'
                },
                {
                    text: "Block",
                    onPress: () => this.blockUser(uid),
                    style: 'destructive'
                }
            ],
            {cancelable: 'false'}
        )
    }

    blockUser = (uid) => {
        console.log('se va elimina ' + uid)
        firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({
            friends: firebase.firestore.FieldValue.arrayRemove(uid)
        })
        firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({
            blockedFriends: firebase.firestore.FieldValue.arrayUnion(uid)
        })
    }

    

    showRemoveAlert = (name, uid) => {
        Alert.alert(
            `Remove ${name}?`,
            "You can not turn back.",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log('nimic '),
                    style: 'cancel'
                },
                {
                    text: "Remove",
                    onPress: () => this.removeUser(uid),
                    style: 'destructive'
                }
            ],
            {cancelable: 'false'}
        )
    }

    removeUser = (uid) => {
        firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({
            friends: firebase.firestore.FieldValue.arrayRemove(uid)
        })
    }

    hideRemoveAlert = () => {
        this.setState({
            removeAlert: false
        })
    }

    componentDidMount = async () => {
        await Font.loadAsync({
            font1: require('../../../assets/SourceSansPro-Black.ttf')
        }).then(this.setState({
            fontsLoaded: true
        }))
        await this._retrieveSuggestedFriends()
    }
    _pressTouchableOpacity = () => {
        this.setState({
            overlayOpened: true
        })
    }
    _closeFriendOverlay = () => {
        this.setState({
            overlayOpened: false
        })
    }

    _openProfileDetails = () => {
        this.setState({
            showFullProfile: true
        })
    }

    _closeProfileDetails = () => {
        this.setState({
            showFullProfile: false
        })
    }
    
    _openOptions = () => {
        this.setState({
            options: true
        })
    }
    _closeOptions = () => {
        this.setState({
            options: false
        })
    }

    sendMessage = async(uid, profilePicture, name) => {
        
        twoUserArr.push(firebase.auth().currentUser.uid)
        twoUserArr.push(uid)
        const roomId = firebase.auth().currentUser.uid + "_" + uid
        let initialQuery = await firebase.firestore().collection("messages").doc(roomId)
        let initalSnapshots = await initialQuery.get()
        if(!initalSnapshots.exists){
        firebase.firestore().collection("messages").doc(roomId).set({
            chatRoomName: name,
            messages: [],
            profilePicture: profilePicture,
            roomId: roomId,
            usersParticipating: twoUserArr
        })
        firebase.firestore().collection("users").doc(uid).update({
            chatRoomsIn: firebase.firestore.FieldValue.arrayUnion(roomId)
        })
        
        firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
            chatRoomsIn: firebase.firestore.FieldValue.arrayUnion(roomId)
        })
        this._closeFriendOverlay()
        this.props.close()
        this.props.navigation.navigate("ChatRoom", { iqdif: name, roomId: roomId, profilePicture: profilePicture})
        }else{
            this._closeFriendOverlay()
            this.props.close()            
            this.props.navigation.navigate("ChatRoom", { iqdif: name, roomId: roomId, profilePicture: profilePicture})
                
        }
    }
    render(){
        if(this.state.fontsLoaded){
        return(
           
            <TouchableOpacity onPress={() => this._pressTouchableOpacity()}>
        
        <View style={{flex: 1, padding: 10}}>
            <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
                <Avatar size={40} rounded source={{uri: this.props.profilePicture}}/>
                <View style={{flex: 1, flexDirection: 'column',}}>
                <Text style={{marginLeft: 4, fontFamily: 'font1'}}>{this.props.displayName}</Text>
                <Text style={{fontFamily: 'font1', marginLeft: 4}}>#{this.props.discriminator}</Text>
                </View>
            </View>
            <Divider style={{marginTop: 20}}/>

        </View>
        <Overlay animationType='fade' onBackdropPress={() => this._closeFriendOverlay()} isVisible={this.state.overlayOpened} overlayStyle={{width: width, borderRadius: '10', position: 'absolute', bottom: 0}}>
                <View style={{flex: 1}}>
                    <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
                        <Avatar size={40} source={{uri: this.props.profilePicture}} rounded/>
                            <TouchableOpacity onPress={() => this._openProfileDetails()}>

                                    <View style={{flex: 0, alignItems: 'center'}}>
                                        <Text style={{fontFamily: 'font1', marginLeft: 6, fontSize: 18}}>{this.props.displayName}#{this.props.discriminator}</Text>
                                        <View style={{flex: 0, flexDirection: 'row', alignItems: 'center', alignContent: 'center'}}>
                                            <Text style={{color: '#b2b8c2', fontFamily: 'font2', fontSize: 16, marginLeft: 6}}>View Profile</Text>
                                            <AntDesign
                                                style={{marginTop: 2, marginLeft: 4}}
                                                size={15}
                                                name="right"
                                                color="#b2b8c2"
                                            />
                                        </View>
                                    </View>

                            </TouchableOpacity>
                    </View>
                   
                    <Divider style={{marginTop: 10}}/>

                    <TouchableOpacity style={{padding: 10}} onPress={() => this.sendMessage(this.props.uid, this.props.profilePicture, this.props.displayName)}>
                        <Text style={{fontFamily: 'font1', fontSize: 18}}>Send Message</Text>
                    </TouchableOpacity>
                    <Divider/>
                    <TouchableOpacity style={{padding: 10}}>
                        <Text style={{fontFamily: 'font1', fontSize: 18}}>Copy Username</Text>
                    </TouchableOpacity>
                    <Divider style={{marginTop: 0}}/>
                    <TouchableOpacity style={{padding: 10}} onPress={() => this.showRemoveAlert(this.props.displayName, this.props.uid)}>
                        <Text style={{fontFamily: 'font1', fontSize: 18, color: 'red'}}>Remove Friend</Text>
                    </TouchableOpacity>
                    
                    <Divider style={{marginTop: 0}}/>
                    <TouchableOpacity style={{padding: 10}} onPress= {() => this.showBlockAlert(this.props.displayName, this.props.uid)}>
                        <Text style={{fontFamily: 'font1', fontSize: 18, color: 'red'}}>Block Friend</Text>
                    </TouchableOpacity>

                    <Divider style={{marginTop: 0}}/>
                    
                    <TouchableOpacity style={{padding: 10}}>
                        <Text style={{fontFamily: 'font1', fontSize: 18, color: '#b2b8c2', alignSelf: 'center'}}>Done</Text>
                    </TouchableOpacity>

                    
                   
                </View>
                <Overlay overlayStyle={{width: width, height: height}} animationType="slide" isVisible={this.state.showFullProfile}>
            <View style={{flex: 1}}>
                <View style={{flex: 0, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TouchableOpacity onPress={() => this._closeProfileDetails()}>
                    <AntDesign
                        size={26}
                        name="down"
                        color="#b2b8c2"
                    />
                    </TouchableOpacity>
                    <Text style={{fontFamily: 'font1', fontSize: 20}}>{this.props.displayName}</Text>
                    <TouchableOpacity onPress={() => this._openOptions()}>
                    <AntDesign
                        size={26}
                        name="bars"
                        color="#b2b8c2"
                    />
                    </TouchableOpacity>
                </View>
                <View style={{flex: 0, alignItems: 'center', marginTop: 40}}>
                    <Avatar size={100} source={{uri: this.props.profilePicture}} rounded/>
                    <View style={{flex: 0, flexDirection: 'row', marginTop: 20}}>
                <Text style={{fontFamily: "font1", fontSize: 15}}>{this.props.displayName}#{this.props.discriminator}</Text>
                <Entypo name="dot-single" style={{marginTop: 4, marginHorizontal: 4}}/>
                <Text style={{fontFamily: "font1", fontSize: 15}}>{this.props.careScore}</Text>
                </View>
                <Button style={{marginTop: 40}} titleStyle={{fontFamily: 'font1'}} title="Add Friend" type="clear"/>

                </View>
                <Text style={{fontSize: 20, fontFamily: 'font1', marginTop: 20}}>Suggested Friends</Text>
                <FlatList
                    data={this.state.suggestedFriends}
                    renderItem={({item}) => (
                        <Text>{item}</Text>
                    )}   
                keyExtractor={(item, index) => String(index)}
                />
            </View>
            <Overlay animationType='fade' onBackdropPress={() => this._closeOptions()} isVisible={this.state.options} overlayStyle={{width: width, borderRadius: '10', position: 'absolute', bottom: 0}}>
                <View style={{flex: 1}}>
                    <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
                        <Avatar size={40} source={{uri: this.props.profilePicture}} rounded/>
                            <TouchableOpacity onPress={() => this._openProfileDetails()}>

                                    <View style={{flex: 0, alignItems: 'center'}}>
                                        <Text style={{fontFamily: 'font1', marginLeft: 6, fontSize: 18}}>{this.props.displayName}#{this.props.discriminator}</Text>
                                        <View style={{flex: 0, flexDirection: 'row', alignItems: 'center', alignContent: 'center'}}>
                                            <Text style={{color: '#b2b8c2', fontFamily: 'font2', fontSize: 16, marginLeft: 6}}>View Profile</Text>
                                            <AntDesign
                                                style={{marginTop: 2, marginLeft: 4}}
                                                size={15}
                                                name="right"
                                                color="#b2b8c2"
                                            />
                                        </View>
                                    </View>

                            </TouchableOpacity>
                    </View>
                    <Divider style={{marginTop: 10}}/>
                    <TouchableOpacity style={{padding: 10}}>
                        <Text style={{fontFamily: 'font1', fontSize: 18}}>Accept Friend</Text>
                    </TouchableOpacity>
                    <Divider style={{marginTop: 0}}/>

                    <TouchableOpacity style={{padding: 10, paddingBottom: 20}}>
                        <Text style={{fontFamily: 'font1', fontSize: 18}}>Copy Username</Text>
                    </TouchableOpacity>
                    <Divider style={{marginTop: 0}}/>
                    <TouchableOpacity style={{padding: 10}} >
                        <Text style={{fontFamily: 'font1', fontSize: 18, color: 'red'}}>Block User</Text>
                    </TouchableOpacity>
                    <Divider style={{marginTop: 0}}/>
                    
                    <TouchableOpacity style={{padding: 10}}>
                        <Text style={{fontFamily: 'font1', fontSize: 18, color: '#b2b8c2', alignSelf: 'center'}}>Done</Text>
                    </TouchableOpacity>
                    
                   
                </View>
                </Overlay>
        </Overlay>
        
        </Overlay>
           
                </TouchableOpacity>
        )}else{
            return(<ActivityIndicator size="large"/>)
        }
    }
}


export default withNavigation(AllFriendsComponent)