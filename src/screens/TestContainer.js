import React, { Component } from 'react'
import { Text, Button, View, StyleSheet, Dimensions } from 'react-native'
import firebase from 'firebase'
import { ListItem } from 'react-native-elements'
import { timing } from 'react-native-reanimated'
const { width, height } = Dimensions.get('window')
const obj = {name: [], discriminator: []}
export default class TestContainer extends Component {
    constructor(props){
        super(props)
        this.state = {
           friendsIds: [],
           friendsNames: [],
           friendsDiscriminators: [],
           friends: {}
        }
        this.askForFiends = this.askForFiends.bind(this)
    }
    componentDidMount() {
        this.askForFiends()
        
    }

   


    async askForFiends() {
        try {
            let initialQuery =  await firebase.firestore().collection('friends').doc(firebase.auth().currentUser.uid)
            let documentSnapshots = await initialQuery.get()
            console.log(documentSnapshots.data().prieteni)
            this.setState({
                friendsIds: documentSnapshots.data().prieteni
            })
            // this.state.friendsIds.forEach(id => console.logfirebase.firestore().collection('users').doc(id).get().then(doc => console.log(doc)))
            const da = []
            const nu = []
            for(let i = 0; i < this.state.friendsIds.length ; i++){
                await firebase.firestore().collection("users").doc(this.state.friendsIds[i]).get().then(doc => {
                    const valoare = doc.data()
                    obj.name.push(valoare.displayName)
                    obj.discriminator.push(valoare.discriminator)
                    // const altaValoare = doc.data().discriminator
                    da.push(valoare)
                    // nu.push(altaValoare)
                }).then(this.setState({friendsNames: da, friendsDiscriminators: nu, friends: obj}))
            }
            console.log(this.state.friendsNames)
            console.log(this.state.friendsDiscriminators)
           console.log(this.state.friends)
            // console.log('==========================')
            // console.log(this.state.friendsNames)
            // console.log('==========================')
        } catch (err) { console.log(err)}
    }
    render() {
        return (
                // {
                //     list.map((l, i) => (
                //         <ListItem
                //             key={i}
                //             leftAvatar={{ source: { uri: l.avatar_url } }}
                //             title={l.name}
                //             subtitle={l.subtitle}
                //             onPress={() => { this.askForFiends();}}
                //             bottomDivider
                //         />
                //     ))
                // }
                <View>
                <Button
                    title="Titlu"
                    onPress={() => console.log(this.state.friendsIds)}
                />
                <Text>{this.state.name}</Text>
                </View>
            );
    }
}
 
 
const styles = StyleSheet.create({
    container: {
        height: height,
        width: width
    }
})