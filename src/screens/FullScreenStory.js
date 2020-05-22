import React from "react"
import { Text, Button, Input, SearchBar, Divider } from 'react-native-elements'
import {
    StyleSheet,
    View,
    SafeAreaView,
    TouchableOpacity,
    KeyboardAvoidingView,
    ActivityIndicator,
    Keyboard,
    TouchableWithoutFeedback,
    ImageBackground,
    Dimensions,
    FlatList,
    ScrollView,
    Image


} from 'react-native';
import Icon3 from 'react-native-vector-icons/Ionicons'
import Icon2 from 'react-native-vector-icons/MaterialIcons'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'


const { width, height } = Dimensions.get('window')

import firebase from 'firebase';
import { divide } from "react-native-reanimated";
import { withNavigation } from "react-navigation";



class FullScreenStorty extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
           paused:false,
            item: props.navigation.state.params.status
        

        }
    }
    componentDidMount() {
        console.log("De aici vine")
        console.log(this.state.item)
        
       


    }
    componentDidUpdate(prevProps,prevState){
        if (this.state.paused !== prevState.pause) {
            console.log("I have changed")
          }
    }

    render() {

        return (
        <View style={{flex:1,flexDirection:'row',height:height*1.5,width:width}}>
            <TouchableOpacity activeOpacity={0.85}  style={{backgroundColor:'red',flex:1}} onPress={()=>{console.log("left")}}></TouchableOpacity>
            <TouchableOpacity activeOpacity={0.85} style={{backgroundColor:'blue',flex:5}} onPressIn={()=>{this.setState({paused:true})}} onPressOut={()=>{this.setState({paused:false})}}></TouchableOpacity>
            <TouchableOpacity activeOpacity={0.85} style={{backgroundColor:'green',flex:1}} onPress={()=>{console.log("right")}}></TouchableOpacity>

        </View>
        
        
        )

    }
}


export default withNavigation(FullScreenStorty)