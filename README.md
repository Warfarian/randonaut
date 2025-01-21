# Flight Search API

A simple API to search for flights using FlightRadar24 data.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
node server.js
```

## API Endpoints

### Search Flights
`POST /api/search-flights`

Search for flights with optional filters.

Request body:
```json
{
    "airline": "UAE",
    "bounds": "73,-12,-156,38",
    "registration": "N12345",
    "aircraftType": "B77W"
}
```

All fields are optional.

### Search Flights by Location
`POST /api/search-flights/location`

Search for flights near a specific location.

Request body:
```json
{
    "latitude": 52.567967,
    "longitude": 13.282644,
    "radius": 2000
}
```

Required fields:
- latitude: Decimal degrees
- longitude: Decimal degrees
- radius: Search radius in meters (default: 2000)

### Get Flight Details
`GET /api/flight/:flightId`

Get detailed information about a specific flight.

### Health Check
`GET /health`

Returns server status.