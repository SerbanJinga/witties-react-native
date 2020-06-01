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
import ActivityPopup from './ActivityPop/ActivityPopup'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Icon2 from 'react-native-vector-icons/MaterialIcons'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import * as theme from '../styles/theme'
import SwipeablePanel from 'rn-swipeable-panel';
import Status from "../components/Status"
const { width, height } = Dimensions.get('window')

import firebase from 'firebase';
import { divide } from "react-native-reanimated";
const screenHeight = Dimensions.get('screen').height;



export default class Timeline extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            documentDataFriends: [],
            plusSize: 30,
            showAct: false,
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

            }, {
                activity: "Laba grav grav",
                mood: "Trist rau bro",
                text: "Va salut  toti!",
                date: "27/3/2020"

            }, {
                activity: "Laba grassv grav",
                mood: "Trist rassau bro",
                text: "Va sasdasdalut  toti!",
                date: "29/3/2020"

            }],
            lastVisible: null,
            loading: false,
            refreshing: false,
            filteredData: [],

            limit: 20

        }
        this.closeSwipablePanel = this.closeSwipablePanel.bind(this)
    }
    componentDidMount() {
        console.log("De aici vine", this.state.displayName)

        this.retrieveData()
        console.log('=a-ra=r-apkfakfaf')
        console.log(screenHeight, "   vs  ", height)
        console.log(this.state.documentDataFriends)
        //Dau reverse la array
        let reverted = this.state.documentData.reverse()
        this.setState({ documentData: reverted })
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
    closeSwipablePanel = () =>{
        this.setState({showAct:false})
        // console.log(' aklgjhakgakgjakgja kg,ajkglkaklgkalgklagkl')
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
        return (<View style={{ height: screenHeight }}>
            <SwipeablePanel isActive={this.state.showAct}
                openLarge={true}

                onClose={() => { this.setState({ showAct: false }) }}
                showCloseButton


            >
                <ActivityPopup papa={this.closeSwipablePanel}/>
            </SwipeablePanel>
            {/* //(this.state.documentData[index].date === item.date) */}
            {/* <Text h4 style={{paddingTop:30}}>spatiu sus bro</Text> */}
            <View style={{ alignItems: 'center' }}>
                <FlatList
                    decelerationRate={0}


                    data={this.state.documentData}
                    renderItem={({ item, index }) => (
                        <View><Text>da</Text></View>

                    )}
                    keyExtractor={(item, index) => String(index)}
                    ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={<View style={{ height: 150 }}></View>}
                    // ItemSeparatorComponent={(item) => (<Text>{item.date}</Text>)}
                    onEndReached={this.retrieveMore}
                    onEndReachedThreshold={0}
                    refreshing={this.state.refreshing}
                    inverted

                />


            </View>
            <TouchableOpacity style={{
                flex: 1,
                position: 'absolute',
                alignItems: "center",
                right: 30,
                bottom: 30,
                opacity: (this.state.showAct) ? 0 : 1,

            }} onPress={() => { this.setState({ showAct: true }) }}>
                <Ionicons size={60} name={"ios-add"} style={[{ color: theme.colors.white, backgroundColor: theme.colors.blue, paddingHorizontal: 15, borderRadius: 60 }]} />
            </TouchableOpacity>
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
    },
    overlay: {
        flex: 1,
        position: 'absolute',
        left: width,

        bottom: 0,
        opacity: 0.5,
        backgroundColor: 'blue',


    }, shadow: {
        shadowColor: theme.colors.black,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 5,
    },
})