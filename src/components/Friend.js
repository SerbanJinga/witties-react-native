import React, { Component } from 'react'
import { View, Dimensions, StyleSheet, ActivityIndicator } from 'react-native'
import { CheckBox, ListItem, Text } from 'react-native-elements'
import * as Font from 'expo-font'
const { width, height } = Dimensions.get('window')
export default class Friend extends Component {
    constructor(props){
        super(props)
        this.state = {
            selection: false,
            name: this.props.name,
            uid: this.props.uid,
            fontsLoaded: false
        }
    }

    async componentDidMount(){
        await Font.loadAsync({
            font1: require('../../assets/SourceSansPro-Black.ttf')
        })
        this.setState({fontsLoaded: true})
        try{
            console.log(this.props.mama)
        }catch(error){
            console.log(error)
        }
    }

    render(){
        if(this.state.fontsLoaded){
        return(
            <ListItem titleStyle={{fontFamily: 'font1'}} leftAvatar={{source: {uri: this.props.profilePicture }, title: this.state.name.charAt(0)}} title={this.state.name} subtitle={
        <View>
        <Text style={{fontFamily: 'font1'}}>#{this.props.discriminator}</Text>
            <CheckBox
            textStyle={{fontFamily: 'font1'}}
             title="Add to new channel"
             checked={this.state.selection}
             onPress={()=> {
                 if(this.state.selection === false){
                     this.props.mama(this.state.uid)
                     this.setState({selection: true})
                 } else{
                     this.setState({selection: false})
                     this.props.tata(this.state.uid)
                 }
             }}    
             />
         </View>
            }/>
        )}else{
            return(
                <ActivityIndicator size={'large'}/>
            )
        }

    }
}

const styles = StyleSheet.create({
    container: {
      height: height,
      width: width,
    },
    headerText: {
      fontFamily: 'System',
      fontSize: 36,
      fontWeight: '600',
      color: '#000',
      marginLeft: 12,
      marginBottom: 12,
    },
    itemContainer: {
      width: width,
      borderWidth: 10,
      borderColor: '#000',
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      fontFamily: 'System',
      fontSize: 16,
      fontWeight: '400',
      color: '#000',
    },
  });