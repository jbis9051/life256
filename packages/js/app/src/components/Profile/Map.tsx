import React from 'react';
import { View, Platform } from 'react-native';
import MapView from 'react-native-maps';
import MapboxGL from "@rnmapbox/maps";

const Map: React.FunctionComponent<{ mapType: string }> = ({ mapType }) => {
    const mapStyle = mapType === 'Street' ? MapboxGL.StyleURL.Street : MapboxGL.StyleURL.Satellite;

    return Platform.OS === 'ios' ? (
        <View>
            <MapView
                initialRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                style={{
                    height: 300,
                    borderRadius: 15,
                    marginBottom: 10,
                }}
            />
        </View>
    ) : (
        <View>
            <MapboxGL.MapView 
                style={{ 
                    overflow: 'hidden',
                    height: 300, 
                    borderRadius: 15, 
                    marginBottom: 10 
                }} 
                styleURL={mapStyle}
            >
                <MapboxGL.Camera
                    zoomLevel={10}
                    centerCoordinate={[
                        -122.4324,
                        37.78825
                    ]}
                />
                <MapboxGL.UserLocation
                />
            </MapboxGL.MapView>
        </View>
    );
};

export default Map;
