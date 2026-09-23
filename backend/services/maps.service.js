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
module.exports.getDistanceTime = async (pickup, destination) => {
    console.log(pickup, destination)

    try {
        const pickupCoordinates = typeof pickup === 'string' ? await module.exports.getAddress(pickup) : pickup;
        const destinationCoordinates = typeof destination === 'string' ? await module.exports.getAddress(destination) : destination;

        const response = await axios.get(
            `https://router.project-osrm.org/route/v1/driving/${pickupCoordinates.lng},${pickupCoordinates.lat};${destinationCoordinates.lng},${destinationCoordinates.lat}`,
            {
                params: {
                    overview: false
                }
            }

        )
        if (response.data.code != "Ok") {
            throw new Error("unable to fetch the distance ")
        }
        const route = response.data.routes[0];

        return {
            distance: route.distance / 1000,
            duration: Math.round(route.duration / 60),
            time: Math.round(route.duration / 60)
        };

    } catch (error) {
        console.error("OSRM error:", error.message);
        throw new Error("Unable to calculate distance and time");
    }



}

module.exports.getSuggestion = async (input) => {
    if (!input) {
        throw new Error('query is required')
    }
    try {
        const response = await axios.get(
            "https://api.locationiq.com/v1/autocomplete",
            {
                params: {
                    key: process.env.LOCATIONIQ_API_KEY || "pk.7841ab341432d615f3118584d51e9e69",
                    q: input,
                    limit: 5,
                    countrycodes: "in"
                }
            }
        );

        return response.data.map(item => item.display_name).filter(Boolean);

    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        }
        console.error("LocationIQ error:", error.message);
        throw new Error("unable to get suggetions");
    }
}

