import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, ActivityIndicator, SafeAreaView, TouchableOpacity, ScrollView, Clipboard, Alert, SectionList, RefreshControl } from 'react-native'
import { Text, SearchBar, Button, Avatar, Overlay, Input, Divider, Tooltip } from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker'
import firebase from 'firebase'
import { FlatList } from 'react-native-gesture-handler'
import { Notifications } from 'expo'
import * as Permissions from 'expo-permissions'
import Constants from 'expo-constants';
import { MaterialIcons, Entypo, AntDesign, Feather, FontAwesome5 } from '@expo/vector-icons'
import * as Font from 'expo-font'

import AddFriend from './AddFriend'
import { withNavigation } from 'react-navigation'
import Toast, { DURATION } from 'react-native-easy-toast'
import Timeline from '../../screens/Timeline/Timeline'
import AddedMe from './AddedMe'
import StoriesPublic from '../stories/StoriesPublic'
import UserProfile from '../UserProfile'
import AllFriends from './AllFriends'
import AllChatsComponent from '../AllChatsComponent'

const { width, height } = Dimensions.get('window')
const heightS = Dimensions.get('screen').height
const widthS = Dimensions.get('screen').width
let arr = []
let addedMe = []

  class SearchUsers extends Component {
      
    static navigationOptions = {
        title: 'Mama',
        headerMode: 'screen'
      }
    constructor(props){
        super(props)
        this.state = {
            searchText: "",
            documentData: [],
            limit: 20,
            lastVisible: null,
            loading: false,
            refreshing: false,
            filteredData:[],
            friendRequsts: [],
            currentUser: "",
            imageUri: '',
            searchOverlay: false,
            fontsLoaded: false,
            profileOverlay: false,
            displayName: '',
            discriminator: '',
            email: firebase.auth().currentUser.email,
            allUsersUid: [],
            settings: false,
            addedMe: [],
            careScore: 0,
            profileDetails: false,
            optionMenu: false,
            // items: props.navigation.state.params.roomId
        }
    }

    openProfileOverlay = () => {
        this.setState({
            profileDetails: true
        })
    }


    _copyToClipboard = () => {
        let string = this.state.displayName + "#" + this.state.discriminator
        console.log(string)
        Clipboard.setString(string)
        this.refs.copyToClipboard.show("Copied!")
    }

    

    _retrieveProfilePicture = async() => {
        let initialQuery = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
        let documentSnapshots = await initialQuery.get()
        let documentData = documentSnapshots.data().profilePicture
        let displayNameDocumentData = documentSnapshots.data().displayName
        let discrim = documentSnapshots.data().discriminator
        let careScore = documentSnapshots.data().careScore
        this.setState({
            imageUri: documentData,
            displayName: displayNameDocumentData,
            discriminator: discrim,
            careScore: careScore
        })
    }
   

    getCurrentUser = async() => {
        const uid = firebase.auth().currentUser.uid
        let initialQuery = await firebase.firestore().collection('users').where('uid', '==', uid)
        let documentSnapshots = await initialQuery.get()
        let documentData = documentSnapshots.docs.map(doc => doc.data().displayName)
        this.setState({
            currentUser: documentData[0]
        })

        console.log(this.state.currentUser)
    }
  
     
    componentDidMount = async() => {
        arr = []
        addedMe = []
        
console.log('DATELE', this.props.data)
        await Font.loadAsync({
            font1: require('../../../assets/SourceSansPro-Black.ttf'),
            font2: require('../../../assets/SourceSansPro-Regular.ttf')
        });
        this.setState({fontsLoaded: true})
        await this._retrieveProfilePicture()

        await this.getCurrentUser()
        await this.retrieveData()
        await this.addedMe()
    }

    search = (searchText) => {
        this.setState({searchText: searchText})
        let filteredData = this.state.documentData.filter(function(item){
            return item.displayName.toLowerCase().includes(searchText)
        })
        this.setState({filteredData: filteredData})
    }
    renderHeader = () => {
        try{
            return(
                <SearchBar
                    blurOnSubmit={true}
                    showCancel={true}
                    lightTheme={true}
                    autoCorrect={false}
                    onChangeText={this.search}
                    value={this.state.searchText}
                    placeholder="Search users..."
                />
            )
        }catch(error){
            console.log(error)
        }
    }

    renderFooter = () => {
        try{
            if(this.state.loading || this.state.refreshing){
                return(<ActivityIndicator size="large" color="red"/>)
            }else{
                return null
            }
        }catch(error){
            console.log(error)
        }
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
    
    sendNotification = async(token, uid) => {
        const message = {
            to: token,
            sound: 'default',
            title: uid,
            body: 'Ai primit cerere de la ' + this.state.currentUser,
            data: {data: 'goes here'},
            _displayInForeground: true
        }
        
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
    }
   
    getToken = async(uid) => {
        let initialQuery = await firebase.firestore().collection("users").where('uid', '==', uid)
        let documentSnapshots = initialQuery.get()
        let documentData = (await documentSnapshots).docs.map(doc => doc.data().tokens)
        this.sendNotification(documentData[0], uid)
    }
    _sendRequest = async(uid) => {
        console.log('se trimite')
        // this.state.friendRequsts.push(uid)
        await this.getToken(uid)
        firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({
            sentRequests: firebase.firestore.FieldValue.arrayUnion(uid)
        })

        await firebase.firestore().collection('users').doc(uid).update({
            receivedRequests: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.uid)
        })
  

    }

    _onPressSearch = async() => {
        this.setState({
            searchOverlay: true
        })
        await this.retrieveData()
        await this.addedMe()
    }
    _onCloseSearch = () => {
        this.setState({
            searchOverlay: false
        })
    }

    _onPressAvatar = () => {
        this.setState({
            profileOverlay: true
        })
    }

    _onCloseAvatar = () => {
        this.setState({
            profileOverlay: false
        })
    }

    refFunction = () => {
        this.tooltip.toggleTooltip()
    }

    _signOut = () => {
        Alert.alert(
            'Are you sure you want to sign out?',
            'Please do not.',
            [
                {
                    text: "Cancel",
                    onPress: () => console.log('nimic'),
                    style: 'cancel'
                },{
                    text: 'Sign Out',
                    onPress: () => this._signOutUser(),
                    style: 'destructive'
                }
            ],
            {cancelable: false}
        )
    }
    _signOutUser = () => {
        firebase.auth().signOut().then(this.props.navigation.navigate('Loading', {text: 'mama'}))
      }
  
      _openSettings = () => {
        this.setState({
            settings: true
        })
    }

    _closeSettings = () => {
        this.setState({
            settings: false
        })
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

    handleRefresh = () => {
        return(
            <Text>da</Text>
        )
    }

    onRefresh = () => {
        this.setState({
            refreshing: true
        })
        setTimeout(async() => {
            await this.addedMe().then(this.setState({
                addedMe: addedMe
            }))
            await this.retrieveData().then(
            this.setState({
                documentData: arr,
                refreshing: false
            }))
        }, 2000)
    }

    closeProfileDetails = () => {
        this.setState({
            profileDetails: false
        })
    }

    addToStory = () => {
        this.closeProfileDetails()
        this._onCloseAvatar()
        this.props.navigation.navigate('CameraScreen')
    }

    
    _openOptions = () => {
        this.setState({
            optionMenu: !this.state.optionMenu
        })
    }


    _deletePicture = () => {
        alert("ai ales")
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

    render(){
            const loaded = this.state.fontsLoaded
            if(loaded){
                return(
            <View style={styles.container}>
   
            <View style={{flex: 0, flexDirection: 'row', justifyContent: 'space-around', paddingLeft: 10, paddingRight: 10, paddingBottom: 10, paddingTop: 10,}}>  
            <Text style={{fontSize: 20, fontFamily: "font1", paddingTop: 5, marginRight: 'auto'}}>Witties</Text>



            <TouchableOpacity
                    onPress={()=> this.props.navigation.navigate('Timeline')}
                  style={{
                    backgroundColor: 'transparent',
                    margin: 4,
                    marginRight: 20,
                 }}>
              <MaterialIcons
                  name="history"
                  style={{fontSize: 26, fontWeight: "bold"}}  
              />
            </TouchableOpacity>   



            <TouchableOpacity
                    onPress={()=> this._onPressSearch()}
                  style={{
                    backgroundColor: 'transparent',
                    margin: 4,
                    marginRight: 20,
                 }}>
              <AntDesign
                  name="addusergroup"
                  style={{fontSize: 26, fontWeight: "bold"}}
              />
            </TouchableOpacity>   


            <TouchableOpacity
                    onPress={()=> this.props.navigation.navigate("Map")}
                  style={{
                    backgroundColor: 'transparent',
                    margin: 4,
                    marginRight: 20,
                 }}>
              <Feather
                name="map-pin"
                style={{fontSize: 23, fontWeight: "bold"}}
              />
            </TouchableOpacity>   
            <Avatar onPress={() => this._onPressAvatar()} rounded source={{uri: this.state.imageUri === '' ? 'https://cdn0.iconfinder.com/data/icons/basic-ui-element-s94-2/64/Basic_UI_Icon_Pack_-_Outline_user-512.png' : this.state.imageUri}}/>

          
        
            </View>
            <Divider/>
            {/* <Button title="Da"/> */}
            {/* search overlay */}
                <Overlay
                    animationType={'slide'}
                    isVisible={this.state.searchOverlay}
                    // overlayStyle={{width: width, height: height}}
                    fullScreen
                >
                <SafeAreaView style={{flex: 1}}>
                <ScrollView style={{flex: 1, flexDirection: 'column'}} refreshControl={
                    <RefreshControl tintColor="red" onRefresh={() => this.onRefresh()} refreshing={this.state.refreshing}/>
                }>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start'}}>
                <View style={{flex: 0, flexDirection: 'row', alignItems: 'center', alignContent: 'center'}}>  
                <TouchableOpacity onPress={() => this._onCloseSearch()}>
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
            <TouchableOpacity onPress={() => this.openFilter()}>
                <AntDesign name="filter" size={20}/>
            </TouchableOpacity>

           </View>
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

                {/* profile overlay */}
                <Overlay
                    fullScreen
                    transparent={true}
                    animationType={'slide'}
                    // overlayStyle={{width: width, height: height}}
                    isVisible={this.state.profileOverlay}
                >
                <ScrollView style={{flex: 1}}>
                    <SafeAreaView style={{flex: 1, flexDirection: 'column'}}>
                        <View style={{flex: 0, flexDirection: 'row',  alignItems: 'center'}}>
                            <TouchableOpacity
                            onPress={() => this._onCloseAvatar()}
                                style={{
                                    alignSelf: 'flex-end',
                                    alignItems: 'center',
                                    backgroundColor: 'transparent',                  
                                }}>
                            <AntDesign name="close" size={22}/>
                            </TouchableOpacity>
                            <Text style={{fontSize: 20, fontFamily: 'font1', marginLeft: 8}}>Account</Text>
                        </View>
                        <View style={{flex: 0, flexDirection: 'row', padding: 15}}>
                            <Avatar source={{uri: this.state.imageUri === '' ? 'https://cdn0.iconfinder.com/data/icons/basic-ui-element-s94-2/64/Basic_UI_Icon_Pack_-_Outline_user-512.png' : this.state.imageUri}} rounded/>
                            <View style={{flex: 0, flexDirection: 'column', marginLeft: 15}}>
                                <TouchableOpacity onPress={() => this._copyToClipboard()}>
                                    <Text style={{fontFamily: 'font1'}}>{this.state.displayName}#{this.state.discriminator}</Text>
                                </TouchableOpacity>
                                <Text style={{fontFamily: 'font1'}}>{this.state.email}</Text>
                            </View>
                        </View>
                        <Divider/>
                        <TouchableOpacity onPress={() => this.openProfileOverlay()}>
                            <View style={{flex: 0, flexDirection: 'row',  alignItems: 'center', padding: 15}}>
                                <MaterialIcons
                                    size={30}
                                    name="person"
                                    color="black"
                                />
                                <Text style={{fontFamily: 'font1', marginLeft: 4, fontSize: 14}}>Your profile</Text>
                            </View>
                        </TouchableOpacity>
                        <Divider/>
                        <TouchableOpacity onPress={() => {this._onCloseAvatar()
                            this._onPressSearch()}}>
                            <View style={{flex: 0, flexDirection: 'row',  alignItems: 'center', padding: 15}}>
                                <MaterialIcons
                                    size={30}
                                    name="person-add"
                                    color="black"
                                />
                                <Text style={{fontFamily: 'font1', marginLeft: 4, fontSize: 14}}>Add Friends</Text>
                            </View>
                        </TouchableOpacity>
                        <Divider/>
                        <TouchableOpacity onPress={() => {
                         this.props.changeIndex()
                         this._onCloseAvatar()}}>
                            <View style={{flex: 0, flexDirection: 'row',  alignItems: 'center', padding: 15}}>
                                <MaterialIcons
                                    size={30}
                                    name="timeline"
                                    color="black"
                                />
                                <Text style={{fontFamily: 'font1', marginLeft: 4, fontSize: 14}}>Your timeline</Text>
                            </View>
                        </TouchableOpacity>
                        <Divider/>
                        
                        <TouchableOpacity onPress={() => this._openSettings()}>
                            <View style={{flex: 0, flexDirection: 'row',  alignItems: 'center', padding: 15}}>
                                <MaterialIcons
                                    size={30}
                                    name="settings"
                                    color="black"
                                />
                                <Text style={{fontFamily: 'font1', marginLeft: 4, fontSize: 14}}>Settings</Text>
                            </View>
                        </TouchableOpacity>
                        <Divider/>
                        <TouchableOpacity onPress={() => this._signOut()}>
                            <View style={{flex: 0, flexDirection: 'row',  alignItems: 'center', padding: 15}}>
                                <MaterialIcons
                                    size={30}
                                    name="exit-to-app"
                                    color="black"
                                />
                                <Text style={{fontFamily: 'font1', marginLeft: 4, fontSize: 14, color: 'red'}}>Sign Out</Text>
                            </View>
                        </TouchableOpacity>
                        
                    </SafeAreaView>
                    </ScrollView>

                <Toast
                    ref="copyToClipboard"
                    style={{backgroundColor: '#4BB543'}}
                    textStyle={{color: '#fff'}}
                    position='bottom'
                    opacity={0.8}
                    fadeInDuration={750}
                />
                  <Overlay animationType="slide" isVisible={this.state.settings} fullScreen overlayStyle={{width: width}}>
                    <SafeAreaView style={{flex: 1, flexDirection: 'column', top: 10}}>
                        <View style={{flex: 0, flexDirection: 'row', justifyContent: 'space-between'}}>
                        <TouchableOpacity onPress={() => this._closeSettings()}>
                    <AntDesign
                        size={26}
                        name="down"
                        color="#b2b8c2"
                    />
                    </TouchableOpacity>
                    <Text style={{fontFamily: 'font1', fontSize: 20}}>Settings</Text>
                    <TouchableOpacity onPress={() => this._closeSettings()}>
                    <AntDesign
                        size={26}
                        name="bars"
                        color="#b2b8c2"
                    />
                    </TouchableOpacity>
                        </View>
                        <View style={{flex: 1, flexDirection: 'column', marginTop: 20}}>
                        <Text style={{fontFamily: 'font1', fontSize: 20, margin: 10}}>Profile Settings</Text>
                        <Divider/>
                        
                        </View>
                    </SafeAreaView>
                </Overlay>
                
                <Overlay animationType="slide" isVisible={this.state.profileDetails} fullScreen>
                <ScrollView style={{flex: 1}}>
                    <SafeAreaView style={{flex: 1}}>
                    <View style={{flex: 0, flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity onPress={() => this.closeProfileDetails()}>
                <AntDesign
                    size={26}
                    name="down"
                    color="#b2b8c2"
                />
                </TouchableOpacity>
                <Text style={{fontFamily: 'font1', fontSize: 20}}>{this.state.displayName}</Text>
                <AntDesign
                    size={26}
                    name="bars"
                    color="#b2b8c2"
                />
            </View>  
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
                   <Text style={{fontFamily: "font1", fontSize: 15}}>{this.state.displayName}#{this.state.discriminator}</Text>
                   <Entypo name="dot-single" style={{marginTop: 4, marginHorizontal: 4}}/>
                   <Text style={{fontFamily: "font1", fontSize: 15}}>{this.state.careScore}</Text>
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
                    <AllFriends press={() => this._onCloseAvatar()}/>
                </View>
                   
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

                   
            </SafeAreaView>
</ScrollView>

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
                </Overlay>
                </Overlay>
            <StoriesPublic stories={this.props.stories}/>
                
            </View>)
            }else{
                return (<View style={{flex: 1, width: width, height: height, alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator size={'large'}/>
                </View>)
            }
        
    }
    
  
}

const styles = StyleSheet.create({
  container: {
    height: height,
    width: width,
    flex: 1,
    flexDirection: 'column',
    backgroundColor: "#fff"
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
    borderWidth: 4,
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

export default withNavigation(SearchUsers)