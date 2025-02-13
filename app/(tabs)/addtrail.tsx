import React, { useState, useEffect, useRef } from 'react';
import { Alert, Animated, StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline, UrlTile } from 'react-native-maps';
import * as Location from 'expo-location';
import RecenterButton from '@/components/recenterBotton';
import Tutorial from '@/components/TutorialAdd';
import TrailComponent from '@/components/TrailComponent';
import polyline from '@mapbox/polyline';

const GOOGLE_MAPS_APIKEY = 'AIzaSyDBHi_Rgdp1Va1KgknCyzJ4prT-hNTdevQ';

interface Trail {
  name: string;
  downhill: number;
  difficulty: string;
  length: number;
  duration: number;
  elevation : number;
  
  startpoint: [number, number];
  trail: [[number, number]];
  endpoint: [number, number];

  description: string;
  image: string;

  city: string;
  region: string;
  state: string;
  province: string;

  activity: string;

}
const AddTrail = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [region, setRegion] = useState<{ latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number } | null>(null);
  const [trailStarted, setTrailStarted] = useState(false);
  const [pathCoordinates, setPathCoordinates] = useState<{ latitude: number; longitude: number }[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [heading, setHeading] = useState(0); // Direction in degrees for the marker rotation
  const [isPaused, setIsPaused] = useState(true);

  const mapRef = useRef<MapView>(null);

  const [trailData, setTrailData] = useState({
    name: '',
    difficulty: '',    
    description: '',
    image: '',
    city: '',
    region: '',
    state: '',
    province: '',
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

  const pauseTrail = () => {  
    setIsPaused(true);
  };
  const resumeTrail = () => {
    setIsPaused(false);
  };


  const startTrail = async (position: { latitude: number; longitude: number }, selectedActivity: any) => {
    const currentInfo = await Location.reverseGeocodeAsync(position);  
    const startpoint = { latitude: position.latitude, longitude: position.longitude };
    setIsPaused(false);
    setTrailData({
      isActive: true,
      time: 0,
      distance: 0,
      downhill: 0,
      elevation: 0,
      positions: [startpoint],
      activityType: selectedActivity,
      name: '',
      difficulty: '',
      description: '',
      image: '',
      city: currentInfo[0].city ? currentInfo[0].city : '', 
      region: currentInfo[0].region ? currentInfo[0].region : '',
      state: currentInfo[0].country ? currentInfo[0].country : '',
      province: currentInfo[0].subregion ? currentInfo[0].subregion : '',  
    });
    setTrailStarted(true);
    setLocation(position);
    fetchRoute(position, { latitude: 45.464664, longitude: 9.188540 });
  };

  const endTrail = async () => {
    Alert.alert('Are you sure?', 'Do you want to end the trail?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', style: 'destructive', onPress: () =>{setTrailData((prevData) => ({
        ...prevData,
  
        isActive: false,
      }));
      setTrailStarted(false);} },
    ]);
    
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
      name: '',
      difficulty: '',    
      description: '',
      image: '',
      city: '',
      region: '',
      state: '',
      province: '',
    });
    setRefresh((prev) => !prev);
    setTrailStarted(false);
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
      }
    } catch (error) {
      console.error('Errore nel recupero del percorso:', error);
    }
  };

  useEffect(() => {
    let timerId = null;
  
    if (trailData.isActive && pathCoordinates.length > 0) {
      let index = 0;
      let accumulatedDistance = 0;
  
      const speedMetersPerSecond = 70 * 1000 / 3600; // Speed in meters per second
  
      const moveToNextPoint = async () => {
        if (isPaused) return; // Block movement if paused
  
        if (index < pathCoordinates.length - 1) {
          const currentPosition = pathCoordinates[index];
          const nextPosition = pathCoordinates[index + 1];
          // Calculate the total distance between the current and next points
          const totalDistance = haversineDistance(currentPosition, nextPosition);
  
          // Calculate the heading between points
          const direction = calculateHeading(currentPosition, nextPosition);
          setHeading(direction);
  
          // Determine the distance to cover in the current second
          const distanceToCover = speedMetersPerSecond;
          accumulatedDistance += distanceToCover;
  
          let newPosition = currentPosition;
          let nextIndex = index;
  
          // Move to the next point if the accumulated distance exceeds the segment distance
          if (accumulatedDistance >= totalDistance) {
            accumulatedDistance -= totalDistance;
            newPosition = nextPosition;
            nextIndex++;
          } else {
            // Interpolate position within the current segment
            const fraction = accumulatedDistance / totalDistance;
            newPosition = interpolatePosition(currentPosition, nextPosition, fraction);
          }
  
          // Update the elevation and downhill values
          setLocation(newPosition); // Update the user's position
  
          setTrailData((prevData) => ({
            ...prevData,
            time: prevData.time + 1, // Increment time by one second per update
            distance: prevData.distance + distanceToCover / 1000,
            downhill: prevData.downhill + (Math.random() * 0.005),
            elevation: prevData.elevation + (Math.random() * 0.01),
            positions: [...prevData.positions, newPosition],
          }));
  
          index = nextIndex;
  
          // Schedule next update every second
          timerId = setTimeout(moveToNextPoint, 1000);
        } else {
          setTrailStarted(false);
          setTrailData((prevData) => ({
            ...prevData,
            isActive: false,
          }));
        }
      };
  
      moveToNextPoint();
  
      return () => clearTimeout(timerId); // Cleanup
    }
  }, [trailData.isActive, pathCoordinates, isPaused]);
  
  const haversineDistance = (coord1, coord2) => {
    const R = 6371000; // Radius of Earth in meters
    const lat1 = (coord1.latitude * Math.PI) / 180;
    const lat2 = (coord2.latitude * Math.PI) / 180;
    const deltaLat = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
    const deltaLon = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;
  
    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return R * c; // Distance in meters
  };
  const interpolatePosition = (start, end, fraction) => {
    return {
      latitude: start.latitude + (end.latitude - start.latitude) * fraction,
      longitude: start.longitude + (end.longitude - start.longitude) * fraction,
    };
  };

  const calculateHeading = (pointA: { latitude: number; longitude: number }, pointB: { latitude: number; longitude: number }) => {
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
    const toDegrees = (radians: number) => (radians * 180) / Math.PI;

    const deltaLon = toRadians(pointB.longitude - pointA.longitude);
    const lat1 = toRadians(pointA.latitude);
    const lat2 = toRadians(pointB.latitude);

    const y = Math.sin(deltaLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);
    const initialBearing = toDegrees(Math.atan2(y, x));

    return (initialBearing + 360) % 360;
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
            <Animated.View style={{ transform: [{ rotate: `${heading}deg` }] }}>
              <View style={styles.markerContainer}>
                <View style={styles.markerArrow} />
                <View style={styles.marker}>
                  <View style={styles.innerCircle} />
                </View>
              </View>
            </Animated.View>
          </Marker>
        )}

      </MapView>

      {/* Componenti Trail */}
      <TrailComponent
        isPaused={isPaused}
        isRecap={!trailData.isActive && trailData.time > 0}
        startTrail={startTrail}
        endTrail={endTrail}
        currentPosition={location}
        trailData={trailData}
        resetTrail={resetTrail}
        pauseTrail={pauseTrail}
        resumeTrail={resumeTrail}
        calculateAverageSpeed={calculateAverageSpeed}
      />

      <View style={[styles.buttonGroup, { bottom: trailData.isActive ? 170 : 120 }]}>
        <View style={styles.leftButtonContainer}/>
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
  markerIcon: {
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerContainer: {
    alignItems: 'center',
  },
  markerArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#3498db',
    marginBottom: -2,
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
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },
});

export default AddTrail;