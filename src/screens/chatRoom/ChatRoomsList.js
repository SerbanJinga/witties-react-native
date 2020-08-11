import React, { Component } from 'react'
import { Button, Text, CheckBox, SearchBar, Overlay, ButtonGroup, Divider } from 'react-native-elements'
import { View, Dimensions, StyleSheet, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native'
import firebase from 'firebase'
import { render } from 'react-dom'
import { FlatList, ScrollView,  } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { withNavigation } from 'react-navigation';
import ActivityPopupChatroomSelect from '../ActivityPop/ActivityPopupChatroomSelect'
import Room from './Room'
import { AntDesign } from '@expo/vector-icons'
import { last } from 'lodash'

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
            lastVisible: null,
            searchChats: "",
            filteredData: [],
            filter: false,
            index: null,
            filterBy: "",
            type: 2
        }
        this.mama = this.mama.bind(this)
        this.tata = this.tata.bind(this)
        this.updateIndex = this.updateIndex.bind(this)
    }


    searchChats = (searchChats) => {
        this.setState({searchChats: searchChats})
        let filteredData = this.state.documentData.filter(function(item){
            return item.chatRoomName.includes(searchChats)
        })
        this.setState({filteredData: filteredData})
      }
    componentDidMount = async () => {
        groupsIn = []
        arr = []
        grupuri = []
        await this._retrieveData()
       

    }

    


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
    
    const uid = firebase.auth().currentUser.uid
        firebase.firestore().collection('users').where('uid', '==', uid).onSnapshot((doc) => {
            let documentData = doc.docs.map(doc => doc.data().chatRoomsIn)
            let usersChats = documentData[0]
            arr = []
            this.getChats(usersChats)
        
            console.log(usersChats , 'udpata0toaptaoptro')
        })

    }

    getChats = async (usersChats) => {
        usersChats.forEach(async chat => {
            let query = await firebase.firestore().collection('messages').doc(chat).get()
            
            
            let chatName = query.data().chatRoomName
            let chatPicture = query.data().profilePicture
            let chatId = query.data().roomId
            let foo = {
                chatName: chatName,
                chatPicture: chatPicture,
                roomId: chatId
            }
            arr.push(foo)
            this.setState({
                documentData: arr
            })
            console.log(foo, 'se updateaza')
        })
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
        // let lastVisible = arr[arr.length - 1]
        this.setState({
            documentData: arr,
            // lastVisible: lastVisible,
            loading: false

        })

        // console.log("LSASLOAG AGKAGAG", this.state.lastVisible)

    }

    openFilter = () => {
        this.setState({
            filter: true
        })
    }

    closeFilter = () => {
        this.setState({
            filter: false
        })
    }
    updateIndex(selectedIndex){
        this.setState({
            index: selectedIndex
        })
    }
    date = () => {
        this.setState({
            filterBy: "date"
        })


    }


    render() {
//={{type: 'antdesign', name: 'filter'}}

        if (this.state.type !== 0) {
            return (
                <View>
                <ScrollView style={{flex: 1}}>
                <SearchBar round placeholder="Search" style={{fontFamily: 'font1', padding: 20}} lightTheme inputStyle={{fontFamily: 'font1'}} placeholderTextColor="#ecedef" containerStyle={{
    backgroundColor:"#fff",
    borderBottomColor: '#ecedef',
    borderTopColor: '#ecedef',
    borderLeftColor: '#ecedef',
    borderRightColor: '#ecedef',
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 10
}}  inputContainerStyle={{backgroundColor: '#fff', height: 30}} 
    value={this.state.searchChats}
    onChangeText={this.searchChats}
/>
                    {this.state.documentData.length !== 0 ?
                    <FlatList
                    data={this.state.filteredData && this.state.filteredData.length > 0 ? this.state.filteredData : this.state.documentData}
                        renderItem={({ item, index }) => (

                            
                            <Room profilePicture={item.chatPicture} roomId={item.roomId} chatRoomName={item.chatName} press={() => this.props.navigation.navigate("ChatRoom", { iqdif: item.chatName, roomId: item.roomId, profilePicture: item.chatPicture }) }/>
                        )}
                        keyExtractor={(item, index) => String(index)}
                        ListHeaderComponent={this.renderHeader}
                        ListFooterComponent={this.renderFooter}
                        onEndReached={this.retrieveMore}
                        onEndReachedThreshold={0}
                        refreshing={this.state.refreshing}
                    />:  <Text style={{fontFamily: 'font1', fontSize: 15, margin: 4, alignSelf: 'center'}}>You have no active chats.</Text>}
           </ScrollView>
                </View>
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
