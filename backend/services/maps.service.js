const axios = require("axios");

module.exports.getAddress = async (address) => {
    
    try {
        const response = await axios.get(
            "https://nominatim.openstreetmap.org/search",
            {
                params: {
                    q: address,
                    format: "json",
                    limit: 5,
                },
                headers: {
                    "User-Agent": "uber-clone/1.0",
                },
            }
        );
         


        if (!response.data || response.data.length === 0) {
            throw new Error("Location not found");
        }

        return {
            lat: Number(response.data[0].lat),
            lng: Number(response.data[0].lon),
        };

    } catch (error) {
        console.error("Nominatim error:", error.message);
        throw new Error("Unable to get location");
    }
};
module.exports.getDistanceTime = async ( origin , destination) =>{
  //  console.log(origin,destination)

    try{
        const response = await axios.get(
         `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}`,
         {
            params:{
                overview:false
            }
         }

      )
      if(response.data.code != "Ok" ){
        throw new Error("unable to fetch the distance ")
      }
      const route = response.data.routes[0];

    return {
            distance: route.distance/1000,
            duration: Math.round(route.duration/60)
        };
        
    }catch(error){
        console.error("OSRM error:", error.message);
        throw new Error("Unable to calculate distance and time");
    }
    

    
}