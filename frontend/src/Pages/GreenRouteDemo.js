import React, { useState } from 'react';
import MapComponent from './MapComponent';
import AutocompleteInput from './AutocompleteInput';
import CO2Calculator from './CO2Calculator';
import './CssPages/GreenRouteDemo.css';

function GreenRouteDemo() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [stops, setStops] = useState(['']);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    setLoading(true);
    setRoutes([]);
    setSelectedRoute(null);
    setError('');

    const waypoints = stops.filter(stop => stop.trim() !== '').join('|');
    let url = `http://localhost:8080/route?origin=${origin}&destination=${destination}`;
    if (waypoints) url += `&waypoints=${waypoints}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log("Data received from backend:", data);
        if (data && Array.isArray(data) && data.length > 0) {
          if (data.length === 1 && data[0].content && data[0].content.startsWith('Error')) {
            setError(data[0].content);
          } else {
            setRoutes(data);
            setSelectedRoute(data[0]);
          }
        } else {
          setError('No routes found or unexpected data format.');
        }
      })
      .catch(() => setError('Error fetching data. Is the backend running?'))
      .finally(() => setLoading(false));
  };

  return (
    <div className='style'>
      <div className='font'>Green Route Demo</div>
      <div className='desc'>
        <p>Find the shortest route by distance to save fuel and get AI predictions.</p>
      </div>
      
      <div className="main-content-container">
        <div className="input-panel">
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

          <div className='reverse-addstop-container'>
            <button onClick={handleReverse}>Reverse</button>
            <button onClick={addStop}>Add Stop</button>
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
          </div>

          <button onClick={handleClick} disabled={loading}>
            {loading ? 'Finding Route...' : 'Get Green Routes'}
          </button>

          {error && <div className='error-message'>{error}</div>}
        </div>

        <div className="display-panel">
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
                <h3>Alternative Routes</h3>
                {routes.map(route => (
                  <div
                    key={route.routeNumber}
                    className={selectedRoute && selectedRoute.routeNumber === route.routeNumber ? 'selected' : ''}
                    onClick={() => setSelectedRoute(route)}
                  >
                    <h4>
                      Route {route.routeNumber}
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
                    <p>{route.distance} • {route.duration} • {route.fuelUsed}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedRoute && (
            <div className='selected-route-details'>
              <h3>Selected Route</h3>
              
              <CO2Calculator 
                distance={selectedRoute.distance}
                duration={selectedRoute.duration}
                fuelUsed={selectedRoute.fuelUsed}
              />
              
              <div className='ai-prediction'>
                <p><strong>AI Insight:</strong> {truncateText(selectedRoute.fuelSavingPrediction, 300)}</p>
              </div>
              
              <div className='navigation-buttons'>
                <button onClick={() => window.open(generateWazeUrl(selectedRoute), '_blank')} disabled={!selectedRoute}>Open in Waze</button>
                <button onClick={() => window.open(generateGoogleMapsUrl(selectedRoute), '_blank')} disabled={!selectedRoute}>Open in Google Maps</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GreenRouteDemo;
