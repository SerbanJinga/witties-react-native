import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, ActivityIndicator, SafeAreaView, Button } from 'react-native'
import { Text, Divider } from 'react-native-elements'
import firebase from 'firebase'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import { Notifications } from 'expo'
import * as Permissions from 'expo-permissions'
import Constants from 'expo-constants';
const { width, height } = Dimensions.get('window')
let text = 'vasile'
let arr = []
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export default class ReceiveFriendRequest extends Component {
    constructor(props){
        super(props)
        this.state = {
            documentData: [],
            friendRequestsReceived: []
        }
    }
     


    async waitAndMakeRequest(update_rate) {
        console.log('update')
        this.retrieveData()
        await delay(update_rate).then(() => {
  
            this.waitAndMakeRequest(update_rate);}
  
        )
    }

    



    _retrieveFriendRequests = async() => {
        let initialQuery = await firebase.firestore().collection("friends").doc(firebase.auth().currentUser.uid).collection("received")
        let documentSnapshots = await initialQuery.get()
        documentSnapshots.docs.map(doc => {if(doc.data().accepted !== true) {this.cinetiadatrequest(doc.data().sender)}})
        
    }


    cinetiadatrequest = async(uid) => {
        let initialQuery = await firebase.firestore().collection("users").doc(uid)
        let documentSnapshots = await initialQuery.get()
        let documentData = documentSnapshots.data()
        arr.push(documentData)
        console.log(arr.length)
        this.setState({
            documentData: arr
        })
        console.log(this.state.documentData)

    }

    componentDidMount(){
        this.waitAndMakeRequest(2000)
        try{
            this._retrieveFriendRequests()
        }catch(error){
            console.log(error)
        }
        console.log('=================================')
        console.log('=================================')
    }
   
    _acceptFriend = async(uid) => {
        firebase.firestore().collection("friends").doc(firebase.auth().currentUser.uid).collection("received").doc(uid).update({
            accepted: true,
            request: "prieteni"
        })
        firebase.firestore().collection("friends").doc(uid).collection("sent").doc(firebase.auth().currentUser.uid).update({
            accepted: true,
            request: "prieteni"
        })
    }

    render(){
        return(
            <View>
                <Text style={{fontSize: 40, textAlign: 'center', marginTop: 20}}>ai primit cereri de la </Text>
                <SafeAreaView style={styles.container}>
                <FlatList
                 data = {this.state.documentData}
                 renderItem={({item}) => (
                     <View style={styles.itemContainer}>
                        <Text>{item.displayName}#{item.discriminator}</Text>
                        <Button title="Accept friend" onPress={() => this._acceptFriend(item.uid)}/>
                     </View>
                 )}   
                keyExtractor={(item, index) => String(index)}
                ListHeaderComponent={this.renderHeader}
                ListFooterComponent={this.renderFooter}
                onEndReached={this.retrieveMore}
                onEndReachedThreshold={0}
                refreshing={this.state.refreshing}
                />
            </SafeAreaView>
            </View>
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
    borderWidth: 10,
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