const mapService = require("../services/maps.service");

module.exports.getCoordinates = async (req, res) => {
    try {
        const { address } = req.query;

        if (!address) {
            return res.status(400).json({
                message: "Address is required",
            });
        }

        const coordinates = await mapService.getAddress(address);

        return res.status(200).json(coordinates);

    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

module.exports.getDistanceTime = async ( req , res) =>{
    try{
        const {origin , destination } = req.query
        

        if(!origin || !destination){
            return res.status(400).json({
                message: "origin and destination both required" 
            })
        }
        const originAddress = await mapService.getAddress(origin)
        //await new Promise(resolve => setTimeout(resolve, 1500));
        const destinationAddress = await mapService.getAddress(destination)
       

        const result = await mapService.getDistanceTime(
            originAddress , destinationAddress
            
           // JSON.parse(origin),
           // JSON.parse(destination)
        )
        // console.log(originAddress , destinationAddress)
        return res.status(200).json(result)
    }catch(error){
        return res.status(500).json({
            message:error.message 
        })
    }
}