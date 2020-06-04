import React, { Component } from 'react'
import { Text, Input, Button, Icon } from 'react-native-elements'
import { Platform, KeyboardAvoidingView, View, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native'
import { timing } from 'react-native-reanimated'
import firebase from 'firebase'
import * as Font from 'expo-font'
import { TouchableHighlight } from 'react-native-gesture-handler'

export default class MessageComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            msg: props.msg,
            date: props.date,
            sender: props.sender,
            translatedDate: '',
            marginLeft: 0,
            marginRight: 0,
            fontsLoaded: false

        }
    }

    
  _renderTimestamps = (timestamp) => {
    let date = new Date(timestamp * 1000)
    let hours = date.getHours()
    let minutes = "0" + date.getMinutes()
    let seconds = "0" + date.getSeconds()

    let formattedTime = hours + ":" + minutes.substr(-2)
    return formattedTime
  } 

    componentDidMount = async() => {
        await Font.loadAsync({
            font1: require('../../../assets/SourceSansPro-Black.ttf'),
            font2: require('../../../assets/SourceSansPro-Regular.ttf')
        })
        this.setState({
            fontsLoaded: true
        })
        console.log(this.state.sender)
        console.log("-----------------------------------------")
        console.log(this.state.date)
        console.log("-----------------------------------------")
        let theDate = new Date(this.state.date + 3 * 3600000);
        let dateString = theDate.toGMTString();
        this.setState({ translatedDate: dateString })
        console.log("Data este", dateString)
        if (this.state.sender == firebase.auth().currentUser.uid)
            this.setState({
                marginLeft: 50,
                marginRight: 0
            })
        else
            this.setState({
                marginLeft: 0,
                marginRight: 50
            })
    }
    //{this.state.translatedDate}
    render() {
        if(this.state.fontsLoaded)
{
        return (
            <View style={[styles.submit, {marginLeft: this.state.marginLeft, marginRight: this.state.marginRight, alignSelf:(this.state.sender == firebase.auth().currentUser.uid) ? 'flex-end' :"flex-start", flex: 0, flexDirection: 'row'}]}>
                <Text style={{fontFamily: 'font1'}}>{this.state.msg}</Text>
                <Text style={{fontFamily: 'font2', marginLeft: 20}}>{this._renderTimestamps(this.state.date)}</Text>
        </View>
        )
        }else{
            return(
                <ActivityIndicator size="large"/>
            )
        }
    }

}

const styles = StyleSheet.create({
    submit:{
        paddingTop:10,
        paddingBottom:10,
        backgroundColor:'#daf5c4',
        borderRadius:10,
        borderWidth: 1,
        borderColor: 'transparent',
        marginBottom: 2,
        paddingLeft: 10,
        paddingRight: 10,
        // alignSelf: 'flex-start'
    },
      submitText:{
          color:'#fff',
          textAlign:'center',
      }
})