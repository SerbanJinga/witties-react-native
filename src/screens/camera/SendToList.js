import React, { Component } from 'react'
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, FlatList, ScrollView } from 'react-native'
import {SearchBar, Avatar, Divider, ThemeConsumer} from 'react-native-elements'
import { AntDesign } from '@expo/vector-icons'
import firebase from 'firebase'
import SendTo from './SendTo'
import { withNavigation } from 'react-navigation'
const {width, height} = Dimensions.get('window')
let arr = []
let friendArr = []

 class SendToList extends Component{
    constructor(props){
        super(props)
        this.state = {
            documentData: [],
            sendTo: [],
            imageUri: "",
            displayName: "",
            profilePicture: "",
            friendsData: [],
            image: this.props.image
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
        await this.retrieveMe()
        console.log('imagine', this.state.image)
        arr = []
        friendArr = []
        await this._retrieveData()
        // console.log(this.props.image)
        await this.retrieveAllFriends()
    }

    mama = (uid) => {
        const sendToFinal = this.state.sendTo
        sendToFinal.push(uid)
        this.setState({
            sendTo: sendToFinal
        })
        console.log(this.state.sendTo)

    }   

    tata = (uid) => {
        let sendToFinal = this.state.sendTo
        for(let i = 0; i < sendToFinal.length; i++)
            if(sendToFinal[i] == uid)
                sendToFinal.splice(i, 1)
        this.setState({
            sendTo: sendToFinal
        })

        console.log(this.state.sendTo)
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
            this.upload(url)
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
            // console.log(this.props.image)
            this.uploadPhoto()
        }
        // console.log('ne decidem')
    }

    retrieveMe = async() => {
        let initialQuery = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).get()
        let profilePicture = await initialQuery.data().profilePicture
        let displayName = await initialQuery.data().displayName

        this.setState({
            displayName: displayName,
            profilePicture: profilePicture
        })
    }


    upload = (url) => {
        let foo = {
            mood: this.props.mood,
            text: this.props.text,
            activity: this.props.activity,
            image: url,
            timestamp: Date.now(),
            hoursPosted: this.props.hoursPosted,
            location: this.props.location,
            creatorId: this.props.creatorId,
            taggedUsers: this.props.taggedUsers,
            albums: this.props.albums
        }

        // console.log(foo)
        // this.state.sendTo.forEach(chatRoom => {
        //     firebase.firestore().collection('messages').doc(chatRoom).update({
        //         messages: firebase.firestore.FieldValue.arrayUnion(foo)
        //     })
        // })

        this.state.sendTo.forEach(chatRoom => {
            firebase.firestore().collection('messages').doc(chatRoom).collection('chats').add({
                mood: this.props.mood,
                text: this.props.text,
                activity: this.props.activity,
                image: url,
                timestamp: Date.now(),
                hoursPosted: this.props.hoursPosted,
                location: this.props.location,
                creatorId: this.props.creatorId,
                taggedUsers: this.props.taggedUsers,
                albums: this.props.albums
            })
        })
        this.props.close()
        this.props.closeEvery()
    }


    retrieveAllFriends = async() => {
        let initialQuery = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).get()
        let data = await initialQuery.data().friends
        data.forEach(friend => this.getFriend(friend))
    }

    getFriend = async(friend) => {
        let query = await firebase.firestore().collection('users').doc(friend).get()
        let data = await query.data()

        friendArr.push(data)

        this.setState({
            friendsData: friendArr
        })
    }



    

    uploadVideoToStory = async () => {
        console.log(this.props.videoFile, 'vaojufafjaikfjafjk')
        const timestamp = firebase.auth().currentUser.uid + "/" + Date.now()
        const path = `videos/${timestamp}`
        const response = await fetch(this.props.videoFile)
        const file = await response.blob()

        let upload = firebase.storage().ref(path).put(file)
        upload.on("state_changed", snapshot => {}, err => {
        },
        async () => {
            const url = await upload.snapshot.ref.getDownloadURL()
            this.setState({imageUri: url})
            console.log('dadakdalkdakd am ajuns', url)

            this.uploadToStoryVideo(url)
        })
    }

    uploadToStoryVideo = async (url) => {
        console.log('se deschide ')
        firebase.firestore().collection('status-public').doc(firebase.auth().currentUser.uid).collection('statuses').add({
            mood: this.props.mood,
            text: this.props.text,
            activity: this.props.activity,
            video: url,
            timestamp: Date.now(),
            hoursPosted: this.props.hoursPosted,
            location: this.props.location,
            creatorId: this.props.creatorId,
            taggedUsers: this.props.taggedUsers,
            albums: this.props.albums,
            duration: this.props.duration
    })
    }

    uploadPhotoToStory = async() => {
        const timestamp = firebase.auth().currentUser + "/" + Date.now()
        const path = `photos/statuses/${timestamp}`
        const response = await fetch(this.props.image)

        const file = await response.blob()
        let upload = firebase.storage().ref(path).put(file)
        this.props.close()
        this.props.closeEvery()
        //   this.props.navigation.navigate('Home')  
        upload.on("state_changed", snapshot => {}, err => {
            
        }, async () => {
            const url = await upload.snapshot.ref.getDownloadURL()
            this.setState({
                imageUri: url
            })
            this.uploadToStory(url)
        })
    }

    uploadToStory = async (url) => {
        firebase.firestore().collection('status-public').doc(firebase.auth().currentUser.uid).collection('statuses').add({
                mood: this.props.mood,
                text: this.props.text,
                activity: this.props.activity,
                image: url,
                timestamp: Date.now(),
                hoursPosted: this.props.hoursPosted,
                location: this.props.location,
                creatorId: this.props.creatorId,
                taggedUsers: this.props.taggedUsers,
                albums: this.props.albums
        })
    }

    render(){
        return(
            <ScrollView style={{flex: 1, flexDirection: 'column'}}>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start'}}>
            <View style={{flex: 0, flexDirection: 'row', alignItems: 'center', alignContent: 'center'}}>  
            
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

       <Text style={{fontFamily: 'font1', fontSize: 24, margin: 10}}>My Story</Text>
       <TouchableOpacity onPress={() => this.props.image === '' ? this.uploadVideoToStory() : this.uploadPhotoToStory()}>
        
            <View style={{flex: 1, padding: 10}}>
                <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
                    <Avatar size={40} rounded source={{uri: this.state.profilePicture}}/>
                    <View style={{flex: 1, flexDirection: 'column',}}>
                    <Text style={{marginLeft: 4, fontFamily: 'font1'}}>{this.state.displayName}</Text>
                    </View>
                </View>
                <Divider style={{marginTop: 20}}/>

            </View>
            

             </TouchableOpacity> 
             <Text style={{fontFamily: 'font1', fontSize: 24, margin: 10}}>My Chats</Text>
  

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
               <Text style={{fontFamily: 'font1', fontSize: 24, margin: 10}}>All Friends</Text>

               <FlatList
                data={this.state.friendsData}
            renderItem={({item}) => (
                <SendTo isUser={true} displayName={item.displayName} profilePicture={item.profilePicture} mama={this.mama} tata={this.tata} id={item.uid}/>
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