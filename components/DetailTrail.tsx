import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView, Pressable, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as ReviewDAO from '@/dao/reviewDAO';

interface PopupProps {
  selectedTrail: {
    id: number;
    name: string;
    downhill: number;
    difficulty: string;
    length: number;
    duration: number;
    elevation: number;
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
  };
  startTrail: () => void;
  closeModal: (flag: boolean) => void;
  isVisible: boolean;
}

interface Review {
  id: number;
  trail_id: number;
  user_id: number;
  rating: number;
  comment: string;
}

const TrailInfoModal: React.FC<PopupProps> = ({ selectedTrail, startTrail, closeModal, isVisible }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [newRating, setNewRating] = useState<number>(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const fetchedReviews = await ReviewDAO.getReviews(selectedTrail.id);
        setReviews(fetchedReviews);
      } catch (error) {
        console.error("Errore durante il recupero delle recensioni:", error);
      }
    };

    if (isVisible) fetchReviews();
  }, [isVisible]);

  const handleAddComment = async () => {
    if (newComment.trim() === '' || newRating === 0) {
      alert('Inserisci un commento e seleziona una valutazione.');
      return;
    }

    const newReview: Review = {
      id: reviews.length + 1,
      trail_id: selectedTrail.id,
      user_id: Math.floor(Math.random() * 1000), // Mock user ID, da sostituire con l'utente attuale
      rating: newRating,
      comment: newComment,
    };

    try {
      await ReviewDAO.addReview(newReview);
      setReviews([...reviews, newReview]);
      setNewComment('');
      setNewRating(0);
    } catch (error) {
      console.error('Errore durante l\'aggiunta della recensione:', error);
    }
  };

  const renderStars = (rating: number) => {
    const maxStars = 5;
    return Array.from({ length: maxStars }, (_, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => setNewRating(index + 1)}
      >
        <MaterialIcons
          name={index < rating ? 'star' : 'star-outline'}
          size={24}
          color="#FFD700"
        />
      </TouchableOpacity>
    ));
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => closeModal(true)}
    >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
          style={styles.modalContainer}
        >
        <Pressable
          style={styles.backdrop}
          onPress={() => closeModal(true)}
        />
        <View style={styles.bottomSheet}>
          <TouchableOpacity
            style={styles.closeButtonContainer}
            onPress={() => closeModal(true)}
          >
            <Text style={styles.closeButtonText}>Chiudi</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
          <ScrollView contentContainerStyle={styles.scrollView}>
            <Text style={styles.trailName}>{selectedTrail?.name}</Text>

            {/* Informazioni principali */}
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>
                <MaterialIcons name="timeline" size={16} color="#666" /> {selectedTrail?.length} km
              </Text>
              <Text style={styles.infoText}>
                <MaterialIcons name="schedule" size={16} color="#666" /> {selectedTrail?.duration} ore
              </Text>
              <Text style={styles.infoText}>
                <MaterialIcons name="landscape" size={16} color="#666" /> {selectedTrail?.elevation} m
              </Text>
              <View style={styles.difficultyContainer}>
                <Text style={styles.difficultyLabel}>{selectedTrail?.difficulty}</Text>
              </View>
            </View>
            <View style={styles.separator} />

            {/* Descrizione del Trail */}
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>Descrizione</Text>
              <Text style={styles.descriptionText}>{selectedTrail?.description}</Text>
            </View>
            <View style={styles.separator} />

            {/* Commenti */}
            <View style={styles.commentSection}>
              <Text style={styles.commentTitle}>Comments({reviews.length})</Text>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <View key={review.id} style={styles.commentContainer}>
                    <Text style={styles.commentText}>
                      <MaterialIcons name="person" size={16} color="#888" />{" "}
                      Utente {review.user_id}: {review.comment}
                    </Text>
                    <View style={styles.ratingContainer}>
                      {renderStars(review.rating)}
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.noCommentsText}>Nessun commento disponibile.</Text>
              )}
            </View>

            {/* Form Aggiunta Commento */}
            <View style={styles.addCommentSection}>
              <Text style={styles.commentTitle}>Submit a comment</Text>
              <View style={styles.commentForm}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Write your comment..."
                  placeholderTextColor="#888"
                  value={newComment}
                  onChangeText={setNewComment}
                />
                <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                  <View style={styles.starSelection}>
                    {renderStars(newRating)}
                  </View>
                  <TouchableOpacity style={styles.submitButton} onPress={handleAddComment}>
                    <Text style={styles.submitButtonText}>Send</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Pulsante Inizia */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.startButton} onPress={startTrail}>
              <Text style={styles.buttonText}>Inizia</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  backdrop: { flex: 1 },
  separator: { height: 1, backgroundColor: 'gray', marginVertical: 10 },
  bottomSheet: { backgroundColor: 'black', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, height: '85%' },
  closeButtonContainer: { alignSelf: 'flex-end' },
  closeButtonText: { color: '#FF3B30', fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  scrollView: { paddingBottom: 20 },
  trailName: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, marginTop: 10, color: 'white' },
  infoRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  infoText: { fontSize: 16, marginRight: 10, marginBottom: 5, color: 'white' },
  difficultyContainer: { backgroundColor: '#f5f5f5', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 5, marginBottom: 5 },
  difficultyLabel: { fontSize: 16, fontWeight: 'bold', color: '#444' },
  descriptionContainer: { marginBottom: 20 },
  descriptionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: 'white' },
  descriptionText: { fontSize: 16, color: '#ddd', textAlign: 'justify' },
  commentSection: { marginTop: 10 },
  commentTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: 'white' },
  commentContainer: { marginBottom: 10, padding: 10, backgroundColor: '#1c1c1c', borderRadius: 8 },
  commentText: { color: 'white' },
  ratingContainer: { flexDirection: 'row', marginTop: 5 },
  noCommentsText: { color: '#888', fontStyle: 'italic' },
  addCommentSection: { marginTop: 20 },
  commentForm: { backgroundColor: '#1c1c1c', padding: 10, borderRadius: 8 },
  commentInput: { backgroundColor: '#333', color: 'white', borderRadius: 8, padding: 10, marginBottom: 10 },
  starSelection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  submitButton: { alignSelf: 'flex-end', backgroundColor: '#4CAF50', paddingVertical: 5, paddingHorizontal: 20, borderRadius: 5 },
  submitButtonText: { color: 'white', fontSize: 16 },
  buttonRow: { flexDirection: 'row', justifyContent: "flex-start", marginTop: 50, backgroundColor: 'black', bottom: 40 },
  startButton: { backgroundColor: '#4CAF50', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 },
  buttonText: { color: 'white', fontSize: 16 },
});

export default TrailInfoModal;
