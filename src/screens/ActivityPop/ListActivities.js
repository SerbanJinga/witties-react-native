import React, { Component } from 'react'
import { View, ScrollView, FlatList } from 'react-native'
import { Button, Input } from 'react-native-elements'
import firebase from 'firebase'
import ActivitySelect from './ActivitySelect'
import { Ionicons } from '@expo/vector-icons'
export default class ListActivities extends Component{
    constructor(props){
        super(props)
        this.state = {
            documentData: [],
            input: "",
            selectedActivity: ""
        }
    }

    addActivity = (uid) => {
        // console.log(uid)
        this.setState({
            selectedActivity: uid
        })
        this.props.close(uid)

    }

    removeActivity = (uid) => {
        if(this.state.selectedActivity === uid)
            console.log('aia e')
        this.setState({
            selectedActivity: ""
        })
    }

    retrieveData = async() => {
        const currentUid = firebase.auth().currentUser.uid
        let initialQuery = await firebase.firestore().collection('users').doc(currentUid).get()
        let documentData = await initialQuery.data().customActivities
        this.setState({
            documentData: documentData
        })
    }

    componentDidMount = async () => {
        await this.retrieveData()
    } 

    createNewActivityInDb() {
        firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
            customActivities: this.state.documentData,
        })

    }
    
    render(){
        return(
                <ScrollView style={{flex: 1}}>
                    <FlatList
                        data={this.state.documentData}
                        renderItem={({item}) => (
                            <ActivitySelect mama={this.addActivity} name={item} tata={this.removeActivity} />

                        )}
                        keyExtractor={(item, index) => String(index)}


                    />
                    
                    <Input placeholder="Add a new activity" rightIcon={<Ionicons name="ios-add" size={28} onPress={() => {
                        if(this.state.input === ''){
                            return
                        }
                        let f = this.state.documentData
                        f.push(this.state.input)
                        this.setState({
                            documentData: f,
                            input: ""
                        })
                        this.createNewActivityInDb()

                    }}/>}
                        value={this.state.input}
                        onChangeText={input => this.setState({ input })}

                    />
                </ScrollView>
        )
    }
}