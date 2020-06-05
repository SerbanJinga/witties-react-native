import React, { Component } from 'react'
import { Button, Text, CheckBox } from 'react-native-elements'
import { View, Dimensions, StyleSheet, ActivityIndicator } from 'react-native'
import firebase from 'firebase'
import { render } from 'react-dom'
import { FlatList } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { withNavigation } from 'react-navigation';
import ActivityPopupChatroomSelect from '../ActivityPop/ActivityPopupChatroomSelect'
import Room from './Room'

const { width, height } = Dimensions.get('window')
let groupsIn = []
let arr = []
let grupuri = []

class ChatRoomsList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            documentData: [],
            groupsIn: [],
            refreshing: false,
            type: props.type,
            gruperino: [],
            story: false,
            loading: false,
            limit: 6,
            lastVisible: null
        }
        this.mama = this.mama.bind(this)
        this.tata = this.tata.bind(this)
    }

    componentDidMount = async () => {
        groupsIn = []
        arr = []
        grupuri = []
        await this._retrieveData()
       

    }

    //


    mama = (uid) => {
        grupuri.push(uid)
        this.setState({ gruperino: grupuri })
        console.log(this.state.gruperino)
    }

    tata = (uid) => {
        let grp = this.state.gruperino
        for (let i = 0; i < grp.length; i++) {
            if (grp[i] === uid)
                grp.splice(i, 1)
        }
        this.setState({ gruperino: grp })
        console.log(this.state.gruperino)
    }

    _retrieveData = async () => {
        try{
            this.setState({
                loading: true
            })
        let query = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
        let snapshot = await query.get()
        let myData = snapshot.data().chatRoomsIn
        console.log(myData)
       myData.forEach(document => this._getDataFromId(document))
        }catch(error){
            console.log(error)
        }
    }
    
    _retriveMore = async () => {
        try{
            this.setState({
                refreshing: true
            })
            let additionalQuery = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
            let additionalSnapshots = await additionalQuery.get()
            let additionalData = additionalSnapshots.data().chatRoomsIn
            additionalData.forEach(document => this._getMoreDataFromId(document))
        }catch(err){
            console.log(err)
        }
    }
    _getMoreDataFromId = async (group) => {
        let inititalQuery = await firebase.firestore().collection("messages").where('roomId', '==', group).startAfter(this.state.lastVisible).limit(this.state.limit)
        let documentSnapshots = await inititalQuery.get()
        let documentData = documentSnapshots.docs.map(doc => doc.data())
        let lastVisible = documentData[documentData.length - 1]
        this.setState({
            documentData: [...this.state.documentData, ...documentData],
            lastVisible: lastVisible,
            refreshing: false

        })

        console.log('DaiFJIAFJKAFJAKFJAFJAFKJFAKAFJKFAJ')
        
        console.log(this.state.lastVisible)
    }

    renderHeader = () => {
        try{
            if(this.state.loading || this.state.refreshing){
                return(
                    <View>
                        <ActivityIndicator size="large"/>
                    </View>
                )
            }else{
                return null
            }
        }catch(err){
            console.log(err)
        }
    }


    _getDataFromId = async (group) => {
        let inititalQuery = await firebase.firestore().collection("messages").where('roomId', '==', group).limit(this.state.limit)
        let documentSnapshots = await inititalQuery.get()
        let documentData = documentSnapshots.docs.map(doc => doc.data())
        documentData.forEach(doc => arr.push(doc))
        let lastVisible = documentData[documentData.length - 1]
        this.setState({
            documentData: arr,
            lastVisible: lastVisible,
            loading: false

        })

    }


    render() {

        if (this.state.type !== 0) {
            return (
                <SafeAreaView>
                    <FlatList
                        data={this.state.documentData}
                        renderItem={({ item, index }) => (

                            
                            <Room profilePicture={item.profilePicture} roomId={item.roomId} chatRoomName={item.chatRoomName} press={() => this.props.navigation.navigate("ChatRoom", { iqdif: item.chatRoomName, roomId: item.roomId, profilePicture: item.profilePicture }) }/>
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
        } else {
            return (<View>
                <FlatList
                    data={this.state.documentData}
                    renderItem={({ item }) => (
                        <ActivityPopupChatroomSelect name={item.roomId} nem={item.chatRoomName} mama={this.mama} tata={this.tata} />

                    )}
                    keyExtractor={(item, index) => String(index)}
                    ListHeaderComponent={<CheckBox title='Your Story' checked={this.state.story} onPress={() => { (this.state.story) ? this.setState({ story: false }) : this.setState({ story: true }) }} />}
                    
                    onEndReached={this.retrieveMore}
                    onEndReachedThreshold={0}
                    refreshing={this.state.refreshing}
                />
                <View style={styles.moodView}>
                    <Button title='Done' type='clear' containerStyle={{
                        marginHorizontal: 15,
                        backgroundColor: '#f5f6fa',
                        borderRadius: 30,
                        width: width * 0.3,
                    }} onPress={() => { this.props.sloboz(this.state.gruperino,this.state.story) }} />
                    </View>
            </View>)
        }
    }
}

export default withNavigation(ChatRoomsList)
const styles = StyleSheet.create({
    itemContainer: {
        width: width,
        borderWidth: 4,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    }, bigButton: {
        marginHorizontal: 15,
        backgroundColor: '#f5f6fa',
        borderRadius: 30,
        width: width * 0.3,

    }, moodView: {
        flexDirection: "row",
        justifyContent: 'center',
        marginBottom: 10,
    }
})
