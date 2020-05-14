import React, { Component } from 'react'
import { Text, Input, Button, Icon } from 'react-native-elements'
import { Platform, KeyboardAvoidingView, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { timing } from 'react-native-reanimated'
import firebase from 'firebase'

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

        }
    }
    componentDidMount() {
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
        return (<Button title={this.state.msg + this.state.translatedDate} containerStyle={{ backgroundColor: 'black', borderRadius: 15, marginRight: this.state.marginRight, marginLeft: this.state.marginLeft }} />)
    }
}