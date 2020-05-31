import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, Text, ImageBackground, TouchableOpacity } from 'react-native'
import { FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import { withNavigation } from 'react-navigation'
import SwipeablePanel from 'rn-swipeable-panel'
import ActivityPopup from '../ActivityPop/ActivityPopup'

const { width, height } = Dimensions.get('window')
class Gallery extends Component{
    constructor(props){
        super(props)
        this.state = {
            image: this.props.image,
            isPanelActive: false
        }
    }

    openPanel = () => {
        this.setState({
            isPanelActive: true
        })
    }
    closePanel = () => {
        this.setState({
            isPanelActive: false
        })
    }
    render(){
        return(
            <View style={{flex: 1, flexDirection: 'column'}}>
                <ImageBackground source={{uri: this.state.image.uri}} style={{width: width, height: height}}>
                <View style={{flex: 0, flexDirection: 'row'}}>
                <TouchableOpacity
              style={{
                alignSelf: 'flex-end',
                alignItems: 'center',
                backgroundColor: 'transparent',
                margin: 10
              }}>
              <FontAwesome
                  name="times"
                  style={{ color: "#fff", fontSize: 35}}
              />
            </TouchableOpacity>               
             </View>
             <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: height / 1.2}}>
                 <TouchableOpacity onPress={() => this.openPanel()}>
                    <FontAwesome
                        name="plus-square"
                        style={{color: "#fff", fontSize: 40}}
                    />
                 </TouchableOpacity>
             </View>
                </ImageBackground>
          

                <SwipeablePanel isActive={this.state.isPanelActive} onlyLarge={true}>
                <ActivityPopup/>
            </SwipeablePanel>
            </View>
        )
    }
}
export default withNavigation(Gallery)