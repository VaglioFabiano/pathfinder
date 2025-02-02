import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import * as Location from 'expo-location';
import RecenterButton from '@/components/recenterBotton';
import Tutorial from '@/components/Tutorial';
import TrailComponent from '@/components/TrailComponent';
import MapViewDirections from 'react-native-maps-directions';


const GOOGLE_MAPS_APIKEY = 'AIzaSyCU6HZpj6mSlmeb7UZsZNXM2nuyG9hJVos';


const AddTrail = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [region, setRegion] = useState<{ latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number } | null>(null);
  const [refresch, setRefresh] = useState(false);
  const [trailStarted, setTrailStarted] = useState(false);
  const destination = { latitude: 45.464664, longitude: 9.188540 }; // Coordinata di destinazione

  const mapRef = React.useRef<MapView>(null);

  // Stato per la gestione del percorso
  const [trailData, setTrailData] = useState({
    isActive: false,
    isRecap: false,
    time: 0,
    distance: 0,
    downhill: 0,
    elevation: 0,
    positions: [] as { latitude: number; longitude: number }[],
    activityType: '',
  });
  

  const speedInKmPerSecond = 4 / 3600; // Velocità di 4 km/h in km/s
  const intervalDuration = 30; // Intervallo di 30 secondi



  useEffect(() => {
    let generalInterval = null;
    let positionInterval = null;

    if (trailData.isActive && location) {
      // Aggiorna tempo e distanza ogni secondo
      generalInterval = setInterval(() => {
        setTrailData((prevData) => ({
          ...prevData,
          time: prevData.time + 1,
          distance: prevData.distance + speedInKmPerSecond,
          elevation: prevData.elevation + Math.random() * 0.005,
          downhill: prevData.downhill + Math.random() * 0.01,
        }));
      }, 1000);

      // Aggiorna la posizione ogni 30 secondi
      positionInterval = setInterval(() => {
        setTrailData((prevData) => {
          const lastPosition = prevData.positions[prevData.positions.length - 1] || location;
          const newPosition = [
            lastPosition.latitude + Math.random() * 0.0003, // Piccolo spostamento in latitudine
            lastPosition.longitude + Math.random() * 0.0003, // Piccolo spostamento in longitudine
          ];

          setLocation({ latitude: newPosition[0], longitude: newPosition[1] }); // Aggiorna la posizione corrente

          return {
            ...prevData,
            positions: [...prevData.positions, { latitude: newPosition[0], longitude: newPosition[1] }],
          };
        });
      }, intervalDuration * 1000);
    }

    return () => {
      if (generalInterval) clearInterval(generalInterval);
      if (positionInterval) clearInterval(positionInterval);
    };
  }, [trailData.isActive, location]);

  // Funzione per iniziare il percorso
  const startTrail = (position: { latitude: number; longitude: number }, selectedActivity: any) => {
    setTrailData({
      isActive: true,
      isRecap: false,
      time: 0,
      distance: 0,
      downhill: 0,
      elevation: 0,
      positions: [position],
      activityType: selectedActivity,
      
    });
    setTrailStarted(true);
    setLocation(position); // Inizia il percorso con la posizione iniziale
  };

  // Funzione per terminare il percorso
  const endTrail = () => {
    setTrailData((prevData) => ({
      ...prevData,
      isActive: false,
      isRecap: true,
    }));
  };

  const resetTrail = () => {
    setTrailData({
      isActive: false,
      isRecap: false,
      time: 0,
      distance: 0,
      downhill: 0,
      elevation: 0,
      positions: [],
      activityType: '',
    });
    setRefresh((r) => !r);
    setTrailStarted(false);
  };

  const calculateAverageSpeed = () => {
    return trailData.time > 0 ? parseFloat((trailData.distance / (trailData.time / 3600)).toFixed(2)) : 0;
  };

  // Ottenere i permessi e la posizione dell'utente
  useEffect(() => {
    (async () => {
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
  }, [refresch]);

  if (!region || !location) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <MapView showsCompass={false} ref={mapRef} style={styles.map} region={region} onRegionChangeComplete={(region) => setRegion(region)} mapType="terrain" >
        {/* Overlay per mappe topografiche */}
        <UrlTile urlTemplate="http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

        

        {/* Marker per la posizione corrente */}
        {location && (
          <Marker coordinate={location}>
            <View style={styles.marker}>
              <View style={styles.innerCircle} />
            </View>
          </Marker>
        )}
        { trailStarted && <MapViewDirections origin={{latitude: region.latitude, longitude: region.longitude}} destination={destination} apikey={GOOGLE_MAPS_APIKEY} />}
      </MapView>

      {/* Componenti Trail */}
      <TrailComponent
        isActive={trailData.isActive}
        isRecap={trailData.isRecap}
        activityType={trailData.activityType}
        startTrail={startTrail}
        endTrail={endTrail}
        currentPosition={location}
        time={trailData.time}
        distance={trailData.distance}
        downhill={trailData.downhill}
        elevation={trailData.elevation}
        calculateAverageSpeed={calculateAverageSpeed}
        resetTrail={resetTrail}
        positions={trailData.positions}
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
  trailContainer: {
    padding: 20,
  },
});

export default AddTrail;
