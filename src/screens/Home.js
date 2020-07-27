import React, { Component } from 'react'
import { View } from 'react-native'
import firebase from 'firebase'
import Swiper from 'react-native-swiper'
import SearchUsers from '../screens/friendSystem/SearchUsers'
import * as Permissions from 'expo-permissions'
import { Notifications } from 'expo'
import CameraScreen from '../screens/camera/Camera'
import { SafeAreaView } from 'react-native-safe-area-context'
import { withNavigation } from 'react-navigation'

 class Home extends Component {



  constructor(props){
      super(props)
      this.state = {
        displayName: '',
        discriminator: '',
        expoPushToken: '',
        notification: {},
        profilePicture: "",
        index: 1,
        stories: props.navigation.state.params.stories
      }

    }

    changeIndexTimeline = () => {
      this.setState({
        index: 2
      })
    }

    

    componentDidMount = async() => {
      arr = []
      finalArr = []
      await this._getToken()
      await this._getProfilePicture()
      console.log('basioapfafap')

      console.log(this.state.stories)
    }


  



    _getProfilePicture = async() => {
      let initialQuery = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
      let documents = await initialQuery.get()
      let documentData = documents.data().profilePicture
      this.setState({
        profilePicture: documentData
      })

    }

    _getToken = async() => {
      let { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
      if(status !== 'granted'){
        console.log('n a mers')
      }

      let token = await Notifications.getExpoPushTokenAsync()


      firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
        tokens: token
      })
    } 

   

    

    

    render(){
        return(

         <View style={{flex: 1}}>
          <Swiper
                  loop={false}
                  showsPagination={false}
                  index={this.state.index}>
                    <View style={{flex: 1}}>
                      <CameraScreen/>
                    </View>
                    <Swiper
                      horizontal={false}
                      loop={false}
                      showsPagination={false}
                      index={1}>
                      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
                        <SearchUsers stories={this.state.stories} changeIndex={() => this.changeIndexTimeline()}/>
                      </SafeAreaView>
                    </Swiper>        
                    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
                      {/* <ActivityPopup/> */}
                    </SafeAreaView>
       </Swiper>
</View>
          )

    }
}

export default withNavigation(Home)

