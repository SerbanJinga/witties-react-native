import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, ActivityIndicator, SafeAreaView, Button } from 'react-native'
import { Text, SearchBar } from 'react-native-elements'
import firebase from 'firebase'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import { Notifications } from 'expo'
import * as Permissions from 'expo-permissions'
import Constants from 'expo-constants';
import AddFriend from '../AddFriend'
const { width, height } = Dimensions.get('window')
const arr = []
export default class SearchUsers extends Component {
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
            currentUser: ""
        }
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
        await this.getCurrentUser()
        await this.retrieveData()
        
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
                return(<ActivityIndicator/>)
            }else{
                return null
            }
        }catch(error){
            console.log(error)
        }
    }

    retrieveData = async() => {
        try{
            this.setState({
                loading: true,
                refreshing: true
            })

            let initialQuery = await firebase.firestore().collection('users').orderBy('uid').limit(this.state.limit)

            let documentSnapshots = await initialQuery.get()
            await documentSnapshots.docs.map(function(document){
                console.log(document.data().uid)
                if(document.data().uid === firebase.auth().currentUser.uid){
                    console.log('asta esti tu')
                }else if(arr.includes(document.data())){
                    console.log('am deja')
                }
                else{
                    arr.push(document.data())
                }
            })
            // console.log(arr)
            this.setState({
                documentData: arr
            })
            this.setState({
                loading: false,
                refreshing: false
            })
            console.log(this.state.documentData)
        }catch(error){
            console.log(error)
        }
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
      firebase.firestore().collection("friends").doc(firebase.auth().currentUser.uid).collection("sent").doc(uid).set({
        accepted: false,
        request: "pending",
        receiver: uid
      })

      firebase.firestore().collection("friends").doc(uid).collection("received").doc(firebase.auth().currentUser.uid).set({
          accepted: false,
          request: "pending",
          sender: firebase.auth().currentUser.uid
      })

    }
    render(){
        return(
            <SafeAreaView style={styles.container}>
                <FlatList
                 data = {this.state.filteredData && this.state.filteredData.length > 0 ? this.state.filteredData : this.state.documentData}
                 renderItem={({item}) => (
                    <AddFriend discriminator={item.discriminator} displayName={item.displayName} profilePicture={item.profilePicture} press={() => this._sendRequest(item.uid)}/>
                 )}   
                keyExtractor={(item, index) => String(index)}
                ListHeaderComponent={this.renderHeader}
                ListFooterComponent={this.renderFooter}
                onEndReached={this.retrieveMore}
                onEndReachedThreshold={0}
                refreshing={this.state.refreshing}
                />
            </SafeAreaView>
        )
    }
    
  
}

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