import React, { Component } from 'react'
import { Text, View } from 'react-native'
import firebase from 'firebase'
import { FlatList } from 'react-native-gesture-handler'
import StreakVideoComponent from './StreakVideoComponent'
let arr = []

export default class StreakVideo extends Component {
    constructor(props){
        super(props)
        this.state = {
            allStreaks: []
        }
    }

    retrieveData = async() => {
        let initialQuery = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
        let documentSnapshots = await initialQuery.get()
        let documentData = await documentSnapshots.data().chatRoomsIn
        
        for(let i = 0; i < documentData.length; i++){
         this.getStreakFromChatRoomId(documentData[i])
        }
    }

    getStreakFromChatRoomId = async(id) => {
        let initialQuery = await firebase.firestore().collection('messages').doc(id)
        let documentSnapshots = await initialQuery.get()
        let documentData = await documentSnapshots.data().streakVideo
        arr.push(documentData)
        // console.log(arr)
        this.setState({
            allStreaks: arr
        })
        console.log(this.state.allStreaks)
        this.state.allStreaks.map(streak => console.log(streak))
    }

    componentDidMount = async() => {
        arr = []
        this.retrieveData()
    }


    render(){
        return(
            <View style={{flex: 1}}>
                <FlatList
                 data = {this.state.allStreaks}
                 renderItem={({item}) => (
                    <StreakVideoComponent video={item}/>

                 )}   
                keyExtractor={(item, index) => String(index)}
                />
            
            </View>
        )
    }
}