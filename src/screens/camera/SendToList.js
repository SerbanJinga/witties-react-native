import React, { Component } from 'react'
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, FlatList, ScrollView, Alert, Platform } from 'react-native'
import { SearchBar, Avatar, Divider, ThemeConsumer, CheckBox } from 'react-native-elements'
import { AntDesign } from '@expo/vector-icons'
import firebase from 'firebase'
import SendTo from './SendTo'
import { withNavigation } from 'react-navigation'
const { width, height } = Dimensions.get('window')
let arr = []
let friendArr = []

class SendToList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            documentData: [],
            sendTo: [],
            imageUri: "",
            displayName: "",
            profilePicture: "",
            friendsData: [],
            image: this.props.image,
            saveToTimeline: false,
            searchAll: '',
            filteredData: []
        }
    }


    _retrieveData = async () => {
        const currentUid = firebase.auth().currentUser.uid
        let initialQuery = await firebase.firestore().collection('users').doc(currentUid).get()
        let documentData = await initialQuery.data().chatRoomsIn
        documentData.forEach(document => this._retrieveDataFromChatRoomId(document))
    }

    _retrieveDataFromChatRoomId = async (document) => {
        let initialQuery = await firebase.firestore().collection('messages').doc(document).get()
        let chatRoomName = await initialQuery.data().chatRoomName
        let profilePicture = await initialQuery.data().profilePicture
        let roomId = await initialQuery.data().roomId
        let userWhoCreated = await initialQuery.data().userWhoCreated
        let twoUserChat = await initialQuery.data().twoUserChat

        let foo = {
            chatRoomName: chatRoomName,
            profilePicture: profilePicture,
            roomId:  roomId
        }

        if(userWhoCreated !== firebase.auth().currentUser.uid && twoUserChat === true){
            let otherQuery = await firebase.firestore().collection('users').doc(userWhoCreated).get()
            let displayName = await otherQuery.data().displayName
            foo.chatRoomName = displayName
        }

        arr.push(foo)
        this.setState({
            documentData: arr
        })
        // console.log(this.state.documentData)

    }

    componentDidMount = async () => {
        await this.retrieveMe()
        console.log('imagine', this.state.image)
        if(this.props.shouldFlip){
            console.log('daikfajkfahfjkagjahfgjahgfa')
        }else{
            console.log('esti curva')

        }
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
        for (let i = 0; i < sendToFinal.length; i++)
            if (sendToFinal[i] == uid)
                sendToFinal.splice(i, 1)
        this.setState({
            sendTo: sendToFinal
        })

        console.log(this.state.sendTo)
    }

    uploadVideo = async () => {

        this.props.close()
        this.props.closeEvery()
        const timestamp = firebase.auth().currentUser.uid + "/" + Date.now()
        const path = `videos/${timestamp}`
        console.log(this.props.videoFile)
        const response = await fetch(this.props.videoFile)
        const file = await response.blob()

        let upload = firebase.storage().ref(path).put(file)
        upload.on("state_changed", snapshot => { }, err => {
            console.log(arr)
        },
            async () => {
                const url = await upload.snapshot.ref.getDownloadURL()
                this.setState({ imageUri: url })

                this.sendPost(url)

            })
        console.log('intra bine')
    }

    uploadPhoto = async () => {

        this.props.close()
        this.props.closeEvery()
        const timestamp = firebase.auth().currentUser.uid + "/" + Date.now()
        const path = `photos/${timestamp}`
        const response = await fetch(this.props.image)
        const file = await response.blob()
        let upload = firebase.storage().ref(path).put(file)
        upload.on("state_changed", snapshot => { }, err => {

        }, async () => {
            const url = await upload.snapshot.ref.getDownloadURL()
            this.setState({
                imageUri: url
            })
            this.upload(url)
        })
    }


    sendPost = (url) => {

        console.log('intra aici nui asa')
        this.state.sendTo.forEach(chatRoom => {
            firebase.firestore().collection('messages').doc(chatRoom).update({
                lastUpdated: Date.now()
            })
            firebase.firestore().collection('messages').doc(chatRoom).collection('chats').add({
                mood: this.props.mood,
                msg: this.props.text,
                activity: this.props.activity,
                video: url,
                timestamp: Date.now(),
                hoursPosted: this.props.hoursPosted,
                location: this.props.location,
                creatorId: this.props.creatorId,
                taggedUsers: this.props.taggedUsers,
                albums: this.props.albums,
                shouldFlip: this.props.shouldFlip
            })
        })
        if (this.state.saveToTimeline === true)
            firebase.firestore().collection('private').doc(firebase.auth().currentUser.uid).collection('statuses').add({
                mood: this.props.mood,
                msg: this.props.text,
                activity: this.props.activity,
                video: url,
                timestamp: Date.now(),
                hoursPosted: this.props.hoursPosted,
                location: this.props.location,
                creatorId: this.props.creatorId,
                taggedUsers: this.props.taggedUsers,
                albums: this.props.albums,
                shouldFlip: this.props.shouldFlip
            })

        this.props.close()
        this.props.closeEvery()
    }

    decideUpload = () => {
        if (this.props.videoFile) {
            this.uploadVideo()
        } else {
            // console.log(this.props.image)
            this.uploadPhoto()
        }
        // console.log('ne decidem')
    }

    retrieveMe = async () => {
        let initialQuery = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).get()
        let profilePicture = await initialQuery.data().profilePicture
        let displayName = await initialQuery.data().displayName

        this.setState({
            displayName: displayName,
            profilePicture: profilePicture
        })
    }


    upload = (url) => {
        if (this.state.sendTo.length === 0 && this.state.saveToTimeline === false) {
            Alert.alert(
                `You need to select at least one chat!`,
                "",
                [
                    {
                        text: "Cancel",
                        onPress: () => console.log('nimic '),
                        style: 'cancel'
                    },
                    {
                        text: "ok",
                        onPress: () => console.log('ok'),
                        style: 'destructive'
                    }
                ],
                { cancelable: true })


        } else {


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
                
            firebase.firestore().collection('messages').doc(chatRoom).update({
                lastUpdated: Date.now()
            })
                firebase.firestore().collection('messages').doc(chatRoom).collection('chats').add({
                    mood: this.props.mood,
                    msg: this.props.text,
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

            if (this.state.saveToTimeline === true)
                firebase.firestore().collection('private').doc(firebase.auth().currentUser.uid).collection('statuses').add({
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


            this.props.close()
            this.props.closeEvery()
        }
    }


    retrieveAllFriends = async () => {
        let initialQuery = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).get()
        let data = await initialQuery.data().friends
        data.forEach(friend => this.getFriend(friend))
    }

    getFriend = async (friend) => {
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
        upload.on("state_changed", snapshot => { }, err => {
        },
            async () => {
                const url = await upload.snapshot.ref.getDownloadURL()
                this.setState({ imageUri: url })
                console.log('dadakdalkdakd am ajuns', url)

                this.uploadToStoryVideo(url)
            })
    }

    search = async (searchAll) => {
        // filtered = []
        this.setState({ searchAll: searchAll })
        // let filteredData = this.state.documentData.filter(function(item){
        //     return item.chatRoomName.includes(searchChats)
        // })
        // this.setState({filteredData: filteredData})

        let filteredData = this.state.documentData.filter(item => item.chatRoomName .toLowerCase().includes(searchAll.toLowerCase()))

        this.setState({
        filteredData: filteredData
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

    uploadPhotoToStory = async () => {
        const timestamp = firebase.auth().currentUser + "/" + Date.now()
        const path = `photos/statuses/${timestamp}`
        const response = await fetch(this.props.image)

        const file = await response.blob()
        let upload = firebase.storage().ref(path).put(file)
        this.props.close()
        this.props.closeEvery()
        //   this.props.navigation.navigate('Home')  
        upload.on("state_changed", snapshot => { }, err => {

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

    render() {
        return (
            <ScrollView style={{ flex: 1, flexDirection: 'column' }}>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <View style={{ flex: 0, flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>

                        <SearchBar placeholder="Search"  lightTheme placeholderTextColor="#ecedef" containerStyle={{
                            backgroundColor: "#fff",
                            borderBottomColor: '#ecedef',
                            borderTopColor: '#ecedef',
                            borderLeftColor: '#ecedef',
                            borderRightColor: '#ecedef',
                            borderWidth: 1,
                            borderRadius: 10,
                            margin: 10,
                            width: width / 1.3
                        }} inputContainerStyle={{ height: 30, backgroundColor: '#fff' }} value={this.state.searchAll} onChangeText={this.search} />
                        
                        <TouchableOpacity onPress={() => this.decideUpload()}>
                            <AntDesign name="arrowright" size={20} />
                        </TouchableOpacity>


                    </View>
                </View>




                <View style={{ flex: 1, padding: 10 }}>
                    <View style={{ flex: 0, flexDirection: 'row', alignItems: 'center' }}>
                        <Avatar size={40} rounded source={{ uri: this.state.profilePicture }} />
                        <View style={{ flex: 1, flexDirection: 'column', }}>
                            <Text style={{ marginLeft: 4, fontFamily: 'font1' }}>Save to Timeline</Text>
                        </View>
                        <CheckBox
                            onPress={() => {
                                if (this.state.saveToTimeline === false) {

                                    this.setState({ saveToTimeline: true })
                                } else {
                                    this.setState({ saveToTimeline: false })

                                }
                            }}
                            containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
                            checked={this.state.saveToTimeline}

                        />
                    </View>
                    <Divider style={{ marginTop: 20 }} />

                </View>




                <Text style={{ fontFamily: 'font1', fontSize: 24, margin: 10 }}>My Chats</Text>


                <FlatList
                                data={this.state.filteredData && this.state.filteredData.length > 0 ? this.state.filteredData : this.state.documentData}
                    renderItem={({ item }) => (
                        <SendTo displayName={item.chatRoomName} profilePicture={item.profilePicture} mama={this.mama} tata={this.tata} id={item.roomId} />
                    )}
                    keyExtractor={(item, index) => String(index)}
                //    ListFooterComponent={this.renderFooter}
                //    onEndReached={this.retrieveMore}
                //    onEndReachedThreshold={0}
                //    refreshing={this.state.refreshing}
                //    onRefresh={this.handleRefresh}
                />

                {/* <FlatList
                    data={this.state.friendsData}
                    renderItem={({ item }) => (
                        <SendTo isUser={true} displayName={item.displayName} profilePicture={item.profilePicture} mama={this.mama} tata={this.tata} id={item.uid} />
                    )}
                    keyExtractor={(item, index) => String(index)}
                //    ListFooterComponent={this.renderFooter}
                //    onEndReached={this.retrieveMore}
                //    onEndReachedThreshold={0}
                //    refreshing={this.state.refreshing}
                //    onRefresh={this.handleRefresh}
                /> */}
            </ScrollView>



        )
    }
}

export default withNavigation(SendToList)