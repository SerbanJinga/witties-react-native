import React from "react"
import { Text, Button, Input, SearchBar, Divider, Overlay } from 'react-native-elements'
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
import ActivityPopup from '../ActivityPop/ActivityPopup'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Icon2 from 'react-native-vector-icons/MaterialIcons'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import * as theme from '../../styles/theme'
import SwipeablePanel from 'rn-swipeable-panel';
import Status from "../../components/Status"
const { width, height } = Dimensions.get('window')

import firebase from 'firebase';
import { divide } from "react-native-reanimated";
const screenHeight = Dimensions.get('screen').height;
import TimelinePost from './TimelinePost'



export default class Timeline extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            documentDataFriends: [],
            plusSize: 30,
            showAct: false,
            // documentData: [{
            //     activity: "Laba grav in grup",
            //     mood: "Trist bro",
            //     text: "Va salut pe toti!",
            //     date: "24/3/2020"

            // }, {
            //     activity: "Laba grav grav",
            //     mood: "Trist rau bro",
            //     text: "Va salut  toti!",
            //     date: "25/3/2020"

            // }, {
            //     activity: "Laba grav grav",
            //     mood: "Trist rau bro",
            //     text: "Va salut  toti!",
            //     date: "25/3/2020"

            // }, {
            //     activity: "Laba grav grav",
            //     mood: "Trist rau bro",
            //     text: "Va salut  toti!",
            //     date: "27/3/2020"

            // }, {
            //     activity: "Laba grassv grav",
            //     mood: "Trist rassau bro",
            //     text: "Va sasdasdalut  toti!",
            //     date: "29/3/2020"

            // }],
            documentData:[],
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
        // let reverted = this.state.documentData.reverse()
        // this.setState({ documentData: reverted })
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

    closeSwipablePanel = (foo) =>{
        this.setState({showAct:false})
        let fasdas = this.state.documentData
        if(typeof foo === 'undefined')
        return;

        fasdas.push(foo)
        this.setState({documentData:fasdas})
        // console.log(' aklgjhakgakgjakgja kg,ajkglkaklgkalgklagkl')
    }
    async retrieveData() {
        let initialQuery = await firebase.firestore().collection("private").doc(firebase.auth().currentUser.uid)
        let documentSnapshots = await initialQuery.get()
        console.log('-------------------------------------------------')
        console.log(documentSnapshots)
        console.log('-------------------------------------------------')
        let documentData = documentSnapshots.data().statuses
        console.log('---------------------------aqwqeqe----------------------')
        console.log(documentData)
        console.log('-------------------------------------------------')
        documentData.reverse()
        documentData.slice().sort((a, b) => a.timestamp - b.timestamp)

        this.setState({ documentData: documentData })
        // console.log('-------------------------------------------------')
        // console.log(this.state.documentData)
        // console.log('-------------------------------------------------')

    }
    render() {
        return (<View style={{ height: screenHeight, flex: 1 }}>
            <Overlay isVisible={this.state.showAct}
                

                onBackdropPress={() => { this.setState({ showAct: false }) }}
                // showCloseButton
                overlayStyle={{position:"absolute",bottom:0,width:width,top:40}}
                animationType='fade'
                transparent

            >
                <ActivityPopup papa={this.closeSwipablePanel}/>
            </Overlay>
            {/* //(this.state.documentData[index].date === item.date) */}
            {/* <Text h4 style={{paddingTop:30}}>spatiu sus bro</Text> */}
            
            <View style={{ alignItems: 'center' }}>
                <FlatList
                    // decelerationRate={0}


                    data={this.state.documentData}
                    renderItem={({ item, index }) => (
                        
                        <TimelinePost 
                        postedFor={item.hoursPosted} 
                        activity={item.activity} 
                        mood={item.mood} 
                        text={item.text} 
                        creatorId={item.creatorId} 
                        timestamp={item.timestamp} 
                        image={item.image} 
                        // press={() => this.onPress(item)}
                        
                        />

                    )}
                    keyExtractor={(item, index) => String(index)}
                    ListHeaderComponent={<View style={{ height: 150 }}></View>}
                    // ListFooterComponent={}
                    // ItemSeparatorComponent={(item) => (<Text>{item.date}</Text>)}
                    onEndReached={this.retrieveMore}
                    onEndReachedThreshold={1}
                    columnWrapperStyle={{flexDirection:"row-reverse"}}
                    refreshing={this.state.refreshing}
                    inverted
                    numColumns={3}
                    
                    

                />


            </View>
            <TouchableOpacity style={{
                position: 'absolute',
                alignItems: "center",
                right: 30,
                bottom: 30,
                opacity: (this.state.showAct) ? 0 : 1,
                // borderRadius: 1000, 
                borderWidth: 0,
                borderColor: 'transparent', 
            }} onPress={() => { this.setState({ showAct: true }) }}>
                <Ionicons size={60} name={"ios-add"} style={[{ color: theme.colors.white, paddingHorizontal: 15, borderRadius: 1000, backgroundColor: theme.colors.blue }]} />
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