import React, { Component } from 'react'
import { View, Stylesheet, Dimensions, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'
import { Text, Overlay, SearchBar } from 'react-native-elements'
import firebase from 'firebase'
import * as Font from 'expo-font'
import { AntDesign, Entypo } from '@expo/vector-icons'

import AllFriendsComponent from './AllFriendsComponent'
let arr = []
const { width, height } = Dimensions.get('window')
export default class AllFriends extends Component{
    constructor(props){
        super(props)
        this.state = {
            documentData: [],
            fontsLoaded: false,
            overlayFriends: false,
            searchText: "",
            filteredData: []
        }
    }

    searchMore = () => {
        this.setState({
            overlayFriends: true
        })
    }
    closeSearch = () => {
        if(this.state.overlayFriends === false){
            console.log('totusi merge')
        }else{
        this.setState({
            overlayFriends: false
        })}
    }

    retrieveData = async () => {
        let initialQuery = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
        let documentSnapshots = await initialQuery.get()
        let documentData = await documentSnapshots.data().friends
        documentData.forEach(element => this.retrieveFriend(element))
    }

    retrieveFriend = async (uid) => {
        let initialQuery = await firebase.firestore().collection("users").doc(uid)
        let documentSnapshots = await initialQuery.get()
        let documentData = documentSnapshots.data()
        arr.push(documentData)
        arr.sort((a, b) => {
            return a.displayName > b.displayName
        })
        this.setState({
            documentData: arr
        })
    }


    search = (searchText) => {
        this.setState({searchText: searchText})
        let filteredData = this.state.documentData.filter(function(item){
            return item.displayName.toLowerCase().includes(searchText)
        })
        this.setState({filteredData: filteredData})
    }
    componentDidMount = async () => {
        arr = []
        await Font.loadAsync({
            font1: require('../../../assets/SourceSansPro-Black.ttf')
        }).then(this.setState({
            fontsLoaded: true
        }))
        await this.retrieveData()
        
    }

    render(){
        if(this.state.fontsLoaded){
        return(
            <View style={{flex: 1}}>
            <FlatList
                data={this.state.documentData}
                renderItem={({item}) => (
                    
                    <AllFriendsComponent close={() => this.closeSearch()} uid={item.uid} careScore={item.careScore} displayName={item.displayName} discriminator={item.discriminator} profilePicture={item.profilePicture} press={() => this._acceptFriend(item.uid)}/>
                )}
                ListFooterComponent={<TouchableOpacity onPress={() => this.searchMore()} style={{alignSelf: 'center'}}><Text style={{fontFamily: 'font1'}}>Search more</Text></TouchableOpacity>}

            />
            <Overlay isVisible={this.state.overlayFriends} fullScreen overlayStyle={{width: width}} animationType="slide">
                <View style={{flex: 1}}>
                <View style={{flex: 0, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TouchableOpacity onPress={() => this.closeSearch()}>
                    <AntDesign
                        size={26}
                        name="down"
                        color="#b2b8c2"
                    />
                    </TouchableOpacity>
                    <Text style={{fontFamily: 'font1', fontSize: 20}}>All Friends</Text>
                    <TouchableOpacity onPress={() => this._openOptions()}>
                    <AntDesign
                        size={26}
                        name="bars"
                        color="#b2b8c2"
                    />
                    </TouchableOpacity>
                </View>
                <View style={{flex: 0, flexDirection: 'row', alignItems: 'center', alignContent: 'center'}}>  
              <SearchBar round placeholder="Search" style={{fontFamily: 'font1', padding: 20}} lightTheme inputStyle={{fontFamily: 'font1'}} placeholderTextColor="#ecedef" containerStyle={{
    backgroundColor:"#fff",
    borderBottomColor: '#ecedef',
    borderTopColor: '#ecedef',
    borderLeftColor: '#ecedef',
    borderRightColor: '#ecedef',
    borderWidth: 1,
    borderRadius: 10,
    margin: 10,
    width: width / 1.2
}}  inputContainerStyle={{backgroundColor: '#fff', height: 30}} value={this.state.searchText} onChangeText={this.search} />
            <TouchableOpacity onPress={() => this.openFilter()}>
                <AntDesign name="filter" size={20}/>
            </TouchableOpacity>

           </View>
           <FlatList
                 data = {this.state.filteredData && this.state.filteredData.length > 0 ? this.state.filteredData : this.state.documentData}
                renderItem={({item}) => (
                    
                    <AllFriendsComponent close={() => this.closeSearch()} uid={item.uid} careScore={item.careScore} displayName={item.displayName} discriminator={item.discriminator} profilePicture={item.profilePicture} press={() => this._acceptFriend(item.uid)}/>
                )}

            />
                </View>
            </Overlay>
            </View>

        )}else{
            return(<ActivityIndicator size="large"/>)
        }
    }
}