import React, { Component } from 'react'
import { Text, Button } from 'react-native-elements'
import { View, Dimensions, StyleSheet } from 'react-native'
import firebase from 'firebase'
import Swiper from 'react-native-swiper'
import HomeContainer from '../screens/containers/HomeContainer'
const { width, height } = Dimensions.get('window')
export default class Home extends Component {
   
    

    render(){
        return(
            <Swiper
      loop={false}
      showsPagination={false}
      index={1}>
      <View>
        <HomeContainer/>
      </View>
      <Swiper
        horizontal={false}
        loop={false}
        showsPagination={false}
        index={1}>
        <View>
          <Text>Top</Text>
        </View>
        <View>
          <Text>Home</Text>
        </View>
        {/* <View>
           <Text>Bottom</Text>
        </View> */}
      </Swiper>        
      <View>
          <Text>Right</Text>
      </View>
    </Swiper>
            
        )
    }
}

