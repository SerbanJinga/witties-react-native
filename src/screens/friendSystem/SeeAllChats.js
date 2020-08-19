import React, { Component } from 'react'
import { View, SafeAreaView, Dimensions, TouchableOpacity, FlatList, Text } from 'react-native'
const { width, height } = Dimensions.get('window')
let arr = []
import { AntDesign } from '@expo/vector-icons'
import { withNavigation } from 'react-navigation'
import firebase from 'firebase'
import SeeAllChat from './SeeAllChat'

class SeeAllChats extends Component {
    constructor(props){
        super(props)
        this.state = {
            documentData: []
        }
    }

    componentDidMount = async() => {
        await this.retrieveData()
    }

    retrieveData = async() => {
        let query = await firebase.firestore().collection('messages').where('usersParticipating', 'array-contains', firebase.auth().currentUser.uid).get()
        let data = query.docs.map(doc => doc.data())
        data.forEach(element => {
            let foo = {
                chatRoomName: element.chatRoomName,
                groupPicture: element.profilePicture
            }
            arr.push(foo)
        })
        this.setState({
            documentData: arr
        })

    }

    render(){
        return(
            <SafeAreaView style={{ flex: 1 }}>

                <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-between', padding: 10, alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.goBack()}
                        style={{
                            backgroundColor: 'transparent',

                        }}>
                        <AntDesign
                            name="arrowleft"
                            style={{ fontSize: 24, fontWeight: "bold" }}
                        />
                    </TouchableOpacity>
                </View>
                {this.state.documentData.length !== 0 ?
           <Text style={{fontFamily: 'font1', fontSize: 24, margin: 10}}>Your Chats</Text>
           : <Text style={{fontFamily: 'font1', fontSize: 24, margin: 10}}>Your Currently have no chats.</Text>}
                <FlatList
                    data={this.state.documentData}
                    renderItem={({item}) => (
                        <SeeAllChat groupPicture={item.groupPicture} chatRoomName={item.chatRoomName}/>
                    )}
                    keyExtractor={(item, index) => String(index)}

                />
            </SafeAreaView>
        )
    }
}

export default withNavigation(SeeAllChats)