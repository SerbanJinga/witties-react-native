import React, { Component } from 'react'
import { Button, Text } from 'react-native-elements'
import { View, Dimensions, StyleSheet } from 'react-native'
import firebase from 'firebase'
import { render } from 'react-dom'
import { FlatList } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'

const { width, height } = Dimensions.get('window')
const groupsIn = []
const arr = []
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export default class ChatRoomsList extends Component {
    constructor(props){
        super(props)
        this.state = {
            documentData: [],
            groupsIn: []
        }
    }

    componentDidMount = () => {
        console.log('se randeazaa')
        this._retrieveData()
        // this.waitAndMakeRequest(2000)
        this._getDataFromId()
    }

    async waitAndMakeRequest(update_rate) {
       try{ this.retrieveData()
       }catch(err){
           console.log(err)
       }
    }

    

    _retrieveData = async () => {
    
        const currentId = firebase.auth().currentUser.uid
        let inititalQuery = await firebase.firestore().collection("messages")
        let documentSnapshots = await inititalQuery.get()
        let documentData = (await documentSnapshots).docs.map(doc => {
            if(doc.data().usersParticipating){
                for(let i = 0; i < doc.data().usersParticipating.length; i++){
                    if(currentId === doc.data().usersParticipating[i])
                        groupsIn.push(doc.data().roomId)
                }
            }
        })

        this.setState({groupsIn: groupsIn})
        // console.log(this.state.groupsIn)
        
        this.state.groupsIn.forEach(group => this._getDataFromId(group))
    }
    

    _getDataFromId = async(group) => {
        let inititalQuery = await firebase.firestore().collection("messages").where('roomId', '==', group)
        let documentSnapshots = await inititalQuery.get()
        let documentData =  documentSnapshots.docs.map(doc => doc.data())    
        documentData.forEach(doc => arr.push(doc))
        this.setState({
            documentData: arr
        })
        console.log(this.state.documentData)
    }
    

    render(){
        return(
            <SafeAreaView>
           <FlatList
                data={this.state.documentData}
                 renderItem={({item}) => (
                     <View style={styles.itemContainer}>
                    <Text>{item.chatRoomName}</Text>
                    <Text>roomId: {item.roomId}</Text>    
                   
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
        )
    }
}

const styles = StyleSheet.create({
    itemContainer: {
        width: width,
        borderWidth: 4,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
      },
})
// Array [
//     Array [
//       "QCLKoR1skhUEExopmeZLqQ7a9Ir1",
//       "6dzUyVMOP1YVQG48OHTe6iOSz5l1",
//     ],
//     Array [
//       "QCLKoR1skhUEExopmeZLqQ7a9Ir1",
//     ],
//     Array [
//       "QCLKoR1skhUEExopmeZLqQ7a9Ir1",
//       "6dzUyVMOP1YVQG48OHTe6iOSz5l1",
//       "Opa2XaEoO2Y8NJtQrDatCgLsIMx2",
//     ],
//     Array [
//       "QCLKoR1skhUEExopmeZLqQ7a9Ir1",
//       "6dzUyVMOP1YVQG48OHTe6iOSz5l1",
//     ],
//     Array [
//       "6dzUyVMOP1YVQG48OHTe6iOSz5l1",
//     ],
//     Array [
//       "QCLKoR1skhUEExopmeZLqQ7a9Ir1",
//     ],
//   ]