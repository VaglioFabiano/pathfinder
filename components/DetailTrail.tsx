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
        console.log(fetchedReviews);
        setReviews(fetchedReviews);
      } catch (error) {
        console.error("Errore durante il recupero delle recensioni:", error);
      }
    };

    if (isVisible) fetchReviews();
  }, [isVisible]);

  const handleAddComment = async () => {
    if (newComment.trim() === '') {
      alert('Insert a comment before sending');
      return;
    }
    const newId = reviews.length > 0 ? reviews[reviews.length - 1].id + 1 : 1;

    const newReview: Review = {
      id:  newId,
      trail_id: selectedTrail.id,
      user_id: Math.floor(Math.random() * 1000), // Mock user ID, da sostituire con l'utente attuale
      rating: newRating,
      comment: newComment,
    };

    console.log(newReview);

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

  const renderstaticStars = (rating: number) => {
    const maxStars = 5;
    return Array.from({ length: maxStars }, (_, index) => (
        <MaterialIcons
          name={index < rating ? 'star' : 'star-outline'}
          size={24}
          color="#FFD700"
        />
      
    ));
  };


  return (
    <Modal visible={isVisible} animationType="slide" transparent={true} onRequestClose={() => closeModal(true)} >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={0} style={styles.modalContainer} >
          <Pressable style={styles.backdrop} onPress={() => closeModal(true)}/>
          <View style={styles.bottomSheet}>
            <View style={styles.separator} />
            <ScrollView contentContainerStyle={styles.scrollView}>
              <Text style={styles.trailName}>{selectedTrail?.name}</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoText}>
                  <MaterialIcons name="timeline" size={16} color="#fff" /> {selectedTrail?.length} km
                </Text>
                <Text style={styles.infoText}>
                  <MaterialIcons name="schedule" size={16} color="#fff" /> {selectedTrail?.duration} h
                </Text>
                <Text style={styles.infoText}>
                  <MaterialIcons name="landscape" size={16} color="#fff" /> {selectedTrail?.elevation} m
                </Text>
                <View style={[styles.difficultyContainer, { backgroundColor: selectedTrail?.difficulty === 'Beginner' ? '#28a745' : selectedTrail?.difficulty === 'Intermediate' ? '#ffc107' : '#dc3545' }]}>
                  <Text style={[styles.difficultyLabel, {color: selectedTrail?.difficulty === 'Intermediate' ? '#000' : '#fff'}]}>{selectedTrail?.difficulty}</Text>
                </View>
              </View>
              
              <View style={styles.separator} />
              
              {/* Descrizione del Trail */}
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionTitle}>Description:</Text>
                <Text style={styles.descriptionText}>{selectedTrail?.description}</Text>
              </View>
              
              <View style={styles.separator} />
              
              {/* Commenti */}
              <View style={styles.commentSection}>
                <Text style={styles.commentTitle}>Comments({reviews.length}):</Text>
                {reviews.length > 0 ? (
                  reviews.map((review: Review) => (
                    <View key={review.id} style={styles.commentContainer}>
                      <Text style={styles.commentText}>
                        <MaterialIcons name="person" size={16} color="#fff" />{" "}
                        User {review.user_id}: {review.comment}
                      </Text>
                      <View style={styles.ratingContainer}>
                        {renderstaticStars(review.rating)}
                      </View>
                    </View>
                  ))) : ( <Text style={styles.noCommentsText}>No comment</Text> )}
              </View>

              {/* Form Aggiunta Commento */}
              <View style={styles.addCommentSection}>
                <Text style={styles.commentTitle}>Submit a comment:</Text>
                <View style={styles.commentForm}>
                  <TextInput style={styles.commentInput} placeholder="Write your comment..." placeholderTextColor="#fff" value={newComment} onChangeText={setNewComment} />
                  <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                    <View style={styles.starSelection}>{renderStars(newRating)}</View>
                    <TouchableOpacity style={styles.submitButton} onPress={handleAddComment}>
                      <Text style={styles.submitButtonText}>Send</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>

            <View>
              <View style={styles.separator} />
                <View style={styles.buttonRow}>
                  <TouchableOpacity style={styles.startButton} onPress={startTrail}>
                    <Text style={styles.buttonText}>Start</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.closeButtonContainer}
                    onPress={() => closeModal(true)}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
          </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  backdrop: { flex: 1 },
  separator: { height: 1, backgroundColor: 'black', marginVertical: 5, opacity: 0.2, alignItems: 'center', justifyContent: 'center' },
  bottomSheet: { backgroundColor: 'gray', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, height: '85%' },
  closeButtonContainer: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5  },
  closeButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 5 , textDecorationLine: 'underline'},
  scrollView: { paddingBottom: 20 },
  trailName: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, marginTop: 10, color: 'white' },
  infoRow: { flexDirection: 'row', justifyContent:"space-between" , flexWrap: 'wrap', marginTop: 10, marginBottom: 10 },
  infoText: { fontSize: 16, marginRight: 10, marginBottom: 5, color: 'white' },
  difficultyContainer: { paddingVertical: 2, paddingHorizontal: 5, borderRadius: 5, marginBottom: 5 },
  difficultyLabel: { fontSize: 16, fontWeight: 'bold'},
  descriptionContainer: { marginBottom: 0,marginTop: 10 },
  descriptionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: 'white' },
  descriptionText: { fontSize: 16, color: '#fff', textAlign: 'justify' },
  commentSection: { marginTop: 10 },
  commentTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: 'white' },
  commentContainer: { marginBottom: 10, padding: 10, backgroundColor: 'rgb(141, 141, 141)', borderRadius: 8 },
  commentText: { color: 'white' },
  ratingContainer: { flexDirection: 'row', marginTop: 5 },
  noCommentsText: { color: '#fff', fontStyle: 'italic' },
  addCommentSection: { marginTop: 20 },
  commentForm: { backgroundColor: '#rgb(141, 141, 141)', padding: 10, borderRadius: 8 },
  commentInput: { backgroundColor: '#rgb(160, 160, 160)', color: 'white', borderRadius: 8, padding: 10, marginBottom: 10 },
  starSelection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  submitButton: { alignSelf: 'flex-end', backgroundColor: '#34495e', paddingVertical: 5, paddingHorizontal: 20, borderRadius: 5 },
  submitButtonText: { color: 'white', fontSize: 16 },
  buttonRow: { flexDirection: 'row', justifyContent: "space-between", marginTop: 45, bottom: 40 },
  startButton: { backgroundColor: '#34495e',padding: 10, borderRadius: 5 },
  buttonText: { color: 'white', fontWeight: 'bold', marginHorizontal: 10, marginVertical: 5, fontSize: 16, },
});

export default TrailInfoModal;
