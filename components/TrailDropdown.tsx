import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Modal, StyleSheet, Pressable } from "react-native";
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
interface TrailDropdownProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  trails: Trail[];
  onSelect: (trail: Trail) => void;
  setTrail: (trail: Trail[]) => void;
}

const TrailDropdown: React.FC<TrailDropdownProps> = ({visible, setVisible, trails, setTrail, onSelect }) => {
  

  const handleSelect = (trail: Trail) => {
    setVisible(false);
    setTrail([]);
    onSelect(trail);
  };
  useEffect(() => {
    console.log("Modal visibile:", visible);
  }, [visible]);
  
  return (
    <View>
    <TouchableOpacity onPress={() => setVisible(true)}>
      <Text style={styles.dropdownButton}>Select a Trail:</Text>
    </TouchableOpacity>

    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        {/* Click fuori chiude */}
        <Pressable
          style={styles.backdrop}
          onPress={() => setVisible(false)}
        />
        <View style={styles.bottomSheet}>      
          <Text style={styles.title}>Select a trail:</Text>
          <FlatList
            data={trails}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <>
              <TouchableOpacity style={styles.option} onPress={() => handleSelect(item)} >
                <Text style={styles.optionText}>{item.name}</Text>
                <Text style={[styles.optionText,, { padding: 4, borderRadius: 8, backgroundColor: item?.difficulty === 'Beginner' ? '#4986af' : item?.difficulty === 'Intermediate' ? '#af8649' : '#af4953', color: "#fff" }]}>{item.difficulty}</Text>
                <Text style={styles.optionText}><MaterialIcons name="timeline" size={16} color="#fff" />{item.length} km</Text>
                <Text style={styles.optionText}><MaterialIcons name="schedule" size={16} color="#fff" />{item.duration} h</Text>
                <Text style={styles.optionText}>
                    {item.activity === "bike" ? (
                      <MaterialCommunityIcons name="bike" size={16} color="#fff" />
                    ) : item.activity === "hiking" ? (
                      <MaterialCommunityIcons name="hiking" size={16} color="#fff" />
                    ) : (
                      <MaterialCommunityIcons name="walk" size={16} color="#fff" />
                    )}
                  </Text>
              </TouchableOpacity>
              <View style={styles.separator} />
              </>
            )}
          />
          <TouchableOpacity
            style={styles.closeButtonContainer}
            onPress={() => setVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  </View>
  );
};

export default TrailDropdown;
const styles = StyleSheet.create({
    dropdownButton: {
        backgroundColor: "#007AFF",
        color: "white",
        padding: 10,
        borderRadius: 8,
        textAlign: "center",
      },
      modalContainer: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },
      backdrop: {
        flex: 1,
      },
      bottomSheet: {
        backgroundColor: "gray",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        height: "60%", // Bottom Sheet altezza
      },
      closeButtonContainer: {
        alignSelf: "flex-end",
        padding: 10,
        bottom: 20,
      },
      closeButtonText: {
        color: "white",
        fontSize: 16,
        textDecorationLine: "underline",
        fontWeight: "bold",
      },
      title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
        marginBottom: 10,
      },
      option: {
        paddingVertical: 12,
        justifyContent:"space-between",
        flexDirection: "row",
      },
      optionText: {
        fontSize: 16,
        color: "white",
      },
      separator: { height: 1, backgroundColor: 'black', marginVertical: 5, opacity: 0.2, alignItems: 'center', justifyContent: 'center' },

  });
  
