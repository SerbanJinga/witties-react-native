import React, { Component } from 'react'
import { Text, View, StyleSheet, Button, Dimensions } from 'react-native'
import firebase from 'firebase'
const { width, height } = Dimensions.get('window')

export default class HomeContainer extends Component {
    // _signOut = () => {
    //     firebase.auth().signOut().then(this.props.navigation.navigate('Loading')).catch(err => console.log(err))
    // }
    render(){
        return (
            <View style={styles.container}>
                <Text style={{marginTop: 80, textAlign: 'center'}}>Home</Text>
                <Button
                    title="Sign Out"
                    onPress = {() => this._signOut()}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: height,
        width: width
    }
})