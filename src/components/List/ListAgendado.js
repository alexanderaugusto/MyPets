import React from 'react'
import {
	Text,
	View,
	StyleSheet,
	Image
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import FIcon from 'react-native-vector-icons/FontAwesome5'

export default class App extends React.Component {

	state = {
		background: 'rgb(137,215,235)', //Cor default
		icon: 'notes-medical', //Icone default
	}

	/**
	 * Comparação para os estilos
	 */
	list = () => {
		if (this.props.type === 'Consult')
			this.setState({ background: 'rgb(137,215,235)', icon: 'notes-medical' })

		if (this.props.type === 'Vaccine')
			this.setState({ background: 'rgb(15,175,233)', icon: 'syringe' })

		if (this.props.type === 'Medicines')
			this.setState({ background: 'rgb(0,243,151)', icon: 'briefcase-medical' })

		if (this.props.type === 'Hygiene')
			this.setState({ background: 'rgb(115,243,210)' })
	}

	/**
	 * Função do proprio React... quando o componente for renderizado a callHistoric sera chamada 
	 */
	componentDidMount = () => {
		this.list()
	}
	render() {
		return (
			<View style={{
				margin: 5,
				padding: 10,
				backgroundColor: this.state.background,
				borderRadius: 15,
			}}>

				<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

					<View style={{ flexDirection: 'column' }}>

						{/* Data solicitada */}
						<View style={styles.line}>
							<Icon name='date-range' size={25} color={'white'} />
							<View style={{ justifyContent: 'center' }}>
								<Text style={styles.text}> {this.props.date}</Text>
							</View>
						</View>

						{/* Nome da PetShop */}
						<View style={styles.line}>
							<Image style={styles.pets}
								source={require('../../../src/assets/img/Brendhon/Ativo1.png')} />
							<View style={{ justifyContent: 'center' }}>
								<Text style={styles.text}> {this.props.petShop}</Text>
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

					{/* Condicional para mostrar a imagem de banho/tosa */}
					<View style={{ flexDirection: 'row' }}>
						<View style={{ justifyContent: 'center' }}>
							{this.props.type === 'Hygiene' ?
								<Image style={styles.image}
									source={require('../../../src/assets/img/Brendhon/Ativo.png')} /> :
								<FIcon style={{ alignItems: 'flex-end' }}
									name={this.state.icon} color='white' size={30} />}
						</View>
					</View>

				</View>
			</View>
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
	text: {
		color: 'white',
		fontFamily: 'Bariol',
		fontWeight: '400',
		fontSize: 13,
	},
	image: {
		width: 40,
		height: 40,
	},
	pets: {
		width: 21,
		height: 18,
		marginLeft: 2
	},
})