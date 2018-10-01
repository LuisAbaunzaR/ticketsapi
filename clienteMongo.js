console.log('soy el cliente de mongo')
const mongoose = require('mongoose');
const url='mongodb://userdb:master01@ds121955.mlab.com:21955/marketdb';

mongoose.connect(url,{
    useNewUrlParser: true,
},()=>{
    console.log("conexion exitosa con la base de datos Market")
})

const Schema= mongoose.Schema  //SE CREA LA CONSTANTE QUE GUARDA EL MONGOOSE SCHEMA
const ObjectId = mongoose.Schema.ObjectId // SE CREA LA CONSTANTE QUE GUARDARA EL OBJECT.ID DEL SCHEMA (LLAVE ID)

const articuloSchema = Schema({
    articulo: ObjectId,
    nombre: {type: String, require: true},
    precio: {type: Number, require: true},
    existencias: {type:Number, default:10 }

});

const ticketSchema = Schema({
    ticket: ObjectId,
    subtotal: {type: Number, default:0},
    iva: {type:Number, default:0},
    total: {type:Number, default:0},
    articulos: [{type:ObjectId, ref:'Articulo', required:true}]

})

const Articulo = mongoose.model('Articulo',articuloSchema) 
const Ticket = mongoose.model('Ticket', ticketSchema)

module.exports={Articulo,Ticket}
