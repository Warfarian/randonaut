const express = require('express');
const cors = require('cors');
const { FlightRadar24API } = require('flightradarapi');

const app = express();
const port = process.env.PORT || 3000;
const frApi = new FlightRadar24API();

app.use(cors());
app.use(express.json());

// Search flights endpoint
app.post('/api/search-flights', async (req, res) => {
    try {
        const {
            airline,
            bounds,
            registration,
            aircraftType
        } = req.body;

        const flights = await frApi.getFlights(
            airline || null,
            bounds || null,
            registration || null,
            aircraftType || null
        );

        res.json({
            success: true,
            count: flights.length,
            flights: flights.map(flight => ({
                id: flight.id,
                registration: flight.registration,
                altitude: flight.altitude,
                groundSpeed: flight.groundSpeed,
                heading: flight.heading,
                latitude: flight.latitude,
                longitude: flight.longitude,
                aircraftCode: flight.aircraftCode,
                airline: flight.airline,
                flightNumber: flight.flightNumber,
                originAirportIata: flight.originAirportIata,
                destinationAirportIata: flight.destinationAirportIata
            }))
        });

    } catch (error) {
        console.error('Error searching flights:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to search flights',
            message: error.message
        });
    }
});

// Get flight details endpoint
app.get('/api/flight/:flightId', async (req, res) => {
    try {
        const { flightId } = req.params;
        const flights = await frApi.getFlights(null, null, null, null);
        const flight = flights.find(f => f.id === flightId);

        if (!flight) {
            return res.status(404).json({
                success: false,
                error: 'Flight not found'
            });
        }

        const details = await frApi.getFlightDetails(flight);
        flight.setFlightDetails(details);

        res.json({
            success: true,
            flight: {
                id: flight.id,
                registration: flight.registration,
                altitude: flight.altitude,
                groundSpeed: flight.groundSpeed,
                heading: flight.heading,
                latitude: flight.latitude,
                longitude: flight.longitude,
                aircraftCode: flight.aircraftCode,
                airline: flight.airline,
                flightNumber: flight.flightNumber,
                originAirportIata: flight.originAirportIata,
                destinationAirportIata: flight.destinationAirportIata,
                originAirportName: flight.originAirportName,
                destinationAirportName: flight.destinationAirportName,
                status: flight.status,
                aircraft: flight.aircraft
            }
        });

    } catch (error) {
        console.error('Error getting flight details:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to get flight details',
            message: error.message
        });
    }
});

// Search flights by location endpoint
app.post('/api/search-flights/location', async (req, res) => {
    try {
        const { latitude, longitude, radius = 2000 } = req.body;

        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                error: 'Latitude and longitude are required'
            });
        }

        const bounds = frApi.getBoundsByPoint(latitude, longitude, radius);
        const flights = await frApi.getFlights(null, bounds);

        res.json({
            success: true,
            count: flights.length,
            flights: flights.map(flight => ({
                id: flight.id,
                registration: flight.registration,
                altitude: flight.altitude,
                groundSpeed: flight.groundSpeed,
                heading: flight.heading,
                latitude: flight.latitude,
                longitude: flight.longitude,
                aircraftCode: flight.aircraftCode,
                airline: flight.airline,
                flightNumber: flight.flightNumber,
                originAirportIata: flight.originAirportIata,
                destinationAirportIata: flight.destinationAirportIata
            }))
        });

    } catch (error) {
        console.error('Error searching flights by location:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to search flights by location',
            message: error.message
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(port, () => {
    console.log(`Flight search API running on port ${port}`);
});
