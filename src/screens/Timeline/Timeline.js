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
import ImageLoader from './ImageLoader'
import { MaterialIcons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'
import ActivityPopup from '../ActivityPop/ActivityPopup'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Icon2 from 'react-native-vector-icons/MaterialIcons'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import * as theme from '../../styles/theme'
import SwipeablePanel from 'rn-swipeable-panel';
import Status from "../../components/Status"
const { width, height } = Dimensions.get('window')
import * as Font from 'expo-font'
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
            
            documentData:[],
            lastVisible: null,
            loading: false,
            refreshing: false,
            filteredData: [],

            limit: 20,
            fontsLoaded: false,
            openFilter: false

        }
        this.closeSwipablePanel = this.closeSwipablePanel.bind(this)
    }
    componentDidMount() {
        Font.loadAsync({
            font1: require('../../../assets/SourceSansPro-Black.ttf')
        }).then(this.setState({
            fontsLoaded: true
        }))
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
        let filteredData = this.state.documentData.filter(function (item) {
            return item.text.toLowerCase().includes(searchText)
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

    openFilter = () => {
        this.setState({
            openFilter: true
        })
    }

    closeFilter = () => {
        this.setState({
            openFilter: false
        })
    }

    filterDate = async() => {
        this.setState({
            openFilter: false
        })
        let initialQuery = await firebase.firestore().collection('private').doc(firebase.auth().currentUser.uid)
        let documentSnapshots = await initialQuery.get()
        let documentData = await documentSnapshots.data().statuses
        documentData.sort(function(a,b){
            return a.timestamp - b.timestamp
        })

        this.setState({
            documentData: documentData,
        })
    }

    filterMood = async() => {
        this.setState({
            openFilter: false
        })
        let initialQuery = await firebase.firestore().collection('private').doc(firebase.auth().currentUser.uid)
        let documentSnapshots = await initialQuery.get()
        let documentData = await documentSnapshots.data().statuses
        documentData.sort(function(a,b){
            return a.mood < b.mood
        })

        this.setState({
            documentData: documentData,
        })
    
    }

    filterLocation = async() => {
        this.setState({
            openFilter: false
        })
        let initialQuery = await firebase.firestore().collection('private').doc(firebase.auth().currentUser.uid)
        let documentSnapshots = await initialQuery.get()
        let documentData = await documentSnapshots.data().statuses
        documentData.sort(function(a,b){
            return a.location < b.location
        })

        this.setState({
            documentData: documentData,
        })
    }

    filterActivity = async() => {
        this.setState({
            openFilter: false
        })
        let initialQuery = await firebase.firestore().collection('private').doc(firebase.auth().currentUser.uid)
        let documentSnapshots = await initialQuery.get()
        let documentData = await documentSnapshots.data().statuses
        documentData.sort(function(a,b){
            return a.activity < b.activity
        })

        this.setState({
            documentData: documentData,
        })
    }
    render() {
        return (<View style={{ height: screenHeight, flex: 1 }}>
        <View style={{flex: 0, flexDirection: 'row', alignItems: 'center', alignContent: 'center'}}>  
              <SearchBar round placeholder="Search" style={{fontFamily: 'font1', padding: 20}} lightTheme inputStyle={{fontFamily: 'font1'}} placeholderTextColor="#ecedef" containerStyle={{
    backgroundColor:"#fff",
    borderBottomColor: '#ecedef',
    borderTopColor: '#ecedef',
    borderLeftColor: '#ecedef',
    borderRightColor: '#ecedef',
    borderWidth: 1,
    borderRadius: 10,
    margin: 10,
    width: width / 1.2
}}  inputContainerStyle={{backgroundColor: '#fff', height: 30}} value={this.state.searchText} onChangeText={this.search} />
            <TouchableOpacity onPress={() => this.openFilter()}>
                <AntDesign name="filter" size={20}/>
            </TouchableOpacity>

           </View>
            <Overlay isVisible={this.state.showAct}
                
                fullScreen
                onBackdropPress={() => { this.setState({ showAct: false }) }}
                // showCloseButton
                overlayStyle={{position:"absolute",bottom:0,width:width}}
                animationType='slide'
                transparent

            >
            
            <TouchableOpacity style={{marginTop: 10}} onPress={() => {this.setState({showAct: false})}}>
                <AntDesign name="close" size={20}/>
            </TouchableOpacity>
                <ActivityPopup papa={this.closeSwipablePanel}/>
            </Overlay>
            {/* //(this.state.documentData[index].date === item.date) */}
            {/* <Text h4 style={{paddingTop:30}}>spatiu sus bro</Text> */}
            
            <View style={{ alignItems: 'center' }}>
            
                <FlatList
                    // decelerationRate={0}

                    data={this.state.filteredData && this.state.filteredData.length > 0 ? this.state.filteredData : this.state.documentData}

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
                    <AntDesign 
                        name="pluscircle"
                        size={48}
                        style={{color: theme.colors.blue}}
                    />
            </TouchableOpacity>
            <Overlay isVisible={this.state.openFilter} fullScreen animationType="slide">
                <View style={{flex: 1, flexDirection: 'column'}}>
                <View style={{flex: 0, flexDirection: 'row',  alignItems: 'center'}}>
                            <TouchableOpacity
                            onPress={() => this.closeFilter()}
                                style={{
                                    alignSelf: 'flex-end',
                                    alignItems: 'center',
                                    backgroundColor: 'transparent',                  
                                }}>
                            <MaterialCommunityIcons
                                name="close"
                                style={{ color: "#000", fontSize: 30}}
                                
                            />
                            </TouchableOpacity>
                            <Text style={{fontSize: 18, fontFamily: 'font1', marginLeft: 4}}>Filter Search</Text>
                        </View>
                        <TouchableOpacity onPress={() => this.filterDate()} style={{marginBottom: 10, marginTop: 20}}>
                            <Text style={{fontFamily: 'font1', fontSize: 14}}>Date</Text>
                        </TouchableOpacity>    
                        <Divider/> 
                        <TouchableOpacity onPress={() => this.filterMood()} style={{marginVertical: 10}}>
                            <Text style={{fontFamily: 'font1', fontSize: 14}}>Mood</Text>
                        </TouchableOpacity> 
                        <Divider/> 

                        <TouchableOpacity onPress={() => this.filterActivity()} style={{marginVertical: 10}}>
                            <Text style={{fontFamily: 'font1', fontSize: 14}}>Activity</Text>
                        </TouchableOpacity>
                        <Divider/> 

                        <TouchableOpacity onPress={() => this.filterLocation()} style={{marginVertical: 10}}>
                            <Text style={{fontFamily: 'font1', fontSize: 14}}>Location</Text>
                        </TouchableOpacity>   
                        <Divider/> 

                        <TouchableOpacity style={{marginVertical: 10}}>
                            <Text style={{fontFamily: 'font1', fontSize: 14}}>People</Text>
                        </TouchableOpacity>             
                </View>
            </Overlay>
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