import React,  { Component } from 'react'
import { withNavigation } from 'react-navigation'
import { View, Text } from 'react-native'
class TestAnimation extends Component {
    constructor(props){
        super(props)
    }

    render(){
        return(
            <View style={{flex: 1}}>
                <Text>Animatie test</Text>
            </View>
        )
    }
}

export default withNavigation(TestAnimation)