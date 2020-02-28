import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
// import TabBar from "@mindinventory/react-native-tab-bar-interaction"
import TabBar from "../../components/sidebar/tabBar"
import Icon from 'react-native-vector-icons/FontAwesome'
import imgSchedule from '../../assets/img/TabBar/schedule_blue.png'
import imgAnimal from '../../assets/img/TabBar/animal_blue.png'
import imgHistoric from '../../assets/img/TabBar/historic_blue.png'
import { COLOR } from '../../variables/general'
import LinearGradient from 'react-native-linear-gradient'
import Header from '../../components/header/header'
import AsyncStorage from '@react-native-community/async-storage'

import Routes from '../../Routes/TabNavigationRoutes/index'

import ScheduledRoutes from '../../Routes/ScheduledRoutes/index'
import ScheduleRoutes from '../../Routes/ScheduleRoutes/index'
import HistoricRoutes from '../../Routes/HistoricRoutes/index'

class AnimalInformation extends Component {
	static navigationOptions = {
		header: null,
	}

	constructor(props) {
		super(props)

		this.state = {
			dataAnimal: this.props.navigation.getParam('animal_selected'),
		}
	}

	componentDidMount() {
		const { navigation } = this.props
		this.focusListener = navigation.addListener("didFocus", () => {
			this.getInfoAnimal()
		})
	}

	componentWillUnmount() {
		this.focusListener.remove()
	}

	async getInfoAnimal() {
		this.setState({ dataAnimal: this.props.navigation.getParam('animal_selected') })
	}

	render() {
		return (
			// <View style={{ width: "100%", height: "100%" }}>
			// 	<Header navigation={this.props.navigation} />

			// 	<TabBar>
			// 		<TabBar.Item
			// 			icon={imgSchedule}
			// 			selectedIcon={imgSchedule}
			// 			title="Consulta"
			// 		>
			// 			<ScheduleRoutes />

			// 		</TabBar.Item>
			// 		<TabBar.Item
			// 			icon={imgAnimal}
			// 			selectedIcon={imgAnimal}
			// 			title="Animal"
			// 		>
			// 			<ScheduledRoutes />

			// 		</TabBar.Item>
			// 		<TabBar.Item
			// 			icon={imgHistoric}
			// 			selectedIcon={imgHistoric}
			// 			title="Historico"
			// 		>
			// 			<HistoricRoutes />

			// 		</TabBar.Item>
			// 	</TabBar>

			// </View>
			<View style={{ width: "100%", height: "100%" }}>
				{this.state.dataAnimal !== null ?
					<Header
						petAvatar={this.state.dataAnimal.petAvatar}
						name={this.state.dataAnimal.name}
						species={this.state.dataAnimal.species}
						sex={this.state.dataAnimal.sex}
						weight={this.state.dataAnimal.weight}
						age={this.state.dataAnimal.age}
						breed={this.state.dataAnimal.breed}
						onPress={() => this.props.navigation.navigate('EditPet', { pet_data: this.state.dataAnimal })} 
						/>
						
					: null}
				<Routes />
			</View>


		)
	}
}

const styles = StyleSheet.create({
	background: {
		flexGrow: 1,
		justifyContent: 'center',
	},
	container: {
		flex: 0.7,
		backgroundColor: 'rgba(255,255,255,0.92)',
		borderTopRightRadius: 10,
		borderTopLeftRadius: 10,
		justifyContent: 'center',
		padding: 20
	},
});

export default AnimalInformation 