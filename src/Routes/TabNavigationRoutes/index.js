import Agendar from '../../view/Agendar/Agendar'
import Consult from '../../view/Agendar/Consulta/Consult'
import Hygiene from '../../view/Agendar/Higiene/Hygiene'
import ChoosePetShop from '../../view/Agendar/PetShop/ChoosePetShop'
import Vaccine from '../../view/Agendar/Vacina/Vaccine'
import ScheduleEnd from '../../view/Agendar/ScheduleEnd'

import AgendadoMain from '../../view/Agendados/AgendadoMain'
import Agendados from '../../view/Agendados/ScrollTab/Agendados'
import Medicines from '../../view/Agendados/ScrollTab/Medicines'
import AddMedicine from '../../view/Agendados/AddMedicine'

import HistoricMain from '../../view/Historico/HistoricMain'
import HConsult from '../../view/Historico/HistoricConsult/HConsult'
import HMedicines from '../../view/Historico/HistoricMedicines/HMedicines'
import HVaccine from '../../view/Historico/HistoricVaccine/HVaccine'

import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { createBottomTabNavigator } from 'react-navigation-tabs';

import Icon from 'react-native-vector-icons/FontAwesome'

import React from 'react'
import { Text } from 'react-native'

const ScheduleStack = createStackNavigator({
  Agendar,
  Consult,
  Hygiene,
  ChoosePetShop,
  Vaccine,
  ScheduleEnd
})

const ScheduledStack = createStackNavigator({
  AgendadoMain,
  AddMedicine,
  Medicines,
  Agendados
})

const HistoricStack = createStackNavigator({
  HistoricMain,
  HConsult,
  HMedicines,
  HVaccine
})


const getTabBarIcon = (navigation, focused, tintColor) => {
  const { routeName } = navigation.state
  let IconComponent = Icon
  let iconName
  if (routeName === 'Schedule') {
    iconName = "mobile"
  } 
  else if (routeName === 'Scheduled') {
    iconName = "paw"
  }
  else if (routeName === 'Historic') {
    iconName = "history"
  }

  return <IconComponent name={iconName} size={25} color={tintColor} />
}

const getTabBarLabel= (navigation, focused, tintColor) => {
  const { routeName } = navigation.state
  let IconComponent = Icon
  let label
  if (routeName === 'Schedule') {
    label = "Agendamento"
  } 
  else if (routeName === 'Scheduled') {
    label = "Agendados"
  }
  else if (routeName === 'Historic') {
    label = "Histórico"
  }

  return <Text style={{ fontSize: 12, textAlign: "center", color: tintColor}}> {label} </Text>
}

export default createAppContainer(
  createBottomTabNavigator(
    {
      Schedule: ScheduleStack,
      Scheduled: ScheduledStack,
      Historic: HistoricStack
    },
    {
      defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) => getTabBarIcon(navigation, focused, tintColor),
        tabBarLabel: ({ focused, tintColor }) => getTabBarLabel(navigation, focused, tintColor),
      }),
      tabBarOptions: {
        activeTintColor: '#08AEEA',
        inactiveTintColor: 'grey',
      },
      initialRouteName: "Scheduled",
    }
  )
)