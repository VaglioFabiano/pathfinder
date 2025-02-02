import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline, UrlTile } from 'react-native-maps';
import * as Location from 'expo-location';
import RecenterButton from '@/components/recenterBotton';
import Tutorial from '@/components/Tutorial';
import TrailComponent from '@/components/TrailComponent';
import MapViewDirections from 'react-native-maps-directions';
import polyline from '@mapbox/polyline';


const GOOGLE_MAPS_APIKEY = 'AIzaSyDBHi_Rgdp1Va1KgknCyzJ4prT-hNTdevQ';

const WALK_SPEED_MS = 1.11; // Velocità in metri al secondo (4 km/h)


const AddTrail = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [region, setRegion] = useState<{ latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number } | null>(null);
  const [trailStarted, setTrailStarted] = useState(false);
  const [pathCoordinates, setPathCoordinates] = useState<{ latitude: number; longitude: number }[]>([]);
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const mapRef = useRef<MapView>(null);

  const [trailData, setTrailData] = useState({
    isActive: false,
    time: 0,
    distance: 0,
    downhill: 0,
    elevation: 0,
    positions: [] as { latitude: number; longitude: number }[],
    activityType: '',
  });
  
  useEffect(() => { (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);

      setRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    })();
  }, [refresh]);

  // Funzione per avviare il trail
  const startTrail = (position: { latitude: number; longitude: number }, selectedActivity: any) => {
    setTrailData({
      isActive: true,
      time: 0,
      distance: 0,
      downhill: 0,
      elevation: 0,
      positions: [position],
      activityType: selectedActivity,
    });
    setTrailStarted(true);
    setLocation(position);
    fetchRoute(position, { latitude: 45.464664, longitude: 9.188540 });
  };

  const fetchRoute = async (origin: { latitude: number; longitude: number }, destination: { latitude: number; longitude: number }) => {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${GOOGLE_MAPS_APIKEY}&mode=walking`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.routes.length > 0) {
        const route = data.routes[0];
        const decodedPath = polyline.decode(route.overview_polyline.points);

        const pathCoords = decodedPath.map(([latitude, longitude]) => ({ latitude, longitude }));
        setPathCoordinates(pathCoords);
        setCurrentPositionIndex(0);
      }
    } catch (error) {
      console.error('Errore nel recupero del percorso:', error);
    }
  };

  // Aggiornamento passo passo del trail
  useEffect(() => {
    if (trailData.isActive && pathCoordinates.length > 0) {
      const interval = setInterval(() => {
        setCurrentPositionIndex((prevIndex) => {
          if (prevIndex < pathCoordinates.length - 1) {
            const currentPosition = pathCoordinates[prevIndex];
            const nextPosition = pathCoordinates[prevIndex + 1];
            console.log(nextPosition);
            const distance = haversineDistance(currentPosition, nextPosition);
            
            let newPosition = currentPosition;
            let nextIndex = prevIndex;
            


            if (distance > WALK_SPEED_MS) {
              const fraction = WALK_SPEED_MS / distance;
              newPosition = interpolatePosition(currentPosition, nextPosition, fraction);
            } else {
              newPosition = nextPosition;
              nextIndex++;
            }

            setLocation(newPosition);
            setTrailData((prevData) => ({
              ...prevData,
              time: prevData.time + 1,
              distance: prevData.distance + WALK_SPEED_MS / 1000,
              positions: [...prevData.positions, newPosition],
            }));

            return nextIndex;
          } else {
            clearInterval(interval);
            setTrailStarted(false);
            setTrailData((prevData) => ({
              ...prevData,
              isActive: false,
            }));
            return prevIndex;
          }
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [trailData.isActive, pathCoordinates]);
  
  const endTrail = () => {
    setTrailData((prevData) => ({
      ...prevData,
      isActive: false,
    }));
    setTrailStarted(false);
  };

  const resetTrail = () => {
    setTrailData({
      isActive: false,
      time: 0,
      distance: 0,
      downhill: 0,
      elevation: 0,
      positions: [],
      activityType: '',
    });
    setRefresh((prev) => !prev);
    setTrailStarted(false);
  };
  const haversineDistance = (coord1: { latitude: number; longitude: number }, coord2: { latitude: number; longitude: number }) => {
    const R = 6371000; // Radius of Earth in meters
    const lat1 = (coord1.latitude * Math.PI) / 180;
    const lat2 = (coord2.latitude * Math.PI) / 180;
    const deltaLat = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
    const deltaLon = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };
  const interpolatePosition = (start: { latitude: number; longitude: number }, end: { latitude: number; longitude: number }, fraction: number) => {
    return {
      latitude: start.latitude + (end.latitude - start.latitude) * fraction,
      longitude: start.longitude + (end.longitude - start.longitude) * fraction,
    };
  };
  const calculateAverageSpeed = () => {
    return trailData.time > 0 ? parseFloat((trailData.distance / (trailData.time / 3600)).toFixed(2)) : 0;
  };


  if (!region || !location) {
    return <View style={styles.container} />;
  }


  return (
    <View style={styles.container}>
      <MapView showsCompass={false} ref={mapRef} style={styles.map} region={region} onRegionChangeComplete={(region) => setRegion(region)} mapType="terrain" >
        <UrlTile urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png" maximumZ={19} />
        {/* Marker per la posizione corrente */}
        {location && (
          <Marker coordinate={location}>
            <View style={styles.marker}>
              <View style={styles.innerCircle} />
            </View>
          </Marker>
        )}

        {/* Mostra il percorso */}
        {trailStarted && <Polyline coordinates={pathCoordinates} strokeColor="#3498db" strokeWidth={3} />}
      </MapView>

      {/* Componenti Trail */}
      <TrailComponent
        isActive={trailData.isActive}
        isRecap={!trailData.isActive && trailData.time > 0}
        activityType={trailData.activityType}
        startTrail={startTrail}
        endTrail={endTrail}
        currentPosition={location}
        time={trailData.time}
        distance={trailData.distance}
        downhill={trailData.downhill}
        elevation={trailData.elevation}
        resetTrail={resetTrail}
        calculateAverageSpeed={calculateAverageSpeed}
      />

      <View style={styles.buttonGroup}>
        <View style={styles.leftButtonContainer}></View>

        <View style={styles.rightButtonContainer}>
          <RecenterButton mapRef={mapRef} location={location} setRegion={setRegion} />
          <Tutorial />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  marker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  rightButtonContainer: {
    alignItems: 'flex-end',
  },
  leftButtonContainer: {
    alignItems: 'flex-start',
  },
  buttonGroup: {
    position: 'absolute',
    bottom: 170,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
});

export default AddTrail;