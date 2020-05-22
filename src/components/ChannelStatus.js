import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet, Dimensions, ImageBackground, Text, Image } from 'react-native'
import * as theme from '../styles/theme'
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons'; 

const { height, width } = Dimensions.get('window')


export default class ChannelStatus extends Component {
    render(){
        return(
          <View style={[styles.request, {marginLeft: 10, marginRight: 10, flex: 1, flexDirection: 'row', borderRadius: theme.sizes.radius, shadowColor: theme.colors.black, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, backgroundColor: theme.colors.white}]}>
            <View style={[styles.requestStatus], { flex: 0.25, borderRadius: theme.sizes.radius, flexDirection: 'column'}}>
                <Image 
                style={{width: 100, height: 120, borderRadius: theme.sizes.radius}}
                source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/witties.appspot.com/o/profiles_picture%2FQCLKoR1skhUEExopmeZLqQ7a9Ir1?alt=media&token=4058b5af-d554-426a-82d2-c28da6b3ef18' }}
                />
            </View> 
            <View style={{flex: 0.75, marginLeft: 40}}>
              <Text style={{paddingVertical: 8, fontSize: 18}}>
                Vasile Mircea
              </Text>
              <Text style={{fontSize: 12, fontWeight: '500' }}>Lorem Ipsum este pur şi simplu o machetă pentru text a industriei tipografice. Lorem Ipsum a...</Text>
              <Text style={{marginTop: 10, fontWeight: '150'}}>Posted at 20:40:20</Text>
            </View>
          </View>
        )
    }
}

const styles = StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.colors.blue
    },
    headerChart: {
      paddingTop: 30,
      paddingBottom: 30,
      zIndex: 1
    },
    avatar: {
      width: 25,
      height: 25,
      borderRadius: 25 / 2,
      marginRight: 5
    },
    requests: {
      marginTop: -55,
      paddingTop: 55 + 20,
      paddingHorizontal: 15,
      zIndex: -1
    },
    requestsHeader: {
      paddingHorizontal: 20,
      paddingBottom: 15
    },
    request: {
      // padding: 10,
      marginBottom: 15
    },
    requestStatus: {
      marginRight: 20,
      overflow: "hidden",
      height: 90
    }
  });

              ///<===============ASTA O PUN IN CHANNEL FEED ================>
            // <View style={[styles.requests, {flex: 0.8, flexDirection: 'column', backgroundColor: theme.colors.gray}]}>
            //     <View style={[styles.requestsHeader, {flex: 0, flexDirection: 'row', justifyContent: 'space-between'}]}>
            //         <Text style={{fontWeight: 200}}>Recent channel updates</Text>
            //         <TouchableOpacity activeOpacity={0.8}>
            //             <Text style={{fontWeight: 500}}>View All</Text>
            //         </TouchableOpacity>
            //     </View>
            // </View>
            ///<===============ASTA O PUN IN CHANNEL FEED ================>
