import React, { Component } from 'react'
import { View, Dimensions, StyleSheet } from 'react-native'
import { CheckBox } from 'react-native-elements'
const { width, height } = Dimensions.get('window')
export default class Friend extends Component {
    constructor(props){
        super(props)
        this.state = {
            selection: false,
            name: this.props.name,
            uid: this.props.uid
        }
    }

    componentDidMount(){
        try{
            console.log(this.props.mama)
        }catch(error){
            console.log(error)
        }
    }

    render(){
        return(
        <View style={styles.itemContainer}>
            <CheckBox
             title={this.state.name}
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
        )
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