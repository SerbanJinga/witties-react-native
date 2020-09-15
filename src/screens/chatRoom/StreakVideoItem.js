import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Video } from 'expo-av';

const { height, width } = Dimensions.get('window');

const cellHeight = height * 0.6;
const cellWidth = width;

const viewabilityConfig = {
  itemVisiblePercentThreshold: 80,
};

class StreakVideoItem extends React.PureComponent {
    componentWillUnmount(){
        if(this.video){
            this.video.unloadAsync()
        }
    }

    async play(){
        const status = await this.video.getStatusAsync()
        if (status.isPlaying){
            return
        }
        return this.video.playAsync()
    }

    pause(){
        if(this.video){
            this.video.stopAsync()
        }
    }
    render() {
        const { id, poster, video } = this.props;
      
        return (
          <View style={styles.cell}>
           
            <Video
              ref={(ref) => {
                this.video = ref;
              }}
              source={{ uri: video }}
              shouldPlay={false}
              isMuted
              resizeMode="cover"
              style={styles.full}
            />
            <View style={styles.overlay}>
              <Text style={styles.overlayText}>Item no. {id}</Text>
              <Text style={styles.overlayText}>Overlay text here</Text>
            </View> 
          </View>
        );
      }
    
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    cell: {
      width: cellWidth - 20,
      height: cellHeight - 20,
      backgroundColor: '#eee',
      borderRadius: 20,
      overflow: 'hidden',
      margin: 10,
    },
    overlay: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: 'rgba(0,0,0,0.4)',
      padding: 40,
    },
    full: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    poster: {
      resizeMode: 'cover',
    },
    overlayText: {
      color: '#fff',
    },
  });

  export default StreakVideoItem