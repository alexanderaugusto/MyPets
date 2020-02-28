// #08AEEA - rgba(8, 174, 234, 1)
// #A4D8EB - rgba(164, 216, 235, 1)
// #99FAF1 - rgba(153, 250, 241, 1)
// #A6F502 - rgba(166, 245, 2, 1)
// #2AF598 - rgba(42 ,245, 152, 1)
// #FFFFFF - rgba(255, 255, 255, 1)
// #000000 - rgba(0, 0, 0, 1)
// #A5A5A5 - rgba(165, 165, 165, 1)

const COLOR = {
    headerBackground: "rgba(8, 174, 234, 1)",
    screenBackground: "rgba(220,220,220, 0.4)",
    backgroundLogin: ['rgba(8, 174, 234, 1)', 'rgba(42 ,245, 152, 1)'],
    buttonColor: "rgba(8, 174, 234, 1)",
    headerText: "#FFFFFF",
    flatGridColor1: "rgba(153, 250, 241, 1)",
    flatGridColor2: "rgba(166, 245, 2, 1)",
    overlayColor: "rgba(8, 200, 234, 1)",
    tabBarColor: "#A5A5A5",
    listAddressColor: ["#A4D8EB", "#99FAF1"]
}

const LIST_USER_OPTIONS = [
    {
        title: 'Endereços Cadastrados',
        icon: 'location-on'
    },
    {
        title: 'Configurações da Conta',
        icon: 'settings'
    },
]

const SPECIES_SELECT = [
    { label: "Cachorro", value: "Cachorro" },
    { label: "Gato", value: "Gato" },
    { label: "Pássaro", value: "Pássaro" },
    { label: "Peixe", value: "Peixe" },
    { label: "Outros", value: "Outros" },
]

