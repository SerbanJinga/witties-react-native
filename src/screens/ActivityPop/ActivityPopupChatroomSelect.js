import React, { Component } from 'react'
import { Dimensions, View, StyleSheet, } from 'react-native'
import { CheckBox, Text, Button } from 'react-native-elements'
const { width, height } = Dimensions.get('window')

export default class ActivityPopupChatroomSelect extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selection: false,
            name: props.name,
            nem:props.nem,
        }

    }
    componentDidMount() {


    }
    render() {
        return (<View >

           

            <CheckBox checked={this.state.selection} title={'Send to' + this.state.nem}
                onPress={() => {
                    if (this.state.selection === false) {
                        this.props.mama(this.props.name)
                        this.setState({ selection: true })
                    } else {
                        this.setState({ selection: false })
                        this.props.tata(this.props.name)
                    }
                }}
            />
            
        </View>)
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center'
    },
    button: {
        marginHorizontal: 5,
        backgroundColor: '#f5f6fa',
        borderRadius: 30,
        width: 50,

    },
    bigButton: {
        marginHorizontal: 15,
        backgroundColor: '#f5f6fa',
        borderRadius: 30,
        width: width * 0.3,

    },
    moodView: {
        flexDirection: "row",
        justifyContent: 'center',
        marginBottom: 10,
    }
})