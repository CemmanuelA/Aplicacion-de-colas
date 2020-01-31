const { io } = require('../server');
const { TicketControl } = require('../classes/ticket-control');

const ticketControl  = new TicketControl()

io.on('connection', (client) => {

   client.on('siguienteTicket', (data, callback) => {
        let siguiente = ticketControl.siguiente();
        console.log('El siguiente ticket es: ' + siguiente);
        callback(siguiente);
   });

   // emitir estadoa ctual
   client.emit('estadoActual',{
       actual: ticketControl.getUltimoTicket(),
       ultimos4: ticketControl.getUltimos4Ticket()
   });

   client.on('atenderTicket', (data, callback) => {
        if (!data.escritorio) {
            return callback({ err: true , mensaje: 'El escritorio es necesario'});   
        }

        let atenderTicket = ticketControl.antederTicket(data.escritorio);

        callback(atenderTicket)

        client.broadcast.emit('ultimos4', {ultimos4: ticketControl.getUltimos4Ticket()});
   });
});