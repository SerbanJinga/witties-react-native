import { createSwitchNavigator } from 'react-navigation';
import Loading from '../LoadingScreen';
import SignUp from './SignUp';
import Login from './Login';
import ForgotPassword from './ForgotPassword'
const AuthNavigator = createSwitchNavigator(
    {
        Loading: { screen: Loading },
        SignUp: { screen: SignUp },
        LogIn: { screen: Login },
        ForgotPassword: { screen: ForgotPassword }
    },{
        initialRouteName: 'Loading'
    }
);

export default AuthNavigator;