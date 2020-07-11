import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, ActivityIndicator } from 'react-native'
import firebase from 'firebase'
import * as theme from '../styles/theme'
const { width, height } = Dimensions.get('window');
import * as Font from 'expo-font'

export default class LoadingScreen extends Component {

    constructor(props){
        super(props)
        this.state = {
            fontLoaded: false
        }
    }

     componentDidMount =  async() => {
        await Font.loadAsync({
            font1: require('../../assets/SourceSansPro-Black.ttf')
        })
      
        
        
        firebase.auth().onAuthStateChanged(user => {
            if(user){
                this.props.navigation.navigate('Home')
            }else{
                this.props.navigation.navigate('SignUp')
            }
        })
    }


    render(){
        return(
            <View style={styles.container}>
                <ActivityIndicator size="large" color={theme.colors.blue}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})