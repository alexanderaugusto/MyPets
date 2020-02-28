import React, { Component } from 'react'
import {
	StyleSheet,
	View,
	ScrollView,
	Text,
	FlatList,
	RefreshControl
} from 'react-native'
import { Image, Header } from 'react-native-elements'
import List from '../../components/List/ListAgendado'
import LinearGradient from 'react-native-linear-gradient'
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert'
import Loader from '../../components/Loader/loader'
import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'
import { FIREBASE_DATABASE_URL } from '../../variables/firebaseConfig'
import dogIcon from '../../assets/img/bones.png'
import Icon from 'react-native-vector-icons/FontAwesome'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { COLOR } from '../../variables/general'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import Agendados from './ScrollTab/Agendados'
import Medicines from './ScrollTab/Medicines'

class AgendadoMain extends Component {

	constructor(props) {
		super(props)

		this.state = {

		}
		console.log(this.props)
	}

	render() {

		return (
			<View style={styles.gridView}>
				{this.state.alert}

				<ScrollableTabView tabBarActiveTextColor={COLOR.buttonColor} tabBarUnderlineStyle={{ backgroundColor: COLOR.buttonColor}}>
					<Agendados tabLabel="Agendados" navigation={this.props.navigation} />
					<Medicines tabLabel="Medicamentos" navigation={this.props.navigation} />
				</ScrollableTabView>
			</View>
		);
	}
}

//Estilos
const styles = StyleSheet.create({
	gridView: {
		flex: 1,
	},
});

AgendadoMain.navigationOptions = {
	header: null,
}

export default AgendadoMain