import React from 'react'
import {
	Text,
	View,
	StyleSheet,
	Image,
	TouchableOpacity
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import FIcon from 'react-native-vector-icons/FontAwesome5'

export default class App extends React.Component {

	state = {
		background: 'rgb(137,215,235)', //Cor que pode variar dependendo do tipo da requisição
	}

	/**
	 * Lista de variações de estilo
	 */
	list = () => {
		if (this.props.type === 'Consult')
			this.setState({ background: 'rgb(137,215,235)' })

		if (this.props.type === 'Vaccine')
			this.setState({ background: 'rgb(15,175,233)' })

		if (this.props.type === 'Medicines')
			this.setState({ background: 'rgb(0,243,151)' })

		if (this.props.type === 'Hygiene')
			this.setState({ background: 'rgb(115,243,210)' })
	}

	/**
	 * Função do proprio React... quando o componente for renderizado a callHistoric sera chamada 
	 */
	componentDidMount = () => {
		this.list()
	}

	/**
	 * Estrelas de Avaliações
	 */
	evaluation = () => {
		if (4.5 < this.props.evaluations && this.props.evaluations <= 5) {
			return (
				<View style={{ flexDirection: 'row' }}>
					<Icon name='star' color='rgb(255,255,0)' style={{ margin: 2 }} size={22} />
					<Icon name='star' color='rgb(255,255,0)' style={{ margin: 2 }} size={22} />
					<Icon name='star' color='rgb(255,255,0)' style={{ margin: 2 }} size={22} />
					<Icon name='star' color='rgb(255,255,0)' style={{ margin: 2 }} size={22} />
					<Icon name='star' color='rgb(255,255,0)' style={{ margin: 2 }} size={22} />
				</View>
			)
		}
		if (3.5 < this.props.evaluations && this.props.evaluations <= 4.5) {
			return (
				<View style={{ flexDirection: 'row' }}>
					<Icon name='star' color='rgb(255,255,0)' style={{ margin: 2 }} size={22} />
					<Icon name='star' color='rgb(255,255,0)' style={{ margin: 2 }} size={22} />
					<Icon name='star' color='rgb(255,255,0)' style={{ margin: 2 }} size={22} />
					<Icon name='star' color='rgb(255,255,0)' style={{ margin: 2 }} size={22} />
					<Icon name='star-border' color='rgb(255,255,0)' style={{ margin: 2 }} size={22} />
				</View>
			)
		}
		if (2.5 < this.props.evaluations && this.props.evaluations <= 3.5) {
			return (
				<View style={{ flexDirection: 'row' }}>
					<Icon name='star' color='rgb(255,255,0)' style={{ margin: 2 }} size={22} />
					<Icon name='star' color='rgb(255,255,0)' style={{ margin: 2 }} size={22} />
					<Icon name='star' color='rgb(255,255,0)' style={{ margin: 2 }} size={22} />
					<Icon name='star-border' color='rgb(255,255,0)' style={{ margin: 2 }} size={22} />
					<Icon name='star-border' color='rgb(255,255,0)' style={{ margin: 2 }} size={22} />
				</View>
			)
		}
		if (1.5 < this.props.evaluations && this.props.evaluations <= 2.5) {
			return (
				<View style={{ flexDirection: 'row' }}>
					<Icon name='star' color='rgb(255,255,0)' style={{ margin: 2 }} size={22} />
					<Icon name='star' color='rgb(255,255,0)' style={{ margin: 2 }} size={22} />
					<Icon name='star-border' color='rgb(255,255,0)' style={{ margin: 2 }} size={22} />
					<Icon name='star-border' color='rgb(255,255,0)' style={{ margin: 2 }} size={22} />
					<Icon name='star-border' color='rgb(255,255,0)' style={{ margin: 2 }} size={22} />
				</View>
			)
		}
		if (0 < this.props.evaluations && this.props.evaluations <= 1.5) {
			return (
				<View style={{ flexDirection: 'row' }}>
					<Icon name='star' color='rgb(255,255,0)' style={{ margin: 2 }} size={22} />
					<Icon name='star-border' color='rgb(255,255,0)' style={{ margin: 2 }} size={22} />
					<Icon name='star-border' color='rgb(255,255,0)' style={{ margin: 2 }} size={22} />
					<Icon name='star-border' color='rgb(255,255,0)' style={{ margin: 2 }} size={22} />
					<Icon name='star-border' color='rgb(255,255,0)' style={{ margin: 2 }} size={22} />
				</View>
			)
		}
		if (this.props.evaluations === 0) {
			return (
				<View style={{ flexDirection: 'row' }}>
					<Icon name='star-border' color='rgb(255,255,0)' style={{ margin: 2 }} size={22} />
					<Icon name='star-border' color='rgb(255,255,0)' style={{ margin: 2 }} size={22} />
					<Icon name='star-border' color='rgb(255,255,0)' style={{ margin: 2 }} size={22} />
					<Icon name='star-border' color='rgb(255,255,0)' style={{ margin: 2 }} size={22} />
					<Icon name='star-border' color='rgb(255,255,0)' style={{ margin: 2 }} size={22} />
				</View>
			)
		}
	}

	render() {

		return (
			<TouchableOpacity
			activeOpacity={0.3}
				onPress={() => this.props.navigation.navigate(`${this.props.type}`,
					{
						petShopSelected: {
							petId: this.props.id,
							petName: this.props.name,
							petServiceType: this.props.type,
							petPlace: this.props.place,
							petVet: this.props.vet

						}
					})}
				style={{
					margin: 5,
					padding: 10,
					backgroundColor: this.state.background,
					borderRadius: 15,
				}}>

				{/* Avaliações */}
				<View style={styles.star}>
					{this.evaluation()}
				</View>

				<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

					<View style={{ flexDirection: 'column' }}>

						{/* Nome do Veterinario */}
						<View style={styles.line}>
							<FIcon name='user-md' size={25} color={'white'} />
							<View style={{ justifyContent: 'center' }}>
								<Text style={styles.text}>  {this.props.vet}</Text>
							</View>
						</View>

						{/* Nome da PetShop */}
						<View style={styles.line}>
							<Image style={styles.pets}
								source={require('../../../src/assets/img/Brendhon/Ativo1.png')} />
							<View style={{ justifyContent: 'center' }}>
								<Text style={styles.text}>  {this.props.name}</Text>
							</View>
						</View>

						{/* Informações do Lugar */}
						<View style={styles.line}>
							<Icon name='place' size={25} color={'white'} />
							<View style={{ justifyContent: 'center' }}>
								<Text style={styles.text}> {this.props.place}</Text>
							</View>
						</View>

					</View>

					{/* Imagem do Veterinario */}
					<View style={{ flexDirection: 'row' }}>

						<View style={{ justifyContent: 'center' }}>
							<Image style={styles.vetImage}
								source={require('../../../src/assets/img/Brendhon/vet.jpg')} />
						</View>

					</View>

				</View>
			</TouchableOpacity>
		)
	}

}

//Estilos
const styles = StyleSheet.create({
	line: {
		flexDirection: 'row',
		marginLeft: 8,
		marginTop: 5,
	},
	star: {
		flexDirection: 'row',
		marginHorizontal: 3,
		justifyContent: 'center',
		alignItems: 'center'
	},
	text: {
		color: 'white',
		fontFamily: 'Bariol',
		fontWeight: '400',
		fontSize: 13,
	},
	vetImage: {
		width: 70,
		height: 70,
		borderRadius: 80
	},
	pets: {
		width: 21,
		height: 18,
		marginLeft: 2
	},
})