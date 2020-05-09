import { createSwitchNavigator } from 'react-navigation';
import ChatRoom from './ChatRoom'
import FriendList from '../FriendList'
const ChatNavigator = createSwitchNavigator(
    {
        ChatRoom: { screen: ChatRoom },
        FriendList: { screen: FriendList }
    },{
        initialRouteName: 'ChatRoom'
    }
);

export default ChatNavigator;