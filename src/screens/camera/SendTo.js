import React, { Component } from 'react'
import { View, Dimensions, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Text, Avatar, CheckBox, Divider } from 'react-native-elements'
import { AntDesign } from '@expo/vector-icons'

export default class SendTo extends Component {
    constructor(props){
        super(props)
        this.state = {
            selection: false,
            // uid: props.id
        }
    }

    componentDidMount(){
        console.log(this.props.id)
    }

    render(){
        return(
            <TouchableOpacity  onPress={()=> {
                            if(this.state.selection === false){
                                this.props.mama(this.props.id)
                                this.setState({selection: true})
                            } else{
                                this.setState({selection: false})
                                this.props.tata(this.props.id)
                            }
                        }} >
        
            <View style={{flex: 1, padding: 10}}>
                <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
                    <Avatar size={40} rounded source={{uri: this.props.profilePicture}}/>
                    <View style={{flex: 1, flexDirection: 'column',}}>
                    <Text style={{marginLeft: 4, fontFamily: 'font1'}}>{this.props.displayName}</Text>
                    </View>
                    <CheckBox
                        checkedIcon={<AntDesign name="check" size={20} style={{color: '#0984e3'}}/>}
                        containerStyle={{backgroundColor: 'transparent',borderWidth: 0}}
                        uncheckedIcon={<AntDesign name="" size={20}/>}
                        checked={this.state.selection}
                        
                        />
                </View>
                <Divider style={{marginTop: 20}}/>

            </View>
            

             </TouchableOpacity>   
        )
    }
    
}