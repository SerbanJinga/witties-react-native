import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, ActivityIndicator, SafeAreaView, Button } from 'react-native'
import { Text, Divider } from 'react-native-elements'
import firebase from 'firebase'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import { Notifications } from 'expo'
import * as Permissions from 'expo-permissions'
import Constants from 'expo-constants';
const { width, height } = Dimensions.get('window')
let arr = []
export default class FriendList extends Component {
    constructor(props){
        super(props)
        this.state = {
            documentData: [],
            friendRequestsReceived: []
        }
    }
     

    _retrieveFriendRequests = async() => {
        console.log('alta iteratie')
        let receivedQuery = await firebase.firestore().collection("friends").doc(firebase.auth().currentUser.uid).collection("received")
        let documentSnapshotsReceived = await receivedQuery.get()
        documentSnapshotsReceived.docs.map(doc => {if(doc.data().accepted === true){this.cinetiadatrequest(doc.data().sender)}})
       

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
        this._retrieveFriendRequests()
    }

    render(){
        return(
            <View>
                <Text style={{fontSize: 40, textAlign: 'center', marginTop: 20}}>prieteni</Text>
                <SafeAreaView style={styles.container}>
                <FlatList
                 data = {this.state.documentData}
                 renderItem={({item}) => (
                     <View style={styles.itemContainer}>
                        <Text>{item.displayName}#{item.discriminator}</Text>
                    
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