const BREED_SELECT = {
    Cachorro: [
        { label: 'Sem raça definida (SRD)', value: 'Sem raça definida (SRD)' },
        { label: 'Akita', value: 'Akita' },
        { label: 'Basset hound', value: 'Basset hound' },
        { label: 'Beagle', value: 'Beagle' },
        { label: 'Bichon frisé', value: 'Bichon frisé' },
        { label: 'Boiadeiro australiano', value: 'Boiadeiro australiano' },
        { label: 'Border collie', value: 'Border collie' },
        { label: 'Boston terrier', value: 'Boston terrier' },
        { label: 'Boxer', value: 'Boxer' },
        { label: 'Buldogue francês', value: 'Buldogue francês' },
        { label: 'Buldogue inglês', value: 'Buldogue inglês' },
        { label: 'Bull terrier', value: 'Bull terrier' },
        { label: 'Cane corso', value: 'Cane corso' },
        { label: 'Cavalier king charles spaniel', value: 'Cavalier king charles spaniel' },
        { label: 'Chihuahua', value: 'Chihuahua' },
        { label: 'Chow chow', value: 'Chow chow' },
        { label: 'Cocker spaniel inglês', value: 'Cocker spaniel inglês' },
        { label: 'Dachshund', value: 'Dachshund' },
        { label: 'Dálmata', value: 'Dálmata' },
        { label: 'Doberman', value: 'Doberman' },
        { label: 'Dogo argentino', value: 'Dogo argentino' },
        { label: 'Dogue alemão', value: 'Dogue alemão' },
        { label: 'Fila brasileiro', value: 'Fila brasileiro' },
        { label: 'Golden retriever', value: 'Golden retriever' },
        { label: 'Husky siberiano', value: 'Husky siberiano' },
        { label: 'Jack russell terrier', value: 'Jack russell terrier' },
        { label: 'Labrador retriever', value: 'Labrador retriever' },
        { label: 'Lhasa apso', value: 'Lhasa apso' },
        { label: 'Lulu da pomerânia', value: 'Lulu da pomerânia' },
        { label: 'Maltês', value: 'Maltês' },
        { label: 'Mastiff inglês', value: 'Mastiff inglês' },
        { label: 'Mastim tibetano', value: 'Mastim tibetano' },
        { label: 'Pastor alemão', value: 'Pastor alemão' },
        { label: 'Pastor australiano', value: 'Pastor australiano' },
        { label: 'Pastor de Shetland', value: 'Pastor de Shetland' },
        { label: 'Pequinês', value: 'Pequinês' },
        { label: 'Pinscher', value: 'Pinscher' },
        { label: 'Pit bull', value: 'Pit bull' },
        { label: 'Poodle', value: 'Poodle' },
        { label: 'Pug', value: 'Pug' },
        { label: 'Rottweiler', value: 'Rottweiler' },
        { label: 'Schnauzer', value: 'Schnauzer' },
        { label: 'Shar-pei', value: 'Shar-pei' },
        { label: 'Shiba', value: 'Shiba' },
        { label: 'Shih tzu', value: 'Shih tzu' },
        { label: 'Staffordshire bull terrier', value: 'Staffordshire bull terrier' },
        { label: 'Weimaraner', value: 'Weimaraner' },
        { label: 'Yorkshire', value: 'Yorkshire' },
    ],

    Gato: [
        { label: 'Sem raça definida (SRD)', value: 'Sem raça definida (SRD)' },
        { label: 'Abissínio', value: 'Abissínio' },
        { label: 'Angorá turco', value: 'Angorá turco' },
        { label: 'American curl.', value: 'American curl.' },
        { label: 'American Shorthair.', value: 'American Shorthair.' },
        { label: 'American wirehair', value: 'American wirehair' },
        { label: 'Azul ruso', value: 'Azul ruso' },
        { label: 'Balinês', value: 'Balinês' },
        { label: 'Bengal', value: 'Bengal' },
        { label: 'Bobtail Japonês', value: 'Bobtail Japonês' },
        { label: 'Bombay', value: 'Bombay' },
        { label: 'British Shorthair', value: 'British Shorthair' },
        { label: 'Burmês', value: 'Burmês' },
        { label: 'Burmês Europeu', value: 'Burmês Europeu' },
        { label: 'California spangled', value: 'California spangled' },
        { label: 'Chartreux', value: 'Chartreux' },
        { label: 'Cornish rex', value: 'Cornish rex' },
        { label: 'Devon Rex', value: 'Devon Rex' },
        { label: 'Exótico', value: 'Exótico' },
        { label: 'Habana', value: 'Habana' },
        { label: 'Himalayan', value: 'Himalayan' },
        { label: 'Javanês', value: 'Javanês' },
        { label: 'Korat', value: 'Korat' },
        { label: 'Maine coon', value: 'Maine coon' },
        { label: 'Manx', value: 'Manx' },
        { label: 'Mau Egípcio N', value: 'Mau Egípcio N' },
        { label: 'Nibelungo', value: 'Nibelungo' },
        { label: 'Noruega da floresta', value: 'Noruega da floresta' },
        { label: 'Ocicat', value: 'Ocicat' },
        { label: 'Oriental de pêlo curto', value: 'Oriental de pêlo curto' },
        { label: 'Persa', value: 'Persa' },
        { label: 'Ragamuffin', value: 'Ragamuffin' },
        { label: 'Ragdoll', value: 'Ragdoll' },
        { label: 'Sagrado da Birmânia', value: 'Sagrado da Birmânia' },
        { label: 'Scottish fold', value: 'Scottish fold' },
        { label: 'Selkirk rex', value: 'Selkirk rex' },
        { label: 'Siamês', value: 'Siamês' },
        { label: 'Singapur', value: 'Singapur' },
        { label: 'Shorthair Americano', value: 'Shorthair Americano' },
        { label: 'Shorthair Britânico', value: 'Shorthair Britânico' },
        { label: 'Shorthair Exótico', value: 'Shorthair Exótico' },
        { label: 'Snowshoe', value: 'Snowshoe' },
        { label: 'Somali', value: 'Somali' },
        { label: 'Sphynx', value: 'Sphynx' },
        { label: 'Tiffanie', value: 'Tiffanie' },
        { label: 'Tonquinês.', value: 'Tonquinês.' },
        { label: 'Van turco.', value: 'Van turco.' },
    ],

    Pássaro: [
        { label: 'Agapornis', value: 'Agapornis' },
        { label: 'Arara', value: 'Arara' },
        { label: 'Cacatua', value: 'Cacatua' },
        { label: 'Calopsita', value: 'Calopsita' },
        { label: 'Canário', value: 'Canário' },
        { label: 'Coleiro', value: 'Coleiro' },
        { label: 'Curió', value: 'Curió' },
        { label: 'Papagaio', value: 'Papagaio' },
        { label: 'Pintassilgo', value: 'Pintassilgo' },
        { label: 'Periquito', value: 'Periquito' },
        { label: 'Trinca-Ferro', value: 'Trinca-Ferro' },
        { label: 'Tucano', value: 'Tucano' },
    ],

    Peixe: [
        { label: 'Betta', value: 'Betta' },
        { label: 'Neon Chinês', value: 'Neon Chinês' },
        { label: 'Peixinho Dourado ou Goldfish', value: 'Peixinho Dourado ou Goldfish' },
        { label: 'Tetras', value: 'Tetras' },
    ],

    Outros: [
        { label: 'Coelho Fuzzy Lop', value: 'Coelho Fuzzy Lop' },
        { label: 'Coelho Holandês', value: 'Coelho Holandês' },
        { label: 'Coelho Dwarf Hothot', value: 'Coelho Dwarf Hothot' },
        { label: 'Coelho Holland Lop', value: 'Coelho Holland Lop' },
        { label: 'Coelho Mini Lop', value: 'Coelho Mini Lop' },
        { label: 'Coelho Netherland Dwarf', value: 'Coelho Netherland Dwarf' },
        { label: 'Coelho Polish', value: 'Coelho Polish' },
        { label: 'Coelho Mini Rex', value: 'Coelho Mini Rex' },
        { label: 'Coelho Lion', value: 'Coelho Lion' },
        { label: 'Hamster Anão Russo', value: 'Hamster Anão Russo' },
        { label: 'Hamster Chines', value: 'Hamster Chines' },
        { label: 'Hamster Roboroviski', value: 'Hamster Roboroviski' },
        { label: 'Hamster Sírio', value: 'Hamster Sírio' },
        { label: 'Tartaruga de Madeira', value: 'Tartaruga de Madeira' },
        { label: 'Tartaruga Russa', value: 'Tartaruga Russa' },
        { label: 'Tartaruga Pintada', value: 'Tartaruga Pintada' },
    ]
}
const SEX_SELECT = [
    { label: "Macho", value: "Macho" },
    { label: "Fêmea", value: "Fêmea" },
]

