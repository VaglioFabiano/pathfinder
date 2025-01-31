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
      <Text style={styles.dropdownButton}>Seleziona un Trail</Text>
    </TouchableOpacity>

    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        {/* Click fuori chiude */}
        <Pressable
          style={styles.backdrop}
          onPress={() => setVisible(false)}
        />
        {/* Bottom Sheet */}
        <View style={styles.bottomSheet}>
          <TouchableOpacity
            style={styles.closeButtonContainer}
            onPress={() => setVisible(false)}
          >
            <Text style={styles.closeButtonText}>Chiudi</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Seleziona un Trail:</Text>
          <FlatList
            data={trails}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.optionText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
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
        backgroundColor: "black",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        height: "60%", // Bottom Sheet altezza
      },
      closeButtonContainer: {
        alignSelf: "flex-end",
      },
      closeButtonText: {
        color: "#FF3B30",
        fontSize: 16,
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
        borderBottomWidth: 1,
        borderColor: "#444",
      },
      optionText: {
        fontSize: 16,
        color: "white",
      },
  });
  
