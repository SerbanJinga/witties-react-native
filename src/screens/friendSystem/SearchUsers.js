import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, ActivityIndicator, SafeAreaView, TouchableOpacity, ScrollView, Clipboard, Alert, SectionList, RefreshControl } from 'react-native'
import { Text, SearchBar, Button, Avatar, Overlay, Input, Divider, Tooltip } from 'react-native-elements'
// import Clipboard from '@react-native-community/clipboard'
import firebase from 'firebase'
import { FlatList } from 'react-native-gesture-handler'
import { Notifications } from 'expo'
import * as Permissions from 'expo-permissions'
import Constants from 'expo-constants';
import { MaterialIcons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'
import * as Font from 'expo-font'

import AddFriend from './AddFriend'
import { withNavigation } from 'react-navigation'
import Toast, { DURATION } from 'react-native-easy-toast'
import Timeline from '../../screens/Timeline/Timeline'
import AddedMe from './AddedMe'

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
            profilePicture: '',
            searchOverlay: false,
            fontsLoaded: false,
            profileOverlay: false,
            displayName: '',
            discriminator: '',
            email: firebase.auth().currentUser.email,
            allUsersUid: [],
            settings: false,
            addedMe: []
        }
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
        this.setState({
            profilePicture: documentData,
            displayName: displayNameDocumentData,
            discriminator: discrim
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
        
console.log(arr)
        await Font.loadAsync({
            font1: require('../../../assets/SourceSansPro-Black.ttf'),
            font2: require('../../../assets/SourceSansPro-Regular.ttf')
        });
        this.setState({fontsLoaded: true})
        await this.getCurrentUser()
        await this.retrieveData()
        await this.addedMe()
        await this._retrieveProfilePicture()
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
        this.state.friendRequsts.push(uid)
        await this.getToken(uid)
        firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({
            sentRequests: firebase.firestore.FieldValue.arrayUnion(uid)
        })

        await firebase.firestore().collection('users').doc(uid).update({
            receivedRequests: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.uid)
        })
  

    }

    _onPressSearch = () => {
        this.setState({
            searchOverlay: true
        })
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
            {cancelable: 'false'}
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


    render(){
            const loaded = this.state.fontsLoaded
            if(loaded){
                return(
            <View style={styles.container}>
   
            <View style={{flex: 0, flexDirection: 'row', justifyContent: 'space-between', padding: 10}}>  

                <TouchableOpacity
                    onPress={()=> this._onPressSearch()}
                  style={{
                    backgroundColor: 'transparent',
                    margin: 4,
                    marginRight: 10,
                 }}>
              <AntDesign
                  name="addusergroup"
                  style={{fontSize: 26, fontWeight: "bold"}}
              />
            </TouchableOpacity>    
            <Text style={{fontSize: 20, fontFamily: "font1", paddingTop: 5}}>Witties</Text>

            <Avatar onPress={() => this._onPressAvatar()} rounded source={{uri: this.state.profilePicture}}/>
        
            </View>
            <Divider/>
            {/* <Button title="Da"/> */}
            {/* search overlay */}
                <Overlay
                    animationType={'slide'}
                    isVisible={this.state.searchOverlay}
                    overlayStyle={{width: width, height: height}}
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
                    transparent={true}
                    animationType={'slide'}
                    overlayStyle={{width: width, height: height}}
                    isVisible={this.state.profileOverlay}
                >
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
                            <Avatar source={{uri: this.state.profilePicture}} rounded/>
                            <View style={{flex: 0, flexDirection: 'column', marginLeft: 15}}>
                                <TouchableOpacity onPress={() => this._copyToClipboard()}>
                                    <Text style={{fontFamily: 'font1'}}>{this.state.displayName}#{this.state.discriminator}</Text>
                                </TouchableOpacity>
                                <Text style={{fontFamily: 'font1'}}>{this.state.email}</Text>
                            </View>
                        </View>
                        <Divider/>
                        <TouchableOpacity>
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
                        <TouchableOpacity onPress={() => this._onCloseAvatar()}>
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

                <Toast
                    ref="copyToClipboard"
                    style={{backgroundColor: '#4BB543'}}
                    textStyle={{color: '#fff'}}
                    position='bottom'
                    opacity={0.8}
                    fadeInDuration={750}
                />
                  <Overlay animationType="slide" isVisible={this.state.settings} fullScreen overlayStyle={{width: width}}>
                    <View style={{flex: 1, flexDirection: 'column', top: 10}}>
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
                    </View>
                </Overlay>
                </Overlay>
                
                {/* <Timeline/> */}
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