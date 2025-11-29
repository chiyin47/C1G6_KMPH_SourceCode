import React, { useState } from 'react';
import MapComponent from './MapComponent';
import AutocompleteInput from './AutocompleteInput';
import './CssPages/GreenRouteDemo.css';

function GreenRouteDemo() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [stops, setStops] = useState(['']);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loadingRoute, setLoadingRoute] = useState(false); // Renamed to avoid clash
  const [errorRoute, setErrorRoute] = useState(''); // Renamed to avoid clash

  // State for CO2 Calculator
  const [transportType, setTransportType] = useState("car"); // Default to car, will adjust options
  const [distance, setDistance] = useState(0);
  const [passengers, setPassengers] = useState(1);
  const [co2, setCo2] = useState(null);
  const [loadingCO2, setLoadingCO2] = useState(false);
  const [errorCO2, setErrorCO2] = useState(null);

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length <= maxLength ? text : text.substring(0, maxLength) + '...';
  };

  const generateWazeUrl = (route) => {
    if (!route || !route.coordinates || route.coordinates.length === 0) return '';
    const destinationLatLng = route.coordinates[route.coordinates.length - 1];
    return `waze://?ll=${destinationLatLng.lat},${destinationLatLng.lng}&navigate=yes`;
  };

  const generateGoogleMapsUrl = (route) => {
    if (!route || !route.coordinates || route.coordinates.length === 0) return '';

    const originLatLng = route.coordinates[0];
    const destinationLatLng = route.coordinates[route.coordinates.length - 1];

    let waypointsParam = '';
    if (route.waypoints && route.waypoints.length > 0) {
      waypointsParam = '&waypoints=' + route.waypoints.map(wp => `${wp.lat},${wp.lng}`).join('|');
    }

    return `https://www.google.com/maps/dir/?api=1&origin=${originLatLng.lat},${originLatLng.lng}&destination=${destinationLatLng.lat},${destinationLatLng.lng}${waypointsParam}`;
  };

  const handleStopChange = (index, value) => {
    const newStops = [...stops];
    newStops[index] = value;
    setStops(newStops);
  };

  const addStop = () => setStops([...stops, '']);
  const removeStop = (index) => setStops(stops.filter((_, i) => i !== index));

  const handleReverse = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleClick();
  };

  const handleClick = () => {
    setLoadingRoute(true);
    setRoutes([]);
    setSelectedRoute(null);
    setErrorRoute('');

    const waypoints = stops.filter(stop => stop.trim() !== '').join('|');
    let url = `http://localhost:8080/route?origin=${origin}&destination=${destination}`;
    if (waypoints) url += `&waypoints=${waypoints}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log("Data received from backend:", data);
        if (data && Array.isArray(data) && data.length > 0) {
          if (data.length === 1 && data[0].content && data[0].content.startsWith('Error')) {
            setErrorRoute(data[0].content);
          } else {
            setRoutes(data);
            setSelectedRoute(data[0]);
          }
        } else {
          setErrorRoute('No routes found or unexpected data format.');
        }
      })
      .catch(() => setErrorRoute('Error fetching data. Is the backend running?'))
      .finally(() => setLoadingRoute(false));
  };

  // Handler for CO2 Calculator submission
  const handleCO2Submit = async (e) => {
    e.preventDefault();
    setErrorCO2(null);
    setLoadingCO2(true);
    try {
      const response = await fetch("http://localhost:8080/api/calculate-co2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transportType, distance: Number(distance), passengers: Number(passengers) }),
      });
      if (!response.ok) throw new Error(`Server error ${response.status}`);
      const data = await response.json();
      setCo2(data.co2);
    } catch (err) {
      setErrorCO2(err.message || "Request failed");
    } finally {
      setLoadingCO2(false);
    }
  };

  return (
    <div className='style'>
      <div className='font'>Green Route Demo</div>
      <div className='desc'>
        <p>Find the shortest route by distance to save fuel and get AI predictions.</p>
      </div>

      <div className='main-content-columns'>
        <div className='left-column-content'>
          <div className='origin'>
            <label>Origin:</label>
            <div className="input-card">
              <AutocompleteInput
                value={origin}
                onChange={setOrigin}
                onKeyDown={handleKeyPress}
                placeholder="Enter origin location..."
              />
            </div>
          </div>

          <div className='reverse-button'>
            <button onClick={handleReverse}>Reverse</button>
          </div>

          <div className='destination'>
            <label>Destination:</label>
            <div className="input-card">
              <AutocompleteInput
                value={destination}
                onChange={setDestination}
                onKeyDown={handleKeyPress}
                placeholder="Enter destination location..."
              />
            </div>
          </div>

          <div className='stops-container'>
            <label>Stops:</label>
            {stops.map((stop, index) => (
              <div className="input-card" key={index}>
                <AutocompleteInput
                  value={stop}
                  onChange={value => handleStopChange(index, value)}
                  onKeyDown={handleKeyPress}
                  placeholder={`Stop ${index + 1}`}
                />
                <button onClick={() => removeStop(index)}>Remove</button>
              </div>
            ))}
            <button onClick={addStop}>Add Stop</button>
          </div>

          <button onClick={handleClick} disabled={loadingRoute}>
            {loadingRoute ? 'Finding Route...' : 'Get Green Routes'}
          </button>

          {errorRoute && <div className='error-message'>{errorRoute}</div>}
        </div>

        <div className='right-column-content'>
          <div className="co2-calculator">
            <h2>CO₂ Calculator</h2>
            <form onSubmit={handleCO2Submit}>
              <label>Transport Type:</label>
              <select value={transportType} onChange={(e) => setTransportType(e.target.value)}>
                <option value="car">Car</option>
                <option value="bus">Bus</option>
                <option value="train">Train</option>
                <option value="plane">Plane</option>
              </select>

              <label>Distance (km):</label>
              <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} />

              <label>Passengers:</label>
              <input type="number" min="1" value={passengers} onChange={(e) => setPassengers(e.target.value)} />

              <button type="submit" disabled={loadingCO2}>{loadingCO2 ? "Calculating..." : "Calculate"}</button>
            </form>

            {errorCO2 && <p className="error">Error: {errorCO2}</p>}

            {co2 !== null && !errorCO2 && (
              <p>Estimated CO₂: {Number(co2).toFixed(2)} kg</p>
            )}
          </div>

          {selectedRoute && (
            <div className='selected-route-details'>
              <h3>Selected Route Details:</h3>
              <p><strong>Route:</strong> {selectedRoute.content}</p>
              <p><strong>Distance:</strong> {selectedRoute.distance}</p>
              <p><strong>Duration:</strong> {selectedRoute.duration}</p>
              <p><strong>Fuel Used:</strong> {selectedRoute.fuelUsed}</p>
              <p><strong>AI Prediction:</strong> {truncateText(selectedRoute.fuelSavingPrediction, 250)}</p>
              <p><strong>Efficiency Color:</strong> <span style={{ color: selectedRoute.color, fontWeight: 'bold' }}>{selectedRoute.color ? selectedRoute.color.toUpperCase() : 'N/A'}</span></p>
              <div className='navigation-buttons'>
                <button onClick={() => window.open(generateWazeUrl(selectedRoute), '_blank')} disabled={!selectedRoute}>Open in Waze</button>
                <button onClick={() => window.open(generateGoogleMapsUrl(selectedRoute), '_blank')} disabled={!selectedRoute}>Open in Google Maps</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className='map-routes-container'>
        <div className='map-container'>
          {selectedRoute ? (
            <MapComponent route={selectedRoute} />
          ) : (
            <div>Map will appear here after fetching a route</div>
          )}
        </div>

        {routes.length > 0 && (
          <div className='routes-list'>
            <h3>Alternative Routes:</h3>
            {routes.map(route => (
              <div
                key={route.routeNumber}
                className={selectedRoute && selectedRoute.routeNumber === route.routeNumber ? 'selected' : ''}
                onClick={() => setSelectedRoute(route)}
              >
                <h4>
                  Route {route.routeNumber}: {route.content}
                  {route.color && (
                    <span
                      style={{
                        marginLeft: '10px',
                        height: '12px',
                        width: '12px',
                        backgroundColor: route.color,
                        borderRadius: '50%',
                        display: 'inline-block'
                      }}
                      title={`Efficiency: ${route.color}`}
                    ></span>
                  )}
                </h4>
                <p><strong>Distance:</strong> {route.distance}</p>
                <p><strong>Duration:</strong> {route.duration}</p>
                <p><strong>Fuel Used:</strong> {route.fuelUsed}</p>
                <p><strong>AI Prediction:</strong> {truncateText(route.fuelSavingPrediction, 250)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
  );
}

export default GreenRouteDemo;
