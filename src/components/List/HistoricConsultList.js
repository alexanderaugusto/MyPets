import React from 'react'
import {
    Text,
    View,
    StyleSheet,
    Image
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import FIcon from 'react-native-vector-icons/FontAwesome5'

//Cor comum da Página
const commun = {
    background: 'rgb(137,215,235)',
    color: 'white'
}

export default props => {

    return (

        <View style={styles.container}>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                <View style={{ flexDirection: 'column' }}>

                    {/* Data de quando foi realizada */}
                    <View style={styles.line}>
                        <Icon name='date-range' size={25} color={commun.color} />
                        <View style={{ justifyContent: 'center' }}>
                            <Text style={styles.text}> Data em que foi relizado</Text>
                        </View>
                    </View>
                    
                    {/* Nome da PetShop */}
                    <View style={styles.line}>
                        <Image style={styles.pets}
                            source={require('../../../src/assets/img/Brendhon/Ativo1.png')} />
                        <View style={{ justifyContent: 'center' }}>
                            <Text style={styles.text}> Nome da PetShop</Text>
                        </View>
                    </View>

                    {/* Localização */}
                    <View style={styles.line}>
                        <Icon name='place' size={25} color={commun.color} />
                        <View style={{ justifyContent: 'center' }}>
                            <Text style={styles.text}> Localização da PetShop</Text>
                        </View>
                    </View>

                </View>

                {/* Icone Colsulta */}
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ justifyContent: 'center' }}>
                        <FIcon style={{ alignItems: 'flex-end' }}
                            name='notes-medical' color='white' size={60} />
                    </View>
                </View>

            </View>

        </View>
    )
}

//Estilos
const styles = StyleSheet.create({
    container: {
        margin: 5,
        padding: 10,
        borderRadius: 15,
        backgroundColor: commun.background,
    },
    line: {
        flexDirection: 'row',
        marginLeft: 8,
        marginTop: 5,
    },
    text: {
        color: commun.color,
        fontFamily: 'Bariol',
        fontWeight: '400',
        fontSize: 13,
    },
    pets: {
        width: 21,
        height: 18,
        marginLeft: 2
    },

})