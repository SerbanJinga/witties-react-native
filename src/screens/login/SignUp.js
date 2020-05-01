import React, { Component } from 'react'
import { View, Dimensions, StyleSheet } from 'react-native'
import { Text, Divider, Button, Input } from 'react-native-elements'
import * as theme from '../../styles/theme'
const { width, height } = Dimensions.get('window')
export default class SignUp extends Component {
    constructor(props){
        super(props)
        this.state = {

        }
    }

    componentDidMount = () => {

    }

    render(){
        return(
            <View style={styles.container}>
                <Text h1>da</Text>
                <Text h2>da</Text>
                <Text h3>da</Text>
                <Text h4>da</Text>
                <Button type="outline" title="Buton"/>
                <Input placeholder="Email"/>
                <Divider/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height
    }, 
    button: {
        color: theme.colors.blue
    }
})