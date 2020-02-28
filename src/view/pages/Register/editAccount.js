import React, { Component } from 'react'
import { ScrollView, View, Text, StyleSheet, TouchableHighlight, Alert } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { Input } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import { COLOR } from '../../../variables/general'
import { FIREBASE_DATABASE_URL } from '../../../variables/firebaseConfig'
import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'
import Loader from '../../../components/Loader/loader'
import Util from '../../../variables/util'
import { TextInputMask } from 'react-native-masked-text'
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert'

class EditAccount extends Component {
	static navigationOptions = {
		title: "Editar Dados",
		headerStyle: {
			backgroundColor: COLOR.headerBackground,
		},
		headerTintColor: COLOR.headerText
	}

	constructor(props) {
		super(props)

		this.state = {
			dataInfos: {
				userAvatar: '',
				name: '',
				lastName: '',
				cpf: '',
				phone: '',
				dateOfBirth: '',
				nameState: 'has-success',
				lastNameState: 'has-success',
				cpfState: 'has-success',
				phoneState: 'has-success',
				dateOfBirthState: 'has-success'
			},
			loadingVisible: true,
			alert: null
		}

		this.getUserInfo()
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
					<SCLAlertButton theme="danger" onPress={() => this.hideAlert(interval)}>Ok</SCLAlertButton>
				</SCLAlert>
		})

		let interval = setTimeout(() => this.setState({ alert: null }), 2500)
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
						this.hideAlert(interval)
						this.props.navigation.navigate("Home", { status: "reload" })
					}}>Ok</SCLAlertButton>
				</SCLAlert>
		})

		let interval = setTimeout(() => {
			this.setState({ alert: null })
			this.props.navigation.navigate("Home", { status: "reload" })
		}, 2500)
	}

	hideAlert(interval){
    this.setState({ alert: null })
    clearInterval(interval)
	}
	
	async getUserInfo() {
		let dataInfos = this.state.dataInfos

		try {
			const userId = await AsyncStorage.getItem('user_id')

			await axios.get(FIREBASE_DATABASE_URL + "/app/accounts/" + userId + "/user/info.json")
				.then(res => {
					dataInfos.userAvatar = res.data.userAvatar
					dataInfos.name = res.data.name
					dataInfos.lastName = res.data.lastName
					dataInfos.cpf = res.data.cpf
					dataInfos.phone = res.data.phone
					dataInfos.dateOfBirth = res.data.dateOfBirth
				})
				.catch(err => this.errorAlert("Erro inesperado!", "Por favor, tentar novamente."))
		} catch (e) {
			console.log(e)
		}

		this.setState({ dataInfos })
		this.setState({ loadingVisible: false })
	}

	async handleClick() {
		if (this.state.dataInfos.nameState === 'has-success' &&
			this.state.dataInfos.cpfState === 'has-success' && this.state.dataInfos.phoneState === 'has-success' &&
			this.state.dataInfos.dateOfBirthState === 'has-success') {
			this.setState({ loadingVisible: true })
			try {
				const userId = await AsyncStorage.getItem('user_id')
				let data = {
					userAvatar: this.state.dataInfos.userAvatar,
					name: this.state.dataInfos.name,
					lastName: this.state.dataInfos.lastName,
					cpf: this.state.dataInfos.cpf,
					phone: this.state.dataInfos.phone,
					dateOfBirth: this.state.dataInfos.dateOfBirth,
				}
				AsyncStorage.setItem('user_info', JSON.stringify(data))
				
				await axios.put(FIREBASE_DATABASE_URL + "/app/accounts/" + userId + "/user/info.json", data)
					.then(res => {
						this.successAlert("MyPets", "Dados alterados com sucesso!")
					})
					.catch(err => this.errorAlert("Erro inesperado!", "Por favor, tentar novamente."))
			} catch (e) {
				console.log(e)
			}

			this.setState({ loadingVisible: false })
		}
		else {
			this.errorAlert("Dados inválidos!", "Preencha de forma correta para enviar.")
		}
	}

	render() {
		return (
			<ScrollView contentContainerStyle={STYLE.container}>
				<Loader
					loading={this.state.loadingVisible} />
				{this.state.alert}
				<Input
					placeholder="Nome..."
					inputStyle={STYLE.input}
					inputContainerStyle={STYLE.inputContainer2}
					containerStyle={STYLE.inputContainer1}
					underlineColorAndroid='transparent'
					onChangeText={(value) => this.setState({
						dataInfos:
							Util.nameValidation(value, this.state.dataInfos)
					})}
					value={this.state.dataInfos.name}
				/>
				<Input
					placeholder="Sobrenome..."
					inputStyle={STYLE.input}
					inputContainerStyle={STYLE.inputContainer2}
					containerStyle={STYLE.inputContainer1}
					underlineColorAndroid='transparent'
					onChangeText={(value) => this.setState({
						dataInfos:
							Util.lastNameValidation(value, this.state.dataInfos)
					})}
					value={this.state.dataInfos.lastName}
				/>

				<TextInputMask
					style={STYLE.maskedInput}
					type={'cpf'}
					value={this.state.dataInfos.cpf}
					onChangeText={(value) => this.setState({
						dataInfos:
							Util.cpfValidation(value, this.state.dataInfos)
					})}
					placeholder='CPF...'
				/>

				<TextInputMask
					style={STYLE.maskedInput}
					type={'cel-phone'}
					options={{
						maskType: 'BRL',
						withDDD: true,
						dddMask: '(99) '
					}}
					value={this.state.dataInfos.phone}
					onChangeText={(value) => this.setState({
						dataInfos:
							Util.phoneValidation(value, this.state.dataInfos)
					})}
					placeholder='Telefone...'
				/>

				<TextInputMask
					style={STYLE.maskedInput}
					type={'datetime'}
					options={{
						format: 'DD/MM/YYYY'
					}}
					value={this.state.dataInfos.dateOfBirth}
					onChangeText={(value) => this.setState({
						dataInfos:
							Util.dateOfBirthValidation(value, this.state.dataInfos)
					})}
					placeholder='Data de Nascimento...'
				/>
				<TouchableHighlight
					style={STYLE.registerButton}
					onPress={() => this.handleClick()}>
					<Text style={STYLE.textButton}> Salvar </Text>
				</TouchableHighlight>
			</ScrollView>
		)
	}
}