const USER_LIST = [
    {
        _id: 0,
        title: "Informações Pessoais",
        body: "Mantenha suas informações sempre atualizadas.",
        buttonText: "Editar",
        icon: "mobile",
        action: "EditAccount",
        params: null
    },
    {
        _id: 1,
        title: "Endereço de Email",
        body: "Use sempre um endereço de email válido.",
        buttonText: "Editar",
        icon: "envelope",
        action: "EditPassAndEmail",
        params: { type: "email" }
    },
    {
        _id: 2,
        title: "Sua Senha",
        body: "Mantenha sua conta sempre protegida.",
        buttonText: "Alterar Senha",
        icon: "lock",
        action: "EditPassAndEmail",
        params: { type: "password" }
    },
]

const HYGIENE_LIST = [{
    id: 'Banho',
    name: 'Banho',
},
{
    id: 'Tosa',
    name: 'Tosa',
}]

const VACCINE_LIST = [{
    id: 'V8',
    name: 'V8',
},
{
    id: 'V10',
    name: 'V10',
},
{
    id: 'V12',
    name: 'V12',
},
{
    id: 'Gripe Canina',
    name: 'Gripe Canina',
},
{
    id: 'Glárdia',
    name: 'Glárdia',
},
{
    id: 'Raiva Canina',
    name: 'Raiva Canina',
},
{
    id: 'Leishmaniose',
    name: 'Leishmaniose',
},
]

var RADIO_PROPS = [
    { label: '08:00h ~ 08:30h', value: '08:00h ~ 08:30h' },
    { label: '09:00h ~ 09:30h', value: '09:00h ~ 09:30h' },
    { label: '09:45h ~ 10:15h', value: '09:45h ~ 10:15h' },
    { label: '10:30h ~ 11:00h', value: '10:30h ~ 11:00h' },
    { label: '11:00h ~ 12:00h', value: '11:00h ~ 12:00h' },
    { label: '13:30h ~ 14:00h', value: '13:30h ~ 14:00h' },
    { label: '14:15h ~ 14:45h', value: '14:15h ~ 14:45h' },
    { label: '15:00h ~ 15:30', value: '15:00h ~ 15:30' },
    { label: '16:00h ~ 16:30h', value: '16:00h ~ 16:30h' },
    { label: '16:45h ~ 17:15h', value: '16:45h ~ 17:15h' },
    { label: '17:30h ~ 18:00h', value: '17:30h ~ 18:00h' },
];
  
export {
    COLOR,
    LIST_USER_OPTIONS,
    SPECIES_SELECT,
    BREED_SELECT,
    SEX_SELECT,
    USER_LIST,
    HYGIENE_LIST,
    VACCINE_LIST,
    RADIO_PROPS
}