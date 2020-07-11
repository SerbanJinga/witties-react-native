import React, { Component } from 'react'
import { View, Clipboard, TouchableOpacity, ActivityIndicator, Dimensions, Alert } from 'react-native'
import { ListItem, Button, Text, Avatar, Divider, Overlay } from 'react-native-elements'
import * as Font from 'expo-font'
import { AntDesign, Entypo } from '@expo/vector-icons'
import AwesomeAlert from 'react-native-awesome-alerts'
import firebase from 'firebase'
import { withNavigation } from 'react-navigation'
import { FlatList } from 'react-native-gesture-handler'
import Toast, { DURATION } from 'react-native-easy-toast'

let chatRoomArr = []

const { width, height } = Dimensions.get('window')
export default class AllChatsComponent extends Component {
    constructor(props){
        super(props)
        this.state = {
            fontsLoaded: false,
            chats: []
        }
    }

   
    componentDidMount = async () => {
        arr = []
        chatRoomArr = []
        await Font.loadAsync({
            font1: require('../../assets/SourceSansPro-Black.ttf')
        })
        this.setState({
            fontsLoaded: true
        })
        await this.retrieveData()
       
    }
    

    retrieveData = async() => {
        let initialQuery = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).get()
        let data = initialQuery.data().chatRoomsIn
        data.forEach(element => this.getChatRoom(element))
    }

    getChatRoom = async(element) => {
        let initialQuery = await firebase.firestore().collection('messages').doc(element).get()
        let data = initialQuery.data().chatRoomName
        let otherData = initialQuery.data().roomId
        let profilePic = initialQuery.data().profilePicture
        let foo = {
            data: data,
            otherData: otherData,
            profilePicture: profilePic
        }

        chatRoomArr.push(foo)
        this.setState({
            chats: chatRoomArr
        })
    }

    render(){
        if(this.state.fontsLoaded){
        return(

            <FlatList
            data = {this.state.chats}
            horizontal={true}
            pagingEnabled={true}
            showsHorizontalScrollIndicator={false}
           renderItem={({item}) => (
           
            
            <TouchableOpacity style={{width: width / 2, height: 40}} onPress={() => this._pressTouchableOpacity()}>
        
        <View style={{flex: 0, padding: 10, width: width, height: 40}}>
            <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
                <Avatar size={40} rounded source={{uri: item.profilePicture}}/>
                <View style={{flex: 0, flexDirection: 'column',}}>
                <Text style={{marginLeft: 4, fontFamily: 'font1'}}>{item.data}</Text>
                </View>
            </View>
            {/* <Divider style={{marginTop: 20}}/> */}

        </View>
        
        
           
                </TouchableOpacity>
           )}

       />
           
        )}else{
            return(<ActivityIndicator size="large"/>)
        }
    }
}


