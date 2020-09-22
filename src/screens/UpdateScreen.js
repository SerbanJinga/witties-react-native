import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, ActivityIndicator, Text } from 'react-native'
import firebase, { app } from 'firebase'
import * as theme from '../styles/theme'
const { width, height } = Dimensions.get('window');
import * as Font from 'expo-font'
import AsyncStorage from '@react-native-community/async-storage';
import Constants from 'expo-constants'
import { withNavigation } from 'react-navigation';
let arr = []

let settings 
class UpdateScreen extends Component {

    constructor(props){
    super(props)
        this.state = {
            fontsLoaded: false
        }
    }

    componentDidMount = async() => {
        await Font.loadAsync({
            font1: require('../../assets/SourceSansPro-Black.ttf')
        }).then(this.setState({
            fontsLoaded: true
        }))
    }

    

  

  
    render(){
        if(this.state.fontsLoaded){
        return(
<View style={styles.container}>
            <Text style={{fontFamily: 'font1', fontSize: 16, alignSelf: 'center', justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>The app has been updated.</Text>
            <Text style={{fontFamily: 'font1', fontSize: 16, alignSelf: 'center', justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>Please install the latest version.</Text>
             </View>)}else{
                 return <View></View>
             }
    }
}

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default withNavigation(UpdateScreen)

