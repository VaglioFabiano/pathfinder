import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface ReviewModalProps {
  reviewModalVisible: boolean;
  reviewText: string;
  setReviewText: (text: string) => void;
  submitReview: (flag: boolean) => void;
  rating: number;
  setRating: (rating: number) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ reviewModalVisible, reviewText, setReviewText, submitReview, rating, setRating }) => {
  const renderStars = (rating: number) => {
    const maxStars = 5;
    return Array.from({ length: maxStars }, (_, index) => (
      <TouchableOpacity key={index} onPress={() => setRating(index + 1)}>
        <MaterialIcons
          name={index < rating ? 'star' : 'star-outline'}
          size={24}
          color="#FFD700" // Gold color for selected stars
        />
      </TouchableOpacity>
    ));
  };

  const handleCancel = () => {
    Alert.alert(
      "Are you sure?",
      "Are you sure you don't want to leave a review?",
      [
        { text: "No", style: "cancel" },
        { text: "Yes",style: 'destructive',  onPress: () => submitReview(false) }
      ]
    );
  };

  return (
    <Modal visible={reviewModalVisible} animationType="fade" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Leave a review</Text>
          <TextInput
            style={styles.input}
            placeholder="Write a review..."
            value={reviewText}
            placeholderTextColor={'white'}  
            onChangeText={setReviewText}
            multiline={true}
          />
          <View style={styles.starSelection}>
            {renderStars(rating)}
          </View>

          <View style={styles.separator} />
          
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#86af49' }]} onPress={() => submitReview(true)}>
              <Text style={styles.buttonText}>Send</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#dc3545' }]} onPress={handleCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  separator: { height: 1, backgroundColor: 'black', marginVertical: 5, opacity: 0.2, alignItems: 'center', justifyContent: 'center' },
  backdrop: { flex: 1 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContainer: {
    backgroundColor: 'rgb(141, 141, 141)',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  starSelection: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgb(160, 160, 160)',
    color: 'white',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ReviewModal;
