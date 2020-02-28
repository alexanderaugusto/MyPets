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
import List from '../../../components/List/ListAgendado'
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

import OneSignal from 'react-native-onesignal'
/* 
    id: Identificador
    type: Tipo de procedimento
    petShop: Nome da PetShop
    place: Localização
    date: Data requerida
 */

class Agendado extends Component {

	constructor(props) {
		super(props)

		this.state = {
			agendados: [],
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

		OneSignal.init("d8e64fab-5bdd-47fd-b97e-63bc8c999332")
		OneSignal.addEventListener('received', this.receivedPush)
		OneSignal.addEventListener('opened', this.openedPush)
		OneSignal.addEventListener('ids', this.idsPush)
	}

	receivedPush() {
		console.log("received")
	}

	openedPush() {
		console.log("opened")
	}

	idsPush() {
		console.log("ids")
	}

	async getAgenda() {
		try {
			const userId = await AsyncStorage.getItem('user_id')
			const getAnimal = await AsyncStorage.getItem('animal_selected')
			const animalSelected = await JSON.parse(getAnimal)

			// await axios.get(FIREBASE_DATABASE_URL + "/app/accounts/" + userId + "/agendamento.json")
			// 	.then(res => {
			// 		if (res.data !== null) {
			// 			this.setAgenda(res.data, animalSelected)
			// 		} else {
			// 			this.setState({ agendados: [] })
			// 		}

			// 	})
			// 	.catch(err => this.errorAlert("Erro inesperado!", "Por favor, tentar novamente."))

			await axios.get(FIREBASE_DATABASE_URL + "/Login.json")
				.then(res => {
					if (res.data !== null) {
						this.setAgenda(res.data, animalSelected)
					} else {
						this.setState({ agendados: [] })
					}

				})
				.catch(err => this.errorAlert("Erro inesperado!", "Por favor, tentar novamente."))
		} catch (e) {
			console.log(e)
		}

		this.setState({ loadingVisible: false })
	}

	async setAgenda1(data, animalSelected) {
		let agendados = []
		let consults = data.consulta !== undefined ? data.consulta : []
		let hygiene = data.higiene !== undefined ? data.higiene : []
		let medicaments = data.medicamentos !== undefined ? data.medicamentos : []
		let vaccines = data.vacinas !== undefined ? data.vacinas : []

		consults = Object.entries(consults).map((value) => ({ [value[0]]: value[1] }))
		hygiene = Object.entries(hygiene).map((value) => ({ [value[0]]: value[1] }))
		medicaments = Object.entries(medicaments).map((value) => ({ [value[0]]: value[1] }))
		vaccines = Object.entries(vaccines).map((value) => ({ [value[0]]: value[1] }))

		consults.forEach((element) => {
			Object.entries(element).map((value) => {
				if (value[1].animal.id === animalSelected.id) {
					agendados.push({
						id: value[0],
						type: "Consult",
						petShop: value[1].petShop.petName,
						place: value[1].petShop.petPlace,
						date: value[1].date + " às " + value[1].time,
						agenda: value[1]
					})
				}
			})
		})

		hygiene.forEach((element) => {
			Object.entries(element).map((value) => {
				if (value[1].animal.id === animalSelected.id) {
					agendados.push({
						id: value[0],
						type: "Hygiene",
						petShop: value[1].petShop.petName,
						place: value[1].petShop.petPlace,
						date: value[1].date + " às " + value[1].time,
						agenda: value[1]
					})
				}
			})
		})

		medicaments.forEach((element) => {
			Object.entries(element).map((value) => {
				if (value[1].animal.id === animalSelected.id) {
					agendados.push({
						id: value[0],
						type: "Medicines",
						petShop: value[1].petShop.petName,
						place: value[1].petShop.petPlace,
						date: value[1].date + " às " + value[1].time,
						agenda: value[1]
					})
				}
			})
		})

		vaccines.forEach((element) => {
			Object.entries(element).map((value) => {
				if (value[1].animal.id === animalSelected.id) {
					agendados.push({
						id: value[0],
						type: "Vaccine",
						petShop: value[1].petShop.petName,
						place: value[1].petShop.petPlace,
						date: value[1].date + " às " + value[1].time,
						agenda: value[1]
					})
				}
			})
		})

		// let teste = agendados
		// teste.sort((a, b) => {
		// 	if(a.date < b.date)
		// 		return 1;
		// 	else if (a.date > b.date)
		// 		return -1;

		// 	return 0;
		// })

		this.setState({ agendados })
	}

	async setAgenda(data, animalSelected) {
		let agendados = []
		let petShopCity = ""
		let petShopName = ""
		let date = ""

		let login = Object.entries(data).map((value) => ({ [value[0]]: value[1] }))

		let index = 0 

		login.forEach((petshops) => {
			Object.entries(petshops).map((petShopDentro) => {
				petShopCity = petShopDentro[1].Dados.cidade
				petShopName = petShopDentro[1].Dados.nome
		
				if (petShopDentro[1].Agenda !== null && petShopDentro[1].Agenda !== undefined && petShopDentro[1].Agenda.Consultas !== null && petShopDentro[1].Agenda.Consultas !== undefined) {
					Object.entries(petShopDentro[1].Agenda.Consultas).map((consultas) => {
						date = consultas[0].split('-').join('/')
						Object.entries(consultas[1]).map((value) => {
							if (value[1].animal !== null && value[1].animal !== undefined && value[1].animal.id === animalSelected.id) {			
								agendados.push({
									type: "Consult",
									petShop: petShopName,
									place: petShopCity,
									date: date + " às " + value[0],
									agenda: value[1],
									id: index
								})
								index++;
							}
						})
					})
				}

				if (petShopDentro[1].Agenda !== null && petShopDentro[1].Agenda !== undefined && petShopDentro[1].Agenda.Higiene !== null && petShopDentro[1].Agenda.Higiene !== undefined) {
					Object.entries(petShopDentro[1].Agenda.Higiene).map((higiene) => {
						date = higiene[0].split('-').join('/')
						Object.entries(higiene[1]).map((value) => {
							if (value[1].animal !== null && value[1].animal !== undefined && value[1].animal.id === animalSelected.id) {
								agendados.push({
									type: "Hygiene",
									petShop: petShopName,
									place: petShopCity,
									date: date + " às " + value[0],
									agenda: value[1],
									id: index
								})
								index++
							}
						})
					})
				}

				if (petShopDentro[1].Agenda !== null && petShopDentro[1].Agenda !== undefined && petShopDentro[1].Agenda.Vacinas !== null && petShopDentro[1].Agenda.Vacinas !== undefined) {
					Object.entries(petShopDentro[1].Agenda.Vacinas).map((vacinas) => {
						date = vacinas[0].split('-').join('/')
						Object.entries(vacinas[1]).map((value) => {
							if (value[1].animal !== null && value[1].animal !== undefined && value[1].animal.id === animalSelected.id) {
								agendados.push({
									type: "Vaccine",
									petShop: petShopName,
									place: petShopCity,
									date: date + " às " + value[0],
									agenda: value[1],
									id: index
								})
								index++
							}
						})
					})
				}
			})
		})

		console.log(agendados)
		this.setState({ agendados })
	}

	async onRefresh() {
		this.setState({ refreshing: true })
		this.setState({ agendados: []})
		
		await this.getAgenda()

		this.setState({ refreshing: false })
	}

	render() {

		return (
			<View style={styles.gridView}>
				{this.state.alert}
				<Loader
					loading={this.state.loadingVisible} />

				{/* <Header containerStyle={styles.filterBar}
					rightComponent={<TouchableOpacity style={{ flexDirection: "row"}}>
						<Text style={{ color:COLOR.headerBackground}}> Organizar </Text>
						<Icon color={COLOR.headerBackground} name="sort" size={20} />
					</TouchableOpacity>}
					centerComponent={<Text style={{ color: "grey", textAlign: "left"}}> {this.state.agendados.length + " agendamentos previstos."} </Text>}
					centerContainerStyle={{marginLeft: 0}}
				/> */}

				<ScrollView style={styles.container}
					refreshControl={
						<RefreshControl
							refreshing={this.state.refreshing}
							onRefresh={() => this.onRefresh()}
						/>
					}>
					{this.state.agendados === null ? null :
						this.state.agendados.length !== 0 ?
							< FlatList
								// style={{ marginBottom: "30%"}}
								data={this.state.agendados}
								// keyExtractor={item => item.id.toString()}
								renderItem={({ item, index }) =>
									<List {...item}></List>

								}
							/>
							:
							<View style={{ flex: 1, justifyContent: "flex-start", alignItems: "center", paddingTop: "40%" }}>
								<Image
									source={dogIcon}
									style={{ width: 100, height: 100 }}
								/>
								<Text style={styles.textNoInfo}> Seu animalzinho não possui nenhum agendamento previsto. </Text>
							</View>}
				</ScrollView>
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
	}
});

Agendado.navigationOptions = {
	header: null,
}

export default Agendado