import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated} from 'react-native';
import MapView, { Marker, UrlTile, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import {  Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import SearchBar from '@/components/Searchbar';
import ReviewModal from '@/components/ReviewModal';



import Popup from '@/components/Popup';
import BottomSheet from '@/components/BottomSheet';

import * as TrailDAO from '@/dao/trailDAO';
import * as WarningDAO from '@/dao/warningDAO';
import * as ReviewDAO from '@/dao/reviewDAO';

import TrailDropdown from '@/components/TrailDropdown';

import TrailInfoModal from '@/components/DetailTrail';
import WarningAlert from '@/components/WarningAlert';
import { useIsFocused } from '@react-navigation/native';



interface Trail {
  id: number;
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
  warning: [Warning];
  activity: string;

}
interface Review {
  id: number;
  trail_id: number;
  user_id: number;
  rating: number;
  comment: string;
}
interface Warning {  
  trail_id: number;
  position: [number, number];
  description: string;
}
const MapWithTopoMap = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [region, setRegion] = useState<{ latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number } | null>(null);
  const [selectedTrail, setSelectedTrail] = useState<Trail | null>(null);
  const [trailActive, setTrailActive] = useState(false);
  const [simulatedPosition, setSimulatedPosition] = useState<{ latitude: number; longitude: number } | null>(null);
  const mapRef = useRef<MapView>(null);
  const [refresh, setRefresh] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);

  const [trails, setTrails] = useState<Trail[]>([]);
  
  const [trailOptionsVisible, setTrailOptionsVisible] = useState<Trail[]>([]);
  const [visibileOptions, setVisibleOptions] = useState(false);

  const [heading, setHeading] = useState(0); // Direction in degrees for the marker rotation
  const [isPaused, setIsPaused] = useState(true);
  const [isModalDetailVisible, setIsModalDetailVisible] = useState(false);

  const [trailData, setTrailData] = useState({
    time: 0,
    distance: 0,
    downhill: 0,
    elevation: 0,
    currentPosition: [0, 0],
  });
  const isFocused = useIsFocused();
  const [warningModalVisible, setWarningModalVisible] = useState(false);
  const [currentWarningText, setCurrentWarningText] = useState('');
  

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});

      if (currentLocation)
      {
        mapRef.current && mapRef.current.animateToRegion(
          {
             latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude, 
             latitudeDelta: 0.01, 
             longitudeDelta: 0.01 
            }, 1000);

      }
      setLocation(currentLocation.coords);
      


      setRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.004,
        longitudeDelta: 0.004,
      });
     
      
    })();
  }, [refresh]);
  useEffect(() => {
    const fetchTrails = async () => {
      try {
        const trails = await TrailDAO.getTrails();
        setTrails(trails);
      } catch (error) {
        console.error("Errore durante il recupero dei trails:", error);
      }
    };

    fetchTrails();
  }, [isFocused]);

 
  const handleWarningPress = (text: string) => {
    setCurrentWarningText(text);
    setWarningModalVisible(true);
  };
  const handleWarningClose = () => {
    setWarningModalVisible(false);
    setCurrentWarningText('');
  }

  const fetchTrail = async (t: Trail) => {
    try {
      const trail = await TrailDAO.getTrail(t.id);
      setSelectedTrail(trail);
      console.log(trail.warning);
      setModalVisible(true);
    } catch (error) {
      console.error("Errore durante il recupero del trail:", error);
    }
  };
  const handleMarkerPress = (t: Trail) => {
    
    const tolerance = 0.0001;
    const overlappingTrails = trails.filter((trail) => 
      Math.abs(trail.startpoint.latitude - t.startpoint.latitude) <= tolerance &&
      Math.abs(trail.startpoint.longitude - t.startpoint.longitude) <= tolerance
    );
    
    if (overlappingTrails.length > 1) {
      showTrailOptions(overlappingTrails);
    } else {
      fetchTrail(t);
    }
  };
  const showTrailOptions = (overlappingTrails: Trail[]) => {
    setVisibleOptions(true);
    setTrailOptionsVisible(overlappingTrails);
  };
  const startTrail = () => {
    setTrailActive(true);
    setIsPaused(false);
    setIsModalDetailVisible(false);
    setSimulatedPosition(selectedTrail ? { latitude: selectedTrail.trail[0][0], longitude: selectedTrail.trail[0][1] } : null);
    setModalVisible(false);
  };
  const endTrail = () => {
    setTrailData({
      time: 0,
      distance: 0,
      downhill: 0,
      elevation: 0,
      currentPosition: [0, 0],
    });
    setTrailActive(false);
    setHeading(0);
    setReviewModalVisible(true);
  };
  const submitReview = async (flag:boolean) => {
    if (flag){
      if (reviewText.trim() === '') {
        alert('Inserisci un commento e seleziona una valutazione.');
        return;
      }
      const newReview: Review = {
        trail_id: selectedTrail?.id ?? 0,
        user_id: 1,
        rating: rating,
        comment: reviewText,
        id: 0
      };
      await ReviewDAO.addReview(newReview);
    }
    setReviewModalVisible(false);
    setRating(0);
    setReviewText(""); // Resetta il campo della recensione
    setTrailActive(false);
    setSelectedTrail(null);
    setSimulatedPosition(null);
    setRefresh((r) => !r);
  };
  const closeModal = (flag:boolean) => {
    setModalVisible(false);
    if (flag){
      setIsModalDetailVisible(false);
      setTrailActive(false);
      setSelectedTrail(null);
      setSimulatedPosition(null);
    }
  };
  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;
  
    if (!isPaused && trailActive && selectedTrail) {
      const path = selectedTrail.trail;
      let index = 0;
      let accumulatedDistance = 0;
  
      const speedMetersPerSecond = 10 * 1000 / 3600;
  
      const moveToNextPoint = () => {
        if (isPaused) return; // Blocca il movimento se in pausa
  
        if (index < path.length - 1) {
          const currentPosition = path[index];
          const nextPosition = path[index + 1];
  
          const totalDistance = calculateDistance(currentPosition, nextPosition);
  
          // Calcola la direzione tra i punti
          const direction = calculateHeading(currentPosition, nextPosition);
          setHeading(direction);
  
          // Determina quanto possiamo percorrere in questo aggiornamento
          const distanceToCover = speedMetersPerSecond;
  
          // Verifica se superiamo il punto successivo
          accumulatedDistance += distanceToCover;
  
          let newPosition = currentPosition;
          let nextIndex = index;
  
          if (accumulatedDistance >= totalDistance) {
            accumulatedDistance -= totalDistance;
            newPosition = nextPosition;
            nextIndex++;
          } else {
            const fraction = accumulatedDistance / totalDistance;
            newPosition = interpolatePosition(currentPosition, nextPosition, fraction);
          }
  
          setSimulatedPosition(newPosition);
  
          setTrailData((prevData) => ({
            ...prevData,
            time: prevData.time + 1,
            distance: prevData.distance + distanceToCover / 1000,
            downhill: prevData.downhill + (Math.random() * 0.005),
            elevation: prevData.elevation + (Math.random() * 0.01),
            currentPosition: newPosition,
          }));
  
          index = nextIndex;
  
          // Continua il ciclo ogni secondo
          timerId = setTimeout(moveToNextPoint, 1000);
        } else {
          console.log("Raggiunto l'endpoint!");
          setTrailActive(false);
          endTrail();
        }
      };
  
      moveToNextPoint();
  
      return () => {
        if (timerId) clearTimeout(timerId);
      };
    }
  }, [trailActive, selectedTrail, isPaused]);

  const findNearestTrail = (currentLocation: { latitude: number; longitude: number }) => {
    if (!currentLocation || trails.length === 0) return null;
  
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
    const R = 6371e3; // Raggio della Terra in metri
  
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const deltaLat = toRadians(lat2 - lat1);
      const deltaLon = toRadians(lon2 - lon1);
      const a =
        Math.sin(deltaLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(deltaLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };
  
    let nearestTrail = trails[0];
    let shortestDistance = calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      trails[0].startpoint.latitude,
      trails[0].startpoint.longitude
    );
  
    trails.forEach((trail) => {
      const distance = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        trail.startpoint.latitude,
        trail.startpoint.longitude
      );
  
      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestTrail = trail;
      }
    });
  
    return nearestTrail;
  };
  

  const pauseTrail = () => {  
    setIsPaused(true);
  };
  const resumeTrail = () => {
    setIsPaused(false);
  };
  const submitWarning= async (warningText: string, position:{ latitude: number; longitude: number }) => {
    const newWarning: Warning = {
      trail_id: selectedTrail?.id ?? 0,
      position: [position.latitude, position.longitude],
      description: warningText,
    };

    await WarningDAO.addWarning(newWarning);
  };
  const interpolatePosition = (start, end, fraction) => {
    return {
      latitude: start.latitude + (end.latitude - start.latitude) * fraction,
      longitude: start.longitude + (end.longitude - start.longitude) * fraction,
    };
  };
  const calculateAverageSpeed = () => {
    return trailData.time > 0 ? parseFloat((trailData.distance / (trailData.time / 3600)).toFixed(2)) : 0;
  };
  const calculateDistance = (pointA: { latitude: any; longitude: any; }, pointB: { latitude: any; longitude: any; }) => {
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
    const R = 6371e3;
    const lat1 = toRadians(pointA.latitude);
    const lon1 = toRadians(pointA.longitude);
    const lat2 = toRadians(pointB.latitude);
    const lon2 = toRadians(pointB.longitude);
    const deltaLat = lat2 - lat1;
    const deltaLon = lon2 - lon1;

    const a = Math.sin(deltaLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
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
  if (!region) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <MapView showsCompass={false} ref={mapRef} style={styles.map} region={region} onRegionChangeComplete={(region) => setRegion(region)} mapType="terrain" >
        <UrlTile urlTemplate="http://c.tile.openstreetmap.org/{z}/{x}/{y}.png" />        
        {location && (
          <Marker coordinate={simulatedPosition ?? location}>
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
        {!trailActive && trails.map((trail) => {
            const difficultyColor =
            trail.difficulty === 'Beginner' ? '#4986af' :
            trail.difficulty === 'Intermediate' ? '#af8649' :
            '#af4953';
            
            let activityIcon;
            switch (trail.activity) {
              case 'walk':
                activityIcon = <MaterialCommunityIcons name="walk" size={30} color={"white"} />;
                break; 
              case 'hiking':
                activityIcon = <MaterialCommunityIcons name="hiking" size={30} color={"white"}  />;
                break;
              default:
                activityIcon = <MaterialCommunityIcons name="bike" size={30} color={"white"}  />;
                break;
            }

            return (
              <Marker key={trail.id} coordinate={trail.startpoint} flat={true} onPress={() => handleMarkerPress(trail)}>
                <View style={[styles.markerIcon, { backgroundColor: difficultyColor }]}>{activityIcon}</View>
              </Marker>
            );
        })}
        {selectedTrail && (
          <Polyline
            coordinates={selectedTrail.trail}
            strokeColor={
              selectedTrail.difficulty === 'Beginner' ? '#4986af' :
              selectedTrail.difficulty === 'Intermediate' ? '#af8649' :
              '#af4953'
            }
            strokeWidth={3}
          />
        )}
        {selectedTrail && selectedTrail.warning.map((warning:any,index:number) => (
          <Marker key={index} coordinate={warning.position} flat={true} onPress={() => {handleWarningPress(warning.description)}} >
            <View style={styles.warningMarker}>
              <MaterialCommunityIcons name="alert" size={20} color="#f4c542" />
            </View>
          </Marker>
        ))}
      </MapView>
      
      <SearchBar mapRef={mapRef} />
      
      {/* Modal per i warning */}
      <WarningAlert visible={warningModalVisible} warningText={currentWarningText} onClose={handleWarningClose} />

      {/* Modal per inserire la review */}
      {reviewModalVisible && <ReviewModal reviewModalVisible={reviewModalVisible} reviewText={reviewText} setReviewText={setReviewText} submitReview={submitReview} rating={rating} setRating={setRating} />}

      {isModalDetailVisible && <TrailInfoModal isVisible={isModalDetailVisible} closeModal={closeModal} selectedTrail={selectedTrail} startTrail={startTrail}/>}

      {/* Bottom sheet modal */}
      {modalVisible && ( <Popup selectedTrail={selectedTrail} startTrail={startTrail} closeModal={closeModal} setIsModalDetailVisible={setIsModalDetailVisible}/> )}

      {!modalVisible && ( <BottomSheet setSelectedTrail={setSelectedTrail} findNearestTrail={findNearestTrail} submitWarning={submitWarning} isPaused={isPaused} trailData={trailData} endTrail={endTrail} trailActive={trailActive} mapRef={mapRef} location={simulatedPosition ?? location} setRegion={setRegion} calculateAverageSpeed={calculateAverageSpeed} pauseTrail={pauseTrail} resumeTrail={resumeTrail} />)} 
      
      {/* Modal per la selezione del trail */}
      {trailOptionsVisible && visibileOptions && <TrailDropdown visible={visibileOptions}  setVisible={setVisibleOptions} trails={trailOptionsVisible} setTrail={setTrailOptionsVisible} onSelect={fetchTrail} />}
    </View>
  );
};



const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  warningMarker: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    borderRadius: 10,
    backgroundColor: '#fff',
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
});


export default MapWithTopoMap;