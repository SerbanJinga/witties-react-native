import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native'
import { Text, Button, Avatar, Overlay, SearchBar, Divider } from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import firebase from 'firebase'
import { Entypo, AntDesign } from '@expo/vector-icons'
import * as Font from 'expo-font'
import { withNavigation } from 'react-navigation'
import { ScrollView, FlatList } from 'react-native-gesture-handler'
import AddFriend from '../screens/friendSystem/AddFriend'
import Friend from '../components/Friend'
import ReceiveFriend from '../screens/friendSystem/ReceiveFriend'
import ReceiveFriendRequest from './friendSystem/ReceiveFriendRequest'
import FriendList from './friendSystem/FriendList'
import AllFriends from './friendSystem/AllFriends'
import { SafeAreaView } from 'react-native-safe-area-context'
import AddedMe from './friendSystem/AddedMe'
import AllChatsComponent from './AllChatsComponent'
let arr = []
let friendsArr = []
let addedMe = []
const { width, height } = Dimensions.get('window')

  class UserProfile extends Component {
    constructor(props){
        super(props)
        this.state = {
            imageURL: "",
            imageUri: "",
            optionMenu: false,
            userData: {},
            fontsLoaded: false,
            friends: [],
            friendsNumber: 0,
            friendsOverlay: false,
            settings: false,
            addFriends: false,
            documentData: [],
            loading: false,
            refreshing: false,
            addedMe: [],
            filteredData: [],
            searchText: "",
            scan: false
        }
    }


    
    _acceptFriend = (uid) => {
        firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({
            friends: firebase.firestore.FieldValue.arrayUnion(uid)
        })    
        firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({
            receivedRequests: firebase.firestore.FieldValue.arrayRemove(uid)
        })

        firebase.firestore().collection('users').doc(uid).update({
            sentRequests: firebase.firestore.FieldValue.arrayRemove(firebase.auth().currentUser.uid)
        })
        firebase.firestore().collection('users').doc(uid).update({
            friends: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.uid)
        })
    }

    getToken = async(uid) => {
        let initialQuery = await firebase.firestore().collection("users").where('uid', '==', uid)
        let documentSnapshots = initialQuery.get()
        let documentData = (await documentSnapshots).docs.map(doc => doc.data().tokens)
        this.sendNotification(documentData[0], uid)
    }
    _sendRequest = async(uid) => {
        console.log('se trimite')
        this.state.friendRequsts.push(uid)
        await this.getToken(uid)
        firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({
            sentRequests: firebase.firestore.FieldValue.arrayUnion(uid)
        })

        await firebase.firestore().collection('users').doc(uid).update({
            receivedRequests: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.uid)
        })
  

    }

   

    _retrieveUserData = async() => {
        const currentId = firebase.auth().currentUser.uid
        let userQuery = await firebase.firestore().collection('users').doc(currentId)
        let userSnapshots = await userQuery.get()
        let userData = userSnapshots.data()
        this.setState({
            userData: userData
        })
        console.log(this.state.userData)
    }

    componentDidMount = async () => {
        arr = []
        friendsArr = []
        addedMe = []
        this._retrieveUserData()
        this._retrieveImage()
        await this._retrieveAllFriends()
        await Font.loadAsync({
            font1: require('../../assets/SourceSansPro-Black.ttf'),
            font2: require('../../assets/SourceSansPro-Regular.ttf')
        });
        this.setState({fontsLoaded: true})
        this.retrieveHowManyFriends()
    }
    retrieveData = async() => {
        arr = []
        console.log('merge JKFALFKLAGKLA FKALGLA G')
        let documentT;
        const func = firebase.functions().httpsCallable('friendSystem')
        try{
            this.setState({
                loading: true,
                refreshing: true
            })
         
        await func().then(async res => {
             documentT = await res.data.documentData
             console.log('-------------------------')
             console.log(documentT)
             console.log('-------------------------  ')
            await documentT.forEach(async element => {
                await this._getUserFromUid(element)
            })
        }).then(
        this.setState({
            loading: false,
            refreshing: false
        }))
    }catch(error){
            console.log(error)
        }
    }   
   

    _getUserFromUid = async (uid) => {
        let initialQuery = await firebase.firestore().collection('users').doc(uid)
        let documentSnapshots = await initialQuery.get()
        let documentData = await documentSnapshots.data()
        arr.push(documentData)
        this.setState({
            documentData: arr
        })
    }



    _openOptions = () => {
        this.setState({
            optionMenu: !this.state.optionMenu
        })
    }
    

    search = (searchText) => {
        this.setState({searchText: searchText})
        let filteredData = this.state.documentData.filter(function(item){
            return item.displayName.toLowerCase().includes(searchText)
        })
        this.setState({filteredData: filteredData})
    }

    _pickImage = async() => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3]
        })

        if(!result.cancelled){
            this.setState({
                imageUri: result.uri
            })
            this._uploadToStorage()
        }
    }

