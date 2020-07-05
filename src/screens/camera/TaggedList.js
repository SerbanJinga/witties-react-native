import React, { Component } from 'react'
import { Text, View, SafeAreaView, Dimensions, TouchableOpacity, FlatList, ScrollView } from 'react-native'
import {SearchBar} from 'react-native-elements'
import { AntDesign } from '@expo/vector-icons'
import firebase from 'firebase'
import TagList from './TagList'
const {width, height} = Dimensions.get('window')
let arr = []


export default class TaggedList extends Component {
    constructor(props){
        super(props)
        this.state = {
            documentData: [],
            taggedUsers: [],
        }
        
    }

    _retrieveData = async () => {
        const currentUid = firebase.auth().currentUser.uid
        let initialQuery = await firebase.firestore().collection('users').doc(currentUid).get()
        let documentData = await initialQuery.data().friends
        documentData.forEach(document => this._retrieveFriend(document))
    }

    _retrieveFriend = async (document) => {
        let initialQuery = await firebase.firestore().collection('users').doc(document).get()
        let documentData = await initialQuery.data()
        arr.push(documentData)
        this.setState({
            documentData: arr
        })
    }

    
    componentDidMount = async () => {
        arr = []
        await this._retrieveData()

    }

    mama = (uid) => {
        const taggedFinal = this.state.taggedUsers
        taggedFinal.push(uid)
        this.setState({
            taggedUsers: taggedFinal
        })
        console.log(this.state.taggedUsers)
    }

    tata = (uid) => {
        let taggedFinal = this.state.taggedUsers
        for(let i = 0; i < taggedFinal.length; i++)
            if(taggedFinal[i] === uid)
                taggedFinal.splice(i, 1)
        this.setState({
            taggedUsers: taggedFinal
        })
        console.log(this.state.taggedUsers)

    }

    render(){
        return(
            <SafeAreaView style={{flex: 1}}>
            <View style={{flex: 0, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40}}>
            <TouchableOpacity onPress={() => this.props.close(this.state.taggedUsers)}>
            <AntDesign
                size={26}
                name="down"
                color="#b2b8c2"
            />
            </TouchableOpacity>
            <Text style={{fontFamily: 'font1', fontSize: 20}}>Tag Friends</Text>
            <AntDesign
                size={26}
                name="bars"
                color="#b2b8c2"
            />
        </View>
            <ScrollView style={{flex: 1}}>
                    <SearchBar round placeholder="Search" style={{fontFamily: 'font1', padding: 20}} lightTheme inputStyle={{fontFamily: 'font1'}} placeholderTextColor="#ecedef" containerStyle={{
                    backgroundColor:"#fff",
                    borderBottomColor: '#ecedef',
                    borderTopColor: '#ecedef',
                    borderLeftColor: '#ecedef',
                    borderRightColor: '#ecedef',
                    borderWidth: 1,
                    borderRadius: 10,
                    margin: 10,
                    width: width / 1.1,
                    alignSelf: 'stretch'
                }}  inputContainerStyle={{backgroundColor: '#fff', height: 30}} value={this.state.searchText} onChangeText={this.search} />
      

      <FlatList 
          data={this.state.documentData}
          renderItem={({item}) => (
            <TagList displayName={item.displayName} profilePicture={item.profilePicture} mama={this.mama} tata={this.tata} id={item.uid}/>
          )}
      />
            </ScrollView>

        </SafeAreaView>
        )
    }
}