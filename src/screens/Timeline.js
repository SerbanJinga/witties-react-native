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
    ScrollView


} from 'react-native';
import Icon3 from 'react-native-vector-icons/Ionicons'
import Icon2 from 'react-native-vector-icons/MaterialIcons'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'


import Status from "../components/Status"
const { width, height } = Dimensions.get('window')

import firebase from 'firebase';
import { divide } from "react-native-reanimated";




export default class Timeline extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            documentDataFriends: [],
            documentData: [{
                activity: "Laba grav in grup",
                mood: "Trist bro",
                text: "Va salut pe toti!",
                date: "24/3/2020"

            }, {
                activity: "Laba grav grav",
                mood: "Trist rau bro",
                text: "Va salut  toti!",
                date: "25/3/2020"

            }, {
                activity: "Laba grav grav",
                mood: "Trist rau bro",
                text: "Va salut  toti!",
                date: "25/3/2020"

            }],
            lastVisible: null,
            loading: false,
            refreshing: false,
            filteredData: [],

            limit: 20

        }
    }
    componentDidMount() {
        console.log("De aici vine", this.state.displayName)

        this.retrieveData()
        console.log('=a-ra=r-apkfakfaf')

        console.log(this.state.documentDataFriends)


    }
    renderHeader() {
        return (<View>
            <Text>TIMELINE</Text>
            <Divider />
        </View>)
    }
    search = (searchText) => {
        this.setState({ searchText: searchText })
        let filteredData = this.state.documentDataFriends.filter(function (item) {
            return item.displayName.toLowerCase().includes(searchText)
        })
        this.setState({ filteredData: filteredData })
    }

    async retrieveData() {
        // let initialQuery = await firebase.firestore().collection("users").where("uid", "==", firebase.auth().currentUser.uid)
        // let documentSnapshots = await initialQuery.get()
        // let documentData = documentSnapshots.docs.map(doc => doc.data())
        // let bagPl = documentData[0].customActivities
        // this.setState({ documentData: bagPl })
        console.log('-------------------------------------------------')
        console.log(this.state.documentData)
        console.log('-------------------------------------------------')

    }
    render() {
        return (<View>
            {/* //(this.state.documentData[index].date === item.date) */}
            <Text h1 >spatiu sus bro</Text>
            <FlatList
                decelerationRate={0}
                pagingEnabled
                scrollEnabled
                scrollEventThrottle={16}
                snapToAlignment='center'
                data={this.state.documentData}
                renderItem={({ item, index }) => (
                    <View style={[styles.container, { marginBottom: 30 }]}>
                        <Text h4 style={{
                            height: (index === 0) ? 50 : (item.date === this.state.documentData[index - 1].date) ? 0 : 50,
                            fontWeight: 'normal'
                        }}>{item.date} </Text>

                       
                            <Status activity={item.activity} mood={item.mood} text={item.text} creatorId={item.creatorId} timestamp={item.timestamp} />
                      
                    </View>

                )}
                keyExtractor={(item, index) => String(index)}
                ListHeaderComponent={this.renderHeader}
                // ItemSeparatorComponent={(item) => (<Text>{item.date}</Text>)}
                onEndReached={this.retrieveMore}
                onEndReachedThreshold={0}
                refreshing={this.state.refreshing}
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