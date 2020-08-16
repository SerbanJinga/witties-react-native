import React, { Component } from 'react'
import { View, Dimensions, StyleSheet, ActivityIndicato, TouchableOpacity, ActivityIndicator } from 'react-native'
import { CheckBox, Button, Divider, Text, Avatar } from 'react-native-elements'
import * as Font from 'expo-font'
import { withNavigation } from 'react-navigation'
const { width, height } = Dimensions.get('window')
class AddParticipant extends Component {
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
            font1: require('../../../assets/SourceSansPro-Black.ttf')
        })
        this.setState({fontsLoaded: true})
        try{
            console.log(this.props.mama)
        }catch(error){
            console.log(error)
        }
    }

    _pressTouchableOpacity = () => {
        this.props.navigation.navigate('Home')
    }

    render(){
        if(this.state.fontsLoaded){
        return(
            <TouchableOpacity>
        
            <View style={{flex: 1, padding: 10}}>
                <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
                    <Avatar size={40} rounded source={{uri: this.props.profilePicture}}/>
                    <View style={{flex: 1, flexDirection: 'column',}}>
                    <Text style={{marginLeft: 4, fontFamily: 'font1'}}>{this.props.displayName}</Text>
                    <Text style={{fontFamily: 'font1', marginLeft: 4}}>#{this.props.discriminator}</Text>
                    </View>
                    <CheckBox
                        checkedIcon="dot-circle-o"
                        containerStyle={{backgroundColor: 'transparent',borderWidth: 0}}
                        uncheckedIcon="circle-o"
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
                <Divider style={{marginTop: 20}}/>

            </View>
            

            </TouchableOpacity>      
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

  export default withNavigation(AddParticipant)