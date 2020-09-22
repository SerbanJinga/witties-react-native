import React, { Component } from 'react'
import { Text, Input, Button, Icon } from 'react-native-elements'
import { Platform, KeyboardAvoidingView, View, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native'
import { timing } from 'react-native-reanimated'
import firebase from 'firebase'
import * as Font from 'expo-font'
import { TouchableHighlight } from 'react-native-gesture-handler'
const { width, height } = Dimensions.get('window')

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
            fontsLoaded: false,
            displayName: "",
            newDay: props.newDay,
            day: ''

        }
    }

    
    _renderDayTimestamp = (timestamp) => {
        let date = new Date(timestamp)
        let day = date.getDate()
        let month = date.getMonth() + 1
        switch (month) {
            case 1: month = 'Jan'
                break;
            case 2: month = 'Feb'
                break;
            case 3: month = 'Mar'
                break;
            case 4: month = 'Apr'
                break;
            case 5: month = 'May'
                break;
            case 6: month = 'Jun'
                break;
            case 7: month = 'Jul'
                break;
            case 8: month = 'Aug'
                break;
            case 9: month = 'Sep'
                break;
            case 10: month = 'Oct'
                break;
            case 11: month = 'Nov'
                break;
            case 12: month = 'Dec'
                break;
        }
        return day + ' ' + month 
    }

    pad = (val) => {
        return (val < 10) ? '0' + val : val
    }

    _renderTimestamps = (timestamp) => {
        let hours = new Date(timestamp).getHours()
        let minutes = new Date(timestamp).getMinutes()
        return this.pad(hours) + ':' + this.pad(minutes)
    }

    _renderName = async () => {
        let displayNameQuery = await firebase.firestore().collection('users').doc(this.state.sender).get()
        let displayNameData = await displayNameQuery.data().displayName
        this.setState({
            displayName: displayNameData
        })
    }

    componentDidMount = async () => {
        if (this.props.newDay) {
            console.log(this.state.msg, 'asta-i mesajul')

        } else {
            console.log('matai curva ', this.state.msg)
        }
        await Font.loadAsync({
            font1: require('../../../assets/SourceSansPro-Black.ttf'),
            font2: require('../../../assets/SourceSansPro-Regular.ttf')
        })
        this.setState({
            fontsLoaded: true
        })

        await this._renderName()
        let theDate = new Date(this.state.date + 3 * 3600000);
        let dateString = theDate.toGMTString();
        this.setState({ translatedDate: dateString })
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
        if (this.state.fontsLoaded) {

            // if(this.state.date === 1663775563000){
            // return <View></View>
            // }

            return (
                // <View style={{flex: 1, wid}}
                <TouchableOpacity style={{ width: width }}>
                    {this.state.newDay ? <Text>{this._renderDayTimestamp(this.state.date)}</Text> : null}
                    <View style={[styles.submit, { marginLeft: this.state.marginLeft, marginRight: this.state.marginRight, alignSelf: (this.state.sender == firebase.auth().currentUser.uid) ? 'flex-end' : "flex-start", flex: 0, flexDirection: 'row' }]}>
                        <View>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', padding: 5 }}>
                                <Text style={{ fontFamily: 'font1', fontSize: 15 }}>{firebase.auth().currentUser.uid === this.state.sender ? "me" : this.state.displayName}</Text>
                                <Text style={{ fontFamily: 'font1', marginLeft: 20 }}>{this._renderTimestamps(this.state.date)}</Text>

                            </View>
                            <Text style={{ fontFamily: 'font2' }}>{this.state.msg}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        } else {
            return (
                <ActivityIndicator size="large" />
            )
        }
    }

}

const styles = StyleSheet.create({
    submit: {
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#daf5c4',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'transparent',
        marginBottom: 2,
        paddingLeft: 10,
        paddingRight: 10,
        // width: width,
        // alignSelf: 'flex-start'
    },
    submitText: {
        color: '#fff',
        textAlign: 'center',
    }
})