_retrieveImage = async() => {
    const path = `profiles_picture/${firebase.auth().currentUser.uid}`
    const url = await firebase.storage().ref(path).getDownloadURL()
    this.setState({imageUri: url})
}

_uploadToStorage = async () => {
    const path = `profiles_picture/${firebase.auth().currentUser.uid}`
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
        this._uploadToFirestore(url)
    })
}

_uploadToFirestore = (url) => {
    firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
        profilePicture: url
    })
}

_deletePicture = () => {
    alert("ai ales")
}


_retrieveAllFriends = async() => {
    let initialQuery = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
    let documentSnapshots = await initialQuery.get()
    let documentData = documentSnapshots.data().friends
    documentData.forEach(doc => this._getFriendDetailsFromUid(doc))

}

_getFriendDetailsFromUid = async(uid) => {
    let initialQuery = firebase.firestore().collection('users').where("uid", '==', uid)
    let documentSnapshots = await initialQuery.get()
    documentSnapshots.docs.map(doc => friendsArr.push(doc.data()))
    this.setState({friends: friendsArr})
    // console.log(this.state.friends)
}

retrieveHowManyFriends = () =>{
   
}


openFriends = () => {
    this.setState({
        friendsOverlay: true
    })
}

closeFriends = () => {
    this.setState({
        friendsOverlay: false
    })
}

addFriends = async() => {
    await this.addedMe()
    await this.retrieveData().then(
    this.setState({
        addFriends: true
    }))
}

addedMe = async () => {
    addedMe = []
    let initialQuery = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).get()
    let addData = await initialQuery.data().receivedRequests
    addData.forEach(async element => await this.getAddedMeUser(element))
}


getAddedMeUser = async(uid) => {
    let initialQuery = await firebase.firestore().collection('users').doc(uid).get()
    let data = await initialQuery.data()
    addedMe.push(data)
    console.log('adlafjakfjkalfjalkdal')
    console.log(addedMe)
    this.setState({
        addedMe: addedMe
    })
}

closeAddFriends = () => {
    this.setState({
        addFriends: false
    })
}

addToStory = () => {
    this.props.navigation.navigate('CameraScreen')
}

openOverlay = () => {
    this.setState({
        scan: true
    })
}

