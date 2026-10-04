const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        //console.log(`Client connected: ${socket.id}`);

        socket.on('join', async (data) => {
            try {
                const { userId, userType } = data;
                if (!userId || !userType) return;

                // console.log(`Join event received: userId=${userId}, userType=${userType}, socketId=${socket.id}`);

                if (userType === 'user') {
                    await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
                    socket.join(`user_${userId}`);
                } else if (userType === 'captain') {
                    await captainModel.findByIdAndUpdate(userId, { socketId: socket.id, status: 'active' });
                    socket.join('captains');
                    socket.join(`captain_${userId}`);
                }

                if (data.rideId) {
                    socket.join(`ride:${data.rideId}`);
                }
            } catch (err) {
                console.error("Error in join socket event:", err.message);
            }
        });

        socket.on('join-ride', ({ rideId }) => {
            if (rideId) {
                socket.join(`ride:${rideId}`);
                //console.log(`Socket ${socket.id} joined room: ride:${rideId}`);
            }
        });

        socket.on('update-location', ({ rideId, location }) => {
            if (rideId && location) {
                io.to(`ride:${rideId}`).emit('driver-location', location);
            }
        });

        socket.on('update-location-captain', async (data) => {
            try {
                const { userId, location } = data;
                if (!location || !location.lat || !location.long) return;

                await captainModel.findByIdAndUpdate(userId, {
                    location: {
                        lat: location.lat,
                        long: location.long
                    }
                });
            } catch (err) {
                console.error("Error updating captain location:", err.message);
            }
        });

        socket.on('disconnect', async () => {
            //console.log(`Client disconnected: ${socket.id}`);
            try {
                await userModel.updateMany({ socketId: socket.id }, { socketId: null });
                await captainModel.updateMany({ socketId: socket.id }, { socketId: null });
            } catch (err) {
                console.error("Error on socket disconnect cleanup:", err.message);
            }
        });
    });

    return io;
}

function sendMessageToSocketId(socketId, messageObject) {
    if (io && socketId) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
    }
}

function sendMessageToUser(userId, event, data) {
    if (io && userId) {
        io.to(`user_${userId}`).emit(event, data);
    }
}

function sendMessageToCaptain(captainId, event, data) {
    if (io && captainId) {
        io.to(`captain_${captainId}`).emit(event, data);
    }
}

function sendMessageToCaptains(event, data) {
    if (io) {
        io.to('captains').emit(event, data);
        io.emit(event, data);
    }
}

function sendMessageToRideRoom(rideId, event, data) {
    if (io && rideId) {
        io.to(`ride:${rideId}`).emit(event, data);
    }
}

function broadcastEvent(event, data) {
    if (io) {
        io.emit(event, data);
    }
}

module.exports = {
    initializeSocket,
    sendMessageToSocketId,
    sendMessageToUser,
    sendMessageToCaptain,
    sendMessageToCaptains,
    sendMessageToRideRoom,
    broadcastEvent
};
