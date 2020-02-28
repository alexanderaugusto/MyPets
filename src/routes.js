import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

import Login from './view/pages/login'
import Register from './view/pages/Register/register'
import RegisterEnd from './view/pages/Register/registerEnd'
import UserInfo from './view/pages/Register/userInfo'
import EditAccount from './view/pages/Register/editAccount'
import EditPassAndEmail from './view/pages/Register/editPassAndEmail'
import Home from './view/pages/home'
import AnimalInformation from './view/pages/AnimalInformation'
import AddPet from './view/pages/addPet'
import EditPet from './view/pages/editPet'
import InsertAddress from './view/pages/Address/insertAddress'
import Adresses from './view/pages/Address/adresses'
import EditAddress from './view/pages/Address/editAddress'

const AppNavigator = createStackNavigator(
    {
        Login,
        Register,
        Home,
        AnimalInformation,
        RegisterEnd,
        EditAccount,
        EditPassAndEmail,
        UserInfo,
        AddPet,
        EditPet,
        InsertAddress,
        Adresses,
        EditAddress,
    },
    {
        navigationOptions: {
            // headerStyle: {
            //     backgroundColor: COLOR.headerBackground,
            // },
            // headerTintColor: COLOR.headerText
        },
    });

export default createAppContainer(AppNavigator)