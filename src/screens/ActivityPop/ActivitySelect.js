import React, { Component } from 'react'
import { View, Dimensions, StyleSheet } from 'react-native'
import { CheckBox, Button } from 'react-native-elements'
const { width, height } = Dimensions.get('window')
export default class ActivitySelect extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selection: false,
            name: props.name,

            selectionLimitReached: props.alreadySelected,
        }
    }

    componentDidMount() {
        // console.log(this.state.name)
    }

    render() {
        return (

            <View style={styles.container}>
                <Button
                    containerStyle={{
                        marginHorizontal: 30,
                        backgroundColor: '#f5f6fa',
                        borderRadius: 30,
                        marginBottom: 10,
                        width: width * 0.6,

                    }}
                    type='clear'
                    title={this.state.name}
                    checked={this.state.selection}
                    onPress={() => {
                        if(typeof this.props.otherData === 'undefined'){
                            this.props.mama(this.state.name);
                            // console.log('s a transmis asta:',this.state.name)
                            return;
                        }
                        this.props.mama(this.props.otherData)
                        // console.log('s a transmis asta:',this.props.otherData)
                        

                        
                    }}
                />

            </View>
        )
    }
}







const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center'
    },
    button: {
        marginHorizontal: 15,
        backgroundColor: '#f5f6fa',
        borderRadius: 30,
        width: width * 0.8,

    },
    moodView: {
        flexDirection: "row",
        justifyContent: 'center',
        marginBottom: 10,
    }
})
