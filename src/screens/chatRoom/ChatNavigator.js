import { createSwitchNavigator } from 'react-navigation';
import ChatRoom from './ChatRoom'
import FriendList from '../friendSystem/FriendList'
import ChatRoomList from '../chatRoom/ChatRoomsList'
const ChatNavigator = createSwitchNavigator(
    {
        ChatRoom: { screen: ChatRoom },
        FriendList: { screen: FriendList },
        ChatRoomList:{screen : ChatRoomList}

    },{
        initialRouteName: 'ChatRoom'
    }
);

export default ChatNavigator;