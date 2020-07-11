import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, TouchableOpacity, Alert, Clipboard } from 'react-native'
import { ListItem, Button, Text, Avatar, Divider } from 'react-native-elements'
import { Overlay } from 'react-native-elements'
import * as Font from 'expo-font'
import { AntDesign, Entypo } from '@expo/vector-icons'
import FullProfile from './FullProfile'
import firebase from 'firebase'
import Toast, { DURATION } from 'react-native-easy-toast'

const { width, height } = Dimensions.get('window')

export default class AddFriend extends Component {
    constructor(props){
        super(props)
        this.state = {
            fontsLoaded: false,
            overlayOpened: false,
            showFullProfile: false,
            buttonTitle: "Add Friend"
        }
    }

    componentDidMount = async () =>{
        await Font.loadAsync({
            font1: require('../../../assets/SourceSansPro-Black.ttf'),
            font2 : require('../../../assets/SourceSansPro-Regular.ttf')
        })
        this.setState({
            fontsLoaded: true
        })
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

    _openFriendOverlay = (uid) => {
        
    }

    _openProfileDetails = () => {
        this.setState({
            showFullProfile: true,
            overlayOpened: false
        })
    }
    _closeProfileDetails = () => {
        this.setState({
            showFullProfile: false
        })
    }

    addFriendProps = (name, uid) => {
        if(this.state.buttonTitle === 'Add Friend'){
            this.props.press()
            this.setState({
                buttonTitle: 'Added'
            })
        }else{
            
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
                        onPress: () => this.removeFriendRequest(uid),
                        style: 'destructive'
                    }
                ],
                {cancelable: 'false'}
            )        }
    }

    removeFriendRequest = (uid) => {
        firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({
            sentRequests: firebase.firestore.FieldValue.arrayRemove(uid)
        })

        firebase.firestore().collection('users').doc(uid).update({
            receivedRequests: firebase.firestore.FieldValue.arrayRemove(firebase.auth().currentUser.uid)
        })
        this.setState({
            buttonTitle: "Add Friend"
        })
    }

    _copyToClipboard = (name, discriminator) => {
        let string = name + "#" + discriminator
        console.log('ai copiat ', string)
        Clipboard.setString(string)
        this.refs.copyToClipboard.show('Copied!')
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
        firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({
            blockedUsers: firebase.firestore.FieldValue.arrayUnion(uid)
        })

        firebase.firestore().collection('users').doc(uid).update({
            blockedBy: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.uid)
        })
    }

    render(){
        return(
            <TouchableOpacity onPress={() => this._pressTouchableOpacity()}>
        
            <View style={{flex: 1, padding: 10}}>
                <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
                    <Avatar size={40} rounded source={{uri: this.props.profilePicture}}/>
                    <View style={{flex: 1, flexDirection: 'column',}}>
                    <Text style={{marginLeft: 4, fontFamily: 'font1'}}>{this.props.displayName}</Text>
                    <Text style={{fontFamily: 'font1', marginLeft: 4}}>#{this.props.discriminator}</Text>
                    </View>
                <Button title={this.state.buttonTitle} type="clear" titleStyle={{fontFamily: 'font1'}} onPress={() => this.addFriendProps(this.props.displayName, this.props.uid)}/>
                </View>
                <Divider style={{marginTop: 20}}/>

            </View>
            <Overlay animationType='fade' onBackdropPress={() => this._closeFriendOverlay()} isVisible={this.state.overlayOpened} overlayStyle={{width: width, borderRadius: 10, position: 'absolute', bottom: 0}}>
                <View style={{flex: 1}}>
                    <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
                        <Avatar size={40} source={{uri: this.props.profilePicture}} rounded/>
                            <TouchableOpacity onPress={() => this._openProfileDetails()}>

                                    <View style={{flex: 0, alignItems: 'center'}}>
                                        <Text style={{fontFamily: 'font1', marginLeft: 6, fontSize: 18}}>{this.props.displayName}#{this.props.discriminator}</Text>
                                        <View style={{flex: 0, flexDirection: 'row', alignItems: 'center', alignContent: 'center'}}>
                                            <Text style={{color: '#b2b8c2', fontFamily: 'font2', fontSize: 16}}>View Profile</Text>
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
                    <TouchableOpacity style={{padding: 10}} onPress={() => this.addFriendProps(this.props.displayName, this.props.uid)}>
                        <Text style={{fontFamily: 'font1', fontSize: 18}}>{this.state.buttonTitle}</Text>
                    </TouchableOpacity>
                    <Divider style={{marginTop: 0}}/>

                    <TouchableOpacity style={{padding: 10, paddingBottom: 20}} onPress={() => this._copyToClipboard(this.props.displayName, this.props.discriminator)}>
                        <Text style={{fontFamily: 'font1', fontSize: 18}}>Copy Username</Text>

                    </TouchableOpacity>
                    <Divider style={{marginTop: 0}}/>
                    <TouchableOpacity style={{padding: 10}} onPress={() => this.showBlockAlert(this.props.displayName, this.props.uid)}>
                        <Text style={{fontFamily: 'font1', fontSize: 18, color: 'red'}}>Block User</Text>
                    </TouchableOpacity>
                    <Divider style={{marginTop: 0}}/>
                    
                    <TouchableOpacity style={{padding: 10}} onPress={() => this._closeFriendOverlay()}>
                        <Text style={{fontFamily: 'font1', fontSize: 18, color: '#b2b8c2', alignSelf: 'center'}}>Done</Text>
                    </TouchableOpacity>
                 
                   
                </View>

                <Toast
                    ref="copyToClipboard"
                    position="bottom"
                    style={{backgroundColor: '#4BB543'}}
                    textStyle={{color: '#fff'}}
                    position='top'
                    positionValue={110}
                    opacity={0.8}
                    fadeInDuration={750}
                />                
                
        </Overlay>


        <Overlay fullScreen animationType="slide" isVisible={this.state.showFullProfile}>
           <FullProfile addFriend={()=> this.props.press()} displayName={this.props.displayName} discriminator={this.props.discriminator} careScore={this.props.careScore} profilePicture={this.props.profilePicture} close={() => this._closeProfileDetails()} uid={this.props.uid}/>
        </Overlay>

            </TouchableOpacity>                

)
    }
}


