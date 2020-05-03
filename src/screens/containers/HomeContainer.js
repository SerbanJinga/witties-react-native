import React, { Component } from 'react'
import { Text, View, StyleSheet, Button, Dimensions, ScrollView } from 'react-native'
import firebase from 'firebase'
const { width, height } = Dimensions.get('window')

export default class HomeContainer extends Component {
    
    constructor(props){
        super(props)
        this.state = {
            displayName: "",
            discriminator: ""
        }
        this.retrieveData()

    }

    retrieveData = async() => {
        const docRef = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid);
        docRef.get().then(doc => {
          if(doc.exists){
            this.setState({
                displayName: doc.data().displayName,
                discriminator: doc.data().discriminator
            })
          }else{
            console.log('Undefined document')
          }
        }).catch(function(err){
          console.log(err)
        })
        console.log(this.state.displayName)
    }

    componentDidMount(){
    }

    componentWillUpdate(){

    }

    render(){
        return (
            <ScrollView style={styles.container}>
                <Text style={{marginTop: 80, textAlign: 'center'}}>{this.state.displayName}#{this.state.discriminator} </Text>
                <Button
                    title="Sign Out"
                    onPress = {() => this._signOut()}
                />
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: height,
        width: width
    }
})