const STYLE = StyleSheet.create({

	container: {
		flexGrow: 1,
		backgroundColor: COLOR.screenBackground,
		textAlign: "center",
		alignItems: "center",
		justifyContent: "center"
	},

	iconSideBar: {
		marginLeft: 15,
		fontSize: 30,
	},

	input: {
		width: "90%",
		borderRadius: 25,
		marginTop: "10%",
		backgroundColor: "#FFFFFF",
		paddingLeft: 20,
		fontSize: 15
	},

	maskedInput: {
		width: "87%",
		borderRadius: 25,
		marginTop: "10%",
		backgroundColor: "#FFFFFF",
		paddingLeft: 20,
	},

	inputDanger: {
		width: "90%",
		borderColor: "rgba(255,0,0, 0.8)",
		borderWidth: 2,
		borderRadius: 25,
		marginTop: "10%",
		backgroundColor: "#FFFFFF",
		paddingLeft: 20,
		paddingRight: 0
	},

	inputContainer1: {
		alignItems: "center",
	},

	inputContainer2: {
		borderBottomWidth: 0,
		width: "90%"
	},

	registerButton: {
		marginTop: 40,
		height: 50,
		width: "85%",
		backgroundColor: COLOR.buttonColor,
		borderRadius: 25,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 30
	},

	textButton: {
		color: "#FFFFFF",
		fontSize: 18,
	},
})

export default EditAccount