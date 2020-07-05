import React, { Component } from 'react'
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, FlatList, ScrollView } from 'react-native'
import {SearchBar} from 'react-native-elements'
import { AntDesign } from '@expo/vector-icons'
import firebase from 'firebase'
import SendTo from './SendTo'
import { withNavigation } from 'react-navigation'
const {width, height} = Dimensions.get('window')
let arr = []

 class SendToList extends Component{
    constructor(props){
        super(props)
        this.state = {
            documentData: [],
            sendTo: [],
            imageUri: ""
        }
    }


    _retrieveData = async () => {
        const currentUid = firebase.auth().currentUser.uid
        let initialQuery = await firebase.firestore().collection('users').doc(currentUid).get()
        let documentData = await initialQuery.data().chatRoomsIn
        documentData.forEach(document => this._retrieveDataFromChatRoomId(document))
    }

    _retrieveDataFromChatRoomId = async(document) => {
        let initialQuery = await firebase.firestore().collection('messages').doc(document).get()
        let documentData = await initialQuery.data()
        arr.push(documentData)
        this.setState({
            documentData: arr
        })
        // console.log(this.state.documentData)

    }

    componentDidMount = async () => {
        if(this.props.video === true){
            console.log('bravo,')
        }else{
            console.log('e poza,')
        }
        arr = []
        await this._retrieveData()
        // console.log(this.props.image)

    }

    mama = (uid) => {
        const sendToFinal = this.state.sendTo
        sendToFinal.push(uid)
        this.setState({
            sendTo: sendToFinal
        })
        // console.log(this.state.sendTo)

    }   

    tata = (uid) => {
        let sendToFinal = this.state.sendTo
        for(let i = 0; i < sendToFinal.length; i++)
            if(sendToFinal[i] == uid)
                sendToFinal.splice(i, 1)
        this.setState({
            sendTo: sendToFinal
        })

        // console.log(this.state.sendTo)
    }

    uploadVideo = async() => {
        const timestamp = firebase.auth().currentUser.uid + "/" + Date.now()
        const path = `videos/${timestamp}`
        const response = await fetch(this.props.videoFile)
        const file = await response.blob()

        let upload = firebase.storage().ref(path).put(file)
        upload.on("state_changed", snapshot => {}, err => {
            console.log(arr)
        },
        async () => {
            const url = await upload.snapshot.ref.getDownloadURL()
            this.setState({imageUri: url})
            
            this.sendPost()

        })

    }

    uploadPhoto = async() => {
        const timestamp = firebase.auth().currentUser.uid + "/" + Date.now()
        const path = `photos/${timestamp}`
        const response = await fetch(this.props.image)
        const file = await response.blob()
        let upload = firebase.storage().ref(path).put(file)
        upload.on("state_changed", snapshot => {}, err => {
            
        }, async () => {
            const url = await upload.snapshot.ref.getDownloadURL()
            this.setState({
                imageUri: url
            })
            this.upload()
        })
    }


    sendPost = () => {
        let foo = {
            video: this.state.imageUri,
            timestamp: Date.now(),
            mood: this.props.mood,
            text: this.props.text,
            activity: this.props.activity,
            timestamp: Date.now(),
            hoursPosted: this.props.hoursPosted,
            location: this.props.location,
            creatorId: this.props.creatorId,
            taggedUsers: this.props.taggedUsers,
            albums: []
        }
        this.state.sendTo.forEach(chatRoom => {
            firebase.firestore().collection('messages').doc(chatRoom).update({
                messages: firebase.firestore.FieldValue.arrayUnion(foo)
            })
        })
        this.props.close()
        this.props.closeEvery()
    }

    decideUpload = () => {
        if(this.props.video){
            this.uploadVideo()
        }else{
            this.uploadPhoto()
        }
    }


    upload = () => {
        let foo = {
            mood: this.props.mood,
            text: this.props.text,
            activity: this.props.activity,
            image: this.state.imageUri,
            timestamp: Date.now(),
            hoursPosted: this.props.hoursPosted,
            location: this.props.location,
            creatorId: this.props.creatorId,
            taggedUsers: this.props.taggedUsers,
            albums: []
        }
        this.state.sendTo.forEach(chatRoom => {
            firebase.firestore().collection('messages').doc(chatRoom).update({
                messages: firebase.firestore.FieldValue.arrayUnion(foo)
            })
        })
        this.props.close()
        this.props.closeEvery()
    }


    render(){
        return(
            <ScrollView style={{flex: 1, flexDirection: 'column'}}>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start'}}>
            <View style={{flex: 0, flexDirection: 'row', alignItems: 'center', alignContent: 'center'}}>  
            <TouchableOpacity onPress={() => this.props.close()}>
            <AntDesign name="close" size={20}/>
        </TouchableOpacity>
          <SearchBar round placeholder="Search" style={{fontFamily: 'font1', padding: 20}} lightTheme inputStyle={{fontFamily: 'font1'}} placeholderTextColor="#ecedef" containerStyle={{
                    backgroundColor:"#fff",
                    borderBottomColor: '#ecedef',
                    borderTopColor: '#ecedef',
                    borderLeftColor: '#ecedef',
                    borderRightColor: '#ecedef',
                    borderWidth: 1,
                    borderRadius: 10,
                    margin: 10,
                    width: width / 1.3
                }}  inputContainerStyle={{backgroundColor: '#fff', height: 30}} value={this.state.searchText} onChangeText={this.search} />
        <TouchableOpacity onPress={() => this.decideUpload()}>
            <AntDesign name="arrowright" size={20}/>
        </TouchableOpacity>

       </View>
       </View>

            <FlatList
                data={this.state.documentData}
            renderItem={({item}) => (
                <SendTo displayName={item.chatRoomName} profilePicture={item.profilePicture} mama={this.mama} tata={this.tata} id={item.roomId}/>
            )}   
           keyExtractor={(item, index) => String(index)}
        //    ListFooterComponent={this.renderFooter}
        //    onEndReached={this.retrieveMore}
        //    onEndReachedThreshold={0}
        //    refreshing={this.state.refreshing}
        //    onRefresh={this.handleRefresh}
           />
               </ScrollView>             

            )
    }
}

export default withNavigation(SendToList)