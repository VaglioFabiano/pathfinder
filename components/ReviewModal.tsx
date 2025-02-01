import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface ReviewModalProps {
  reviewModalVisible: boolean;
  reviewText: string;
  setReviewText: (text: string) => void;
  submitReview: () => void;
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
          color="#FFD700" // Colore dorato per le stelle selezionate
        />
      </TouchableOpacity>
    ));
  };

  return (
    <Modal visible={reviewModalVisible} animationType="fade" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Lascia una recensione</Text>

          {/* Renderizza le stelle per la valutazione */}
          <View style={styles.starSelection}>
            {renderStars(rating)}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Scrivi la tua recensione qui..."
            value={reviewText}
            onChangeText={setReviewText}
            multiline={true}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={submitReview}>
              <Text style={styles.buttonText}>Invia</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => submitReview()}
            >
              <Text style={styles.buttonText}>Annulla</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'black',
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
    backgroundColor: '#333',
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
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ReviewModal;
