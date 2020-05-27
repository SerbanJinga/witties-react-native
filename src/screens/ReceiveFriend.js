import React, { Component } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { ListItem, Button, Text } from 'react-native-elements'


export default class ReceiveFriend extends Component {
    render(){
        return(
            <ListItem title={this.props.displayName} leftAvatar={{source:{ uri: this.props.profilePicture }, title: this.props.displayName.charAt(0)}} subtitle={
                <View style={{flex: 1, flexDirection: 'column'}}>
                <Text>#{this.props.discriminator}</Text>
                    <Button
                        onPress={() => this.props.press()}
                        type="clear"
                        style={{width: 150}}
                        title="Accept Friend"
                    />
                </View>
            }/>
                
        )
    }
}



