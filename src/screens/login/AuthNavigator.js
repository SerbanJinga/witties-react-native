import { createSwitchNavigator } from 'react-navigation';
import Loading from '../LoadingScreen';
import SignUp from './SignUp';
import Login from './Login';

const AuthNavigator = createSwitchNavigator(
    {
        Loading: { screen: Loading },
        SignUp: { screen: SignUp },
        LogIn: { screen: Login }
    },{
        initialRouteName: 'Loading'
    }
);

export default AuthNavigator;