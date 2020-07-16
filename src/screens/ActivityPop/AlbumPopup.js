import React, { Component } from 'react'
import firebase from 'firebase';
import {
    View, Dimensions, StyleSheet, FlatList, ScrollView
} from 'react-native'
import ActivitySelect from './ActivitySelect'
import Icon3 from 'react-native-vector-icons/Ionicons'
import { CheckBox, Button, Text, Input } from 'react-native-elements'
const { width, height } = Dimensions.get('window')
export default class AlbumPopup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            documentData: [],
            input: '',


        }
    }

    async componentDidMount() {
        this.retrieveData()
        console.log("si a dat mount ")


    }

    retrieveData = async () => {

        let querye = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
        let snapshot = await querye.get()
        let myData = snapshot.data().albums
        console.log(myData, "cevavavva")
        this.setState({ documentData: myData })


    }
    render() {
        return (

            <View style={styles.container}>
                {/* <ScrollView style={{flex: 1}}>     */}


                {/* </ScrollView> */}
                <Input
                    placeholder={"Add a new album!"}
                    placeholderTextColor="#B1B1B1"
                    returnKeyType="done"
                    textContentType="newPassword"
                    rightIcon={<Icon3 name={"ios-add"} size={28} onPress={() => {
                        if (this.state.input === '')
                            return;
                        console.log(this.state.input)
                        let f = this.state.documentData
                        f.push(this.state.input)
                        firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({
                            albums: firebase.firestore.FieldValue.arrayUnion(this.state.input)
                        })
                        this.setState({
                            documentData: f,
                            input: ''
                        })

                    }} />}
                    containerStyle={{ marginBottom: 0, paddingBottom: 0, width: width }}
                    value={this.state.input}
                    onChangeText={input => this.setState({ input })}
                />

                <FlatList

                    data={this.state.documentData}
                    renderItem={({ item }) => (
                        <ActivitySelect mama={this.props.open} name={item} />
                    )}
                    keyExtractor={(item, index) => String(index)}
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
