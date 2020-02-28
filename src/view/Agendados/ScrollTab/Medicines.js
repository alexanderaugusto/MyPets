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
import List from '../../../components/List/ListMedicines'
import LinearGradient from 'react-native-linear-gradient'
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert'
import Loader from '../../../components/Loader/loader'
import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'
import { FIREBASE_DATABASE_URL } from '../../../variables/firebaseConfig'
import { COLOR } from '../../../variables/general'
import dogIcon from '../../../assets/img/bones.png'
import Icon from 'react-native-vector-icons/FontAwesome'
import { TouchableOpacity } from 'react-native-gesture-handler'
import ActionButton from 'react-native-action-button';

/* 
    id: Identificador
    type: Tipo de procedimento
    petShop: Nome da PetShop
    place: Localização
    date: Data requerida
 */

class Medicines extends Component {

	constructor(props) {
		super(props)

		this.state = {
			medicines: [],
			alert: null,
			loadingVisible: true,
			refreshing: false
		}
	}

	errorAlert(title, subtitle) {
		this.setState({
			alert:
				<SCLAlert
					theme="danger"
					show={true}
					title={title}
					subtitle={subtitle}
					onRequestClose={() => console.log('danger')}
				>
					<SCLAlertButton theme="danger" onPress={() => this.setState({ alert: null })}>Ok</SCLAlertButton>
				</SCLAlert>
		})
	}

	successAlert(title, subtitle) {
		this.setState({
			alert:
				<SCLAlert
					theme="success"
					show={true}
					title={title}
					subtitle={subtitle}
					onRequestClose={() => console.log('success')}
				>
					<SCLAlertButton theme="success" onPress={() => {
						this.setState({ alert: null })
						this.props.navigation.goBack(null)
					}}>Ok</SCLAlertButton>
				</SCLAlert>
		})
	}

	componentDidMount() {
		this.getAgenda()
	}

	async getAgenda() {
		try {
			const userId = await AsyncStorage.getItem('user_id')
			const getAnimal = await AsyncStorage.getItem('animal_selected')
			const animalSelected = await JSON.parse(getAnimal)

			await axios.get(FIREBASE_DATABASE_URL + "/app/accounts/" + userId + "/pets/" + animalSelected.id + "/medicamentos" + ".json")
				.then(res => {
					if (res.data !== null) {
						this.setAgenda(res.data, animalSelected)
					} else {
						this.setState({ medicines: [] })
					}

				})
				.catch(err => this.errorAlert("Erro inesperado!", "Por favor, tentar novamente."))
		} catch (e) {
			console.log(e)
		}

		this.setState({ loadingVisible: false })
	}

	async setAgenda(data) {
		let medicines = []

		medicaments = Object.entries(data).map((value) => ({ [value[0]]: value[1] }))

		medicaments.forEach((element) => {
			Object.entries(element).map((value) => {
				medicines.push({
					id: value[0],
					type: "Medicines",
					dateStart: value[1].dateStart,
					dateEnd: value[1].dateEnd,
					time: value[1].time,
					description: value[1].description,
				})
			})
		})

		this.setState({ medicines })
	}

	async onRefresh() {
		this.setState({ refreshing: true })

		await this.getAgenda()

		this.setState({ refreshing: false })
	}

	render() {

		return (
			<View style={styles.gridView}>
				{this.state.alert}
				<Loader
					loading={this.state.loadingVisible} />

				<ScrollView style={styles.container}
					refreshControl={
						<RefreshControl
							refreshing={this.state.refreshing}
							onRefresh={() => this.onRefresh()}
						/>
					}>
					{this.state.medicines === null ? null :
						this.state.medicines.length !== 0 ?
							< FlatList
								// style={{ marginBottom: "30%"}}
								data={this.state.medicines}
								keyExtractor={item => item.id.toString()}
								renderItem={({ item, index }) =>
									<List {...item}></List>

								}
							/>
							:
							<View style={{ flex: 1, justifyContent: "flex-start", alignItems: "center", paddingTop: "40%" }}>
								<Image
									source={require("../../../assets/img/medicines.png")}
									style={{ width: 100, height: 100 }}
								/>
								<Text style={styles.textNoInfo}> Você ainda não inseriu nenhum medicamento para este animal. </Text>
							</View>}
				</ScrollView>

				<ActionButton
					buttonColor={COLOR.buttonColor}
					onPress={() => this.props.navigation.navigate("AddMedicine")}
					buttonTextStyle={styles.actionButtonStyle}
				/>
			</View>
		);
	}
}

//Estilos
const styles = StyleSheet.create({
	gridView: {
		flex: 1,
	},
	background: {
		flexGrow: 1,
		justifyContent: 'center',
	},
	container: {
		// flex: 0.8,
		backgroundColor: 'rgba(255,255,255,0.92)',
		// borderTopRightRadius: 10,
		// borderTopLeftRadius: 10,
		// justifyContent: 'center',
		paddingHorizontal: 20,
		marginBottom: "5%"
	},
	textNoInfo: {
		width: "50%",
		textAlign: "center",
		fontSize: 15,
		color: "#363636"
	},
	filterBar: {
		backgroundColor: COLOR.screenBackground
	},
	actionButtonStyle: {
		fontSize: 25,
	},
});

Medicines.navigationOptions = {
	header: null,
}

export default Medicines