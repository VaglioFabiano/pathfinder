import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity} from 'react-native';
import MapView, { Marker, UrlTile, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import {  Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import SearchBar from '@/components/Searchbar';
import ReviewModal from '@/components/ReviewModal';



import Popup from '@/components/Popup';
import BottomSheet from '@/components/BottomSheet';

import * as TrailDAO from '@/dao/trailDAO';
import TrailDropdown from '@/components/TrailDropdown';

import TrailInfoModal from '@/components/DetailTrail';
import * as ReviewDAO from '@/dao/reviewDAO';
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

  activity: string;

}
interface Review {
  id: number;
  trail_id: number;
  user_id: number;
  rating: number;
  comment: string;
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


  const [isModalDetailVisible, setIsModalDetailVisible] = useState(false);
  const isFocused = useIsFocused();

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
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
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

  const fetchTrail = async (t: Trail) => {
    try {
      const trail = await TrailDAO.getTrail(t.id);
      setSelectedTrail(trail);
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
    
    console.log(overlappingTrails);
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
    setIsModalDetailVisible(false);
    setSimulatedPosition(selectedTrail ? { latitude: selectedTrail.trail[0][0], longitude: selectedTrail.trail[0][1] } : null);
    setModalVisible(false);
  };

  const endTrail = () => {
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
    let timerId: string | number | NodeJS.Timeout | null | undefined = null;
  
    if (trailActive && selectedTrail) {
      const path = selectedTrail.trail;
      let index = 0;
  
      const speedMetersPerSecond = 10 * 1000 / 3600; 

      const moveToNextPoint = () => {
        if (index < path.length - 1) {
          const currentPosition = path[index];
          const nextPosition = path[index + 1];
  
          // Calcola la distanza tra i due punti
          const distance = calculateDistance(currentPosition, nextPosition);
          const travelTime = (distance / speedMetersPerSecond) * 1000; // Tempo necessario in millisecondi
          

          setSimulatedPosition(nextPosition); // Aggiorna la posizione dell'utente
  
          index++;
  
          // Passa al prossimo punto dopo il tempo calcolato
          timerId = setTimeout(moveToNextPoint, travelTime);
        } else {
          console.log("Raggiunto l'endpoint!");
          endTrail(); 
        }
      };
  
      moveToNextPoint();
  
      return () => clearTimeout(timerId); // Pulizia
    }
  }, [trailActive, selectedTrail]);

  
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


  if (!region) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <MapView showsCompass={false} ref={mapRef} style={styles.map} region={region} onRegionChangeComplete={(region) => setRegion(region)} mapType="terrain" >
        <UrlTile urlTemplate="http://c.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        

        
        {location && (
          <Marker coordinate={simulatedPosition ?? location}>
            <View style={styles.marker}>
              <View style={styles.innerCircle} />
            </View>
          </Marker>
        )}

        {trails.map((trail) => {
            const difficultyColor =
            trail.difficulty === 'Beginner' ? '#28a745' :
            trail.difficulty === 'Intermediate' ? '#ffc107' :
            '#dc3545';
            
            let activityIcon;
            switch (trail.activity) {
              case 'walk':
                activityIcon = <MaterialCommunityIcons name="walk" size={24} color={difficultyColor=="#ffc107" ? "black": "white"} />;
                break; 
              case 'hiking':
                activityIcon = <MaterialCommunityIcons name="hiking" size={24} color={difficultyColor=="#ffc107" ? "black": "white"}  />;
                break;
              default:
                activityIcon = <MaterialCommunityIcons name="bike" size={24} color={difficultyColor=="#ffc107" ? "black": "white"}  />;
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
              selectedTrail.difficulty === 'Beginner' ? '#28a745' :
              selectedTrail.difficulty === 'Intermediate' ? '#ffc107' :
              '#dc3545'
            }
            strokeWidth={3}
          />
        )}

      </MapView>
      
      <SearchBar mapRef={mapRef} />
      
      
      {/* Modal per inserire la review */}
      {reviewModalVisible && <ReviewModal reviewModalVisible={reviewModalVisible} reviewText={reviewText} setReviewText={setReviewText} submitReview={submitReview} rating={rating} setRating={setRating} />}


      {isModalDetailVisible && <TrailInfoModal isVisible={isModalDetailVisible} closeModal={closeModal} selectedTrail={selectedTrail} startTrail={startTrail}/>}

      {/* Bottom sheet modal */}
      {modalVisible && ( <Popup selectedTrail={selectedTrail} startTrail={startTrail} closeModal={closeModal} setIsModalDetailVisible={setIsModalDetailVisible}/> )}

      {!modalVisible && ( <BottomSheet endTrail={endTrail} trailActive={trailActive} mapRef={mapRef} location={location} setRegion={setRegion} />)} 
      
      {/* Modal per la selezione del trail */}
      {trailOptionsVisible && visibileOptions && <TrailDropdown visible={visibileOptions}  setVisible={setVisibleOptions} trails={trailOptionsVisible} setTrail={setTrailOptionsVisible} onSelect={fetchTrail} />}
    </View>
  );
};



const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

  markerIcon: {
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
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