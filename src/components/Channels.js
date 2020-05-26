import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, FlatList, ScrollView } from 'react-native'
import ChannelStatus from '../components/ChannelStatus'
export default class Channels extends Component {
    constructor(props){
        super(props)

        this.state = {

        }
    }

    componentDidMount(){

    }

    render(){
        return(
            <ChannelStatus/>
        )
    }
}