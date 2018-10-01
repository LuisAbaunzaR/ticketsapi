const express = require('express');
const bodyParser = require('body-parser');

const {Articulo, Ticket}= require ('./clienteMongo.js')
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//---------------------------//
//CRUD Articulos

// CREATE -> Post One
app.post('/api/articulos/',(request, response)=>{
let jsonArticulo = request.body

const nuevoArticulo = Articulo(jsonArticulo) 
    nuevoArticulo
                .save((error,articulo)=>{
                    response
                    .status(201)
                    .send({
                        "mensaje": `Articulo creado exitosamente con el ID ${articulo.id}`,
                        "body": articulo,
                        "error": error
                    })
                })
})

//---------------------------//
// GET ALL ARTICULOS
app.get('/api/articulos/',(request, response)=>{

    Articulo
        .find()
        .exec()
        .then(jsonResultado=>{
            response.status(200)
                .send({
                    "mensaje":"Listado de Articulos",
                    "body":{jsonResultado},
                })
                
        })
        .catch(error=> console.log(error))

})

//---------------------------//
// GET ONE ARTICULOS
app.get('/api/articulos/:id/',(request,response)=>{
    const articuloId = request.params.id
    
    Articulo
        .findById(articuloId)
        .exec()
        .then(articuloEnc=>{
            response.status(200)
            .send(articuloEnc)
        })

        .catch(error=>{
            response.status(404).send(error)
        })

})

//---------------------------//
//UPDATE -> Put One
app.put('/api/articulos/:id/',(request,response)=>{
    const articuloId = request.params.id

    Articulo
        .findByIdAndUpdate(articuloId,{$set: request.body},{new: true})
        .exec()
        .then(articuloActualizazo=>{
            response.status(200)
            .send({
                
                "body":articuloActualizazo,
                "mensaje":`se actualizo articulo con ID: ${articuloId}`
            
            })
        })

        .catch( error => {
            response.status(400).send(`Error: ${error}`);
        });  


})

//---------------------------//
//DELETE ->Delete One
app.delete('/api/articulos/:id/',(request,response)=>{
    const articuloId = request.params.id

    Articulo
        .findByIdAndDelete(articuloId)
        .exec()
        .then(eliminado=>{
            response.status(204)
            .send({
                "message":"Usuario Eliminado"
            })
        })
        .catch( error => {
            response.status(404).send(error)
        })
})

//---------------------------//
//      CRUD Tickets
//---------------------------//

// CREATE -> Post One

app.post('/api/tickets/',(request, response)=>{
    let jsonTickets = request.body
    
    const nuevoTicket = Ticket(jsonTickets) 
        nuevoTicket
                    .save((error,ticket)=>{
                        response
                        .status(201)
                        .send({
                            "mensaje": `Ticket creado exitosamente con el ID ${ticket.id}`,
                            "body": ticket,
                            "error": error
                        })
                    })
    })
//---------------------------//
// GET ALL TICKETS 

app.get('/api/tickets/',(request, response)=>{

    Ticket
        .find()
        .exec()
        .then(jsonTicketsResultado=>{
            response.status(200)
            .send({
                "message":"Listado de Articulos",
                "body":{jsonTicketsResultado}
            })
        })
        .catch(error=> console.log(error))

})

//---------------------------//
// GET ONE TICKET

app.get('/api/tickets/:id/',(request, response)=>{
    const ticketId = request.params.id

        Ticket
            .findById(ticketId)
            .exec()
            .then(ticketResultado=>{
                response.status(200)
                .send(ticketResultado)

            })
            .catch(error=>{
                response.status(404).send(error)
            })
})

//---------------------------//
// UPDATE TICKET

app.put('/api/tickets/:id/',(request, response)=>{
    const ticketId = request.params.id

    Ticket
    .findByIdAndUpdate(ticketId,{$set: request.body},{new: true})
    .exec()
    .then(ticketActualzado=>{
        response.status(201)
        .send({
            "body":ticketActualzado,
            "mensaje":`se actualizo articulo con ID: ${ticketActualzado.id}`
        })
    })
    .catch(error=>{
        response.status(400).send(error)
    })

})

//---------------------------//
// DELETE TICKET

app.delete('/api/tickets/:id/',(request, response)=>{
    const ticketId = request.params.id

    Ticket
    .findByIdAndDelete(ticketId)
    .exec()
    .then(eliminado=>{
        response.status(204)
        .send({
            "message":"Usuario Eliminado",
            "body": eliminado
        })
    })
    .catch( error => {
        response.status(404).send(error)
    })


})
                
// ----- CALCULAR SUBTOTAL, IVA Y TOTAL DE TICKET ------
app.get('/api/tickets/facturar/:id/',(request, response)=>{
  
   //console.log('Comienza el callback');

    const ticketId = request.params.id
    let subtotal=0, iva=0, total=0;

    //console.log("Comienza la petición");

    Ticket
        .findById(ticketId)
        .populate('articulos')
        .exec()
        .then(ticket=>{
            ticket.articulos.map(articulo => {
                subtotal += articulo.precio
            })
              //console.log(`subtotal: ${subtotal}, iva: ${iva}, total: ${total}`);

            iva = (subtotal * 0.16);
            total = subtotal + iva;

            Ticket
                .findByIdAndUpdate(
                    ticket._id,
                    {
                        subtotal: subtotal,
                        iva: iva,
                        total: total
                    },
                    {new:true})
                    .populate('articulos')
                    .exec()
                    .then(ticketcalulado=>{
                        response.status(200)
                        .send(ticketcalulado)

                    })
                    .catch( error => res.status(404).send(error));
        })
        .catch( error => res.status(400).send(error));
        })
        

//.listen(process.env.PORT || 3000)
var PORT = process.env.port || 8801;
app.listen(PORT,()=>{
    console.log(`Servidor Corriendo en el puerto ${PORT}`)
})





