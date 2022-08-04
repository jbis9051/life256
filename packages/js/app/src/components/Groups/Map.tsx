import React from 'react';
import MapTemplate from '../MapTemplate';

interface Location {
    longitude: number;
    latitude: number;
}

const Map: React.FunctionComponent<{
    location: Location;
    markerLocation: Location;
    setLocation: (newLocation: Location) => void;
}> = ({ location, markerLocation, setLocation }) => (
    <MapTemplate
        region={location}
        markerRegion={markerLocation}
        updateLocation={setLocation}
        style={{ flex: 1 }}
    />
);

export default Map;