closeOverlay = () => {
    this.setState({
        scan: false
    })
}


    render(){
        if(this.state.fontsLoaded){return(
            <SafeAreaView style={{backgroundColor: '#fff', width: width, height: height, marginTop: 0, flex: 1, flexDirection: 'column'}}>
                 
                <View style={{flex: 0, flexDirection: 'column', alignItems: 'center'}}>
                   
                <Avatar
                    onLongPress={() => this.openOverlay()}
                    containerStyle={{marginTop: 20, marginLeft: 0}}
                    size={100}
                    rounded
                    source={{
                        uri: this.state.imageUri
                    }}
                    onPress={() => this._openOptions()}
                />
                <View style={{flex: 0, flexDirection: 'row', marginTop: 20}}>
                <Text style={{fontFamily: "font1", fontSize: 15}}>{this.state.userData.displayName}#{this.state.userData.discriminator}</Text>
                <Entypo name="dot-single" style={{marginTop: 4, marginHorizontal: 4}}/>
                <Text style={{fontFamily: "font1", fontSize: 15}}>{this.state.userData.careScore}</Text>
                </View>
                <Button onPress={()=> this.addToStory()} titleStyle={{fontFamily: 'font1', fontSize: 15, margin: 0}} type="clear" title="Add to story"/>

                </View>
                <View style={{flex: 1, flexDirection: 'column', marginTop: 20}}>
                <Divider style={{width: width}}/>

                <View style={{flex: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text style={{fontFamily: 'font1', fontSize: 15, margin: 10}}>Friends</Text>
                  <Button onPress={()=> this.addFriends()} titleStyle={{fontFamily: 'font1', fontSize: 15, margin: 0}} type="clear" title="Add" />
                </View>
                <View style={{height: 80}}>
                    <AllFriends/>
                </View>
                {/* <Divider style={{width: width, marginBottom: 20}}/> */}

                <Text style={{fontFamily: 'font1', fontSize: 15, margin: 4, alignSelf: 'center'}}>See All</Text>
                <Divider style={{width: width, marginTop: 20}}/>
                    
                <View style={{flex: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text style={{fontFamily: 'font1', fontSize: 15, margin: 10}}>Chats</Text>
                  <Button onPress={()=> this.addFriends()} titleStyle={{fontFamily: 'font1', fontSize: 15, margin: 0}} type="clear" title="Add" />
                </View>

                <View style={{height: 80}}>
                    {/* <AllFriends/> */}
                <AllChatsComponent/>
                </View>
                <Text style={{fontFamily: 'font1', fontSize: 15, margin: 4, alignSelf: 'center'}}>See All</Text>

                </View>


                

                <Overlay animationType='fade' isVisible={this.state.scan} overlayStyle={{width: width / 1.5}} onBackdropPress={() => this.closeOverlay()}>
                <View style={{flex: 0, flexDirection: 'column', alignItems: 'center'}}>
                   
                   <Avatar
                       onLongPress={() => this.openOverlay()}
                       containerStyle={{marginTop: 20, marginLeft: 0}}
                       size={100}
                       rounded
                       source={{
                           uri: this.state.imageUri
                       }}
                       onPress={() => this._openOptions()}
                   />
                   <View style={{flex: 0, flexDirection: 'row', marginTop: 20}}>
                   <Text style={{fontFamily: "font1", fontSize: 15}}>{this.state.userData.displayName}#{this.state.userData.discriminator}</Text>
                   <Entypo name="dot-single" style={{marginTop: 4, marginHorizontal: 4}}/>
                   <Text style={{fontFamily: "font1", fontSize: 15}}>{this.state.userData.careScore}</Text>

                   </View>
                   <Button  titleStyle={{fontFamily: 'font1', fontSize: 15, margin: 0, alignSelf: 'center'}} type="clear" title="Copy Username" />
                   <Button  titleStyle={{fontFamily: 'font1', fontSize: 15, margin: 0, alignSelf: 'center'}} type="clear" title="Share URl" />
                   <Button  titleStyle={{fontFamily: 'font1', fontSize: 15, margin: 0, alignSelf: 'center'}} type="clear" title="Close" />
                    

                   </View>
                </Overlay>




                <Overlay animationType="slide" onBackdropPress={() => this.closeAddFriends()} fullScreen isVisible={this.state.addFriends}>
                    <SafeAreaView style={{flex: 1}}>
                        <ScrollView style={{flex: 1, flexDirection: 'column'}}>
                        <View style={{flex: 0, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TouchableOpacity onPress={() => this.closeAddFriends()}>
                    <AntDesign
                        size={26}
                        name="down"
                        color="#b2b8c2"
                    />
                    </TouchableOpacity>
                    <Text style={{fontFamily: 'font1', fontSize: 20}}>Add Friends</Text>
                    <TouchableOpacity onPress={() => this._openOptions()}>
                    <AntDesign
                        size={26}
                        name="bars"
                        color="#b2b8c2"
                    />
                    </TouchableOpacity>
                    </View>
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
    width: width / 1.2
}}  inputContainerStyle={{backgroundColor: '#fff', height: 30}} value={this.state.searchText} onChangeText={this.search} />
            <TouchableOpacity onPress={() => this.openFilter()}>
                <AntDesign name="filter" size={20}/>
            </TouchableOpacity>

           </View>
           {this.state.addedMe.length !== 0 ?
           <Text style={{fontFamily: 'font1', fontSize: 24, margin: 10}}>Added Me</Text>
           : null}
            <FlatList
                        data={this.state.addedMe}
                        renderItem={({item}) => (
                        <AddedMe careScore={item.careScore} discriminator={item.discriminator} displayName={item.displayName} profilePicture={item.profilePicture} press={() => this._acceptFriend(item.uid)}/>
                    )}  
                    keyExtractor={(item, index) => String(index)}

                />
            <Text style={{fontFamily: 'font1', fontSize: 24, margin: 10}}>Discover More</Text>

                <FlatList
                    // horizontal={true}
                 data = {this.state.filteredData && this.state.filteredData.length > 0 ? this.state.filteredData : this.state.documentData}
                 renderItem={({item}) => (
                    <AddFriend uid={item.uid} careScore={item.careScore} discriminator={item.discriminator} displayName={item.displayName} profilePicture={item.profilePicture} press={() => this._sendRequest(item.uid)}/>
                 )}   
                keyExtractor={(item, index) => String(index)}
                // ListFooterComponent={this.renderFooter}
                onEndReached={this.retrieveMore}
                onEndReachedThreshold={0}
                refreshing={this.state.refreshing}
                onRefresh={this.handleRefresh}
                />
             
                        </ScrollView>
                    </SafeAreaView>
                </Overlay>
                <Overlay animationType="slide" onBackdropPress={() => this.closeFriends()} fullScreen isVisible={this.state.friendsOverlay}>
                <View style={{flex: 1}}>
                    <FriendList close={() => this.closeFriends()}/>
                </View>
                </Overlay>
                <Overlay onBackdropPress={this._openOptions} isVisible={this.state.optionMenu} overlayStyle={{position: 'absolute', bottom: 0, width: width}}>
                    <View>
                        
                        <Button
                            onPress={this._pickImage}
                            type="clear"
                            title="Select picture"
                            titleStyle={{color: '#000', fontFamily: "font1"}}

                        />
                        <Divider/>
                        <Button
                            titleStyle={{color: 'red', fontFamily: "font1"}}
                            onPress = {this._deletePicture}
                            type="clear"
                            title="Delete picture"
                        />
                    </View>
                </Overlay>
                
            </SafeAreaView>
        )}else{
            return(
                <ActivityIndicator size="large"/>
            )
        }
    }
}

export default withNavigation(UserProfile)