// src/services/tripsService.js
import { db } from '../service/firebaseConfig'; // Assuming firebaseConfig is correctly set up or bypassed
import { collection, addDoc, getDocs, query, where, Timestamp, orderBy, doc, deleteDoc, updateDoc } from 'firebase/firestore'; // Added Timestamp, orderBy, doc, deleteDoc, updateDoc

export const tripsService = {
  /**
   * Creates a new trip in Firestore.
   * @param {object} tripDetails - Object containing destination, tripData (itinerary text), and answers (days, budget, people).
   * @param {string} userId - The Firebase Auth user ID.
   * @returns {Promise<object>} The newly created trip object with its Firestore ID.
   */
  async createTrip(tripDetails, userId) {
    if (!userId) {
      console.error("User ID is required to create a trip.");
      throw new Error("User not authenticated.");
    }
    if (!db) { // Check if db is available (might be null due to bypass)
        console.warn("Firestore (db) is not available. Trip creation will be skipped.");
        // Simulate trip creation for UI consistency if db is mocked/null
        return { 
            id: `mock_${Date.now()}`, 
            ...tripDetails, 
            userId, 
            createdAt: new Date().toISOString(), // Use ISO string for consistency
            // Ensure answers object is correctly structured
            days: tripDetails.answers.days,
            budget: tripDetails.answers.budget,
            people: tripDetails.answers.people,
        };
    }
    try {
      const tripsRef = collection(db, 'trips');
      const newTripData = {
        userId,
        destination: tripDetails.destination,
        itinerary: tripDetails.tripData, // Raw AI-generated text
        days: parseInt(tripDetails.answers.days, 10) || 0,
        budget: parseInt(tripDetails.answers.budget, 10) || 0,
        people: parseInt(tripDetails.answers.people, 10) || 0,
        createdAt: Timestamp.fromDate(new Date()), // Use Firestore Timestamp for proper ordering/querying
        updatedAt: Timestamp.fromDate(new Date()),
      };
      const docRef = await addDoc(tripsRef, newTripData);
      return { id: docRef.id, ...newTripData, createdAt: newTripData.createdAt.toDate().toISOString() }; // Convert Timestamp to ISO string for consistency in return
    } catch (error) {
      console.error('Error creating trip in Firestore:', error);
      throw new Error("Failed to save your trip. Please try again.");
    }
  },

  /**
   * Fetches all trips for a given user ID, ordered by creation date (newest first).
   * @param {string} userId - The Firebase Auth user ID.
   * @returns {Promise<Array<object>>} An array of trip objects.
   */
  async getUserTrips(userId) {
    if (!userId) {
      console.error("User ID is required to fetch trips.");
      return []; // Or throw new Error("User not authenticated.");
    }
     if (!db) {
        console.warn("Firestore (db) is not available. Cannot fetch user trips.");
        return [];
    }
    try {
      const tripsRef = collection(db, 'trips');
      const q = query(tripsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data(),
        // Ensure createdAt is a consistent format (e.g., ISO string) if needed by UI
        // Firestore Timestamps have toDate() method
        createdAt: docSnap.data().createdAt?.toDate ? docSnap.data().createdAt.toDate().toISOString() : new Date().toISOString(),
        updatedAt: docSnap.data().updatedAt?.toDate ? docSnap.data().updatedAt.toDate().toISOString() : new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Error fetching user trips from Firestore:', error);
      throw new Error("Failed to load your saved trips. Please try again.");
    }
  },

  /**
   * Deletes a specific trip from Firestore.
   * @param {string} tripId - The ID of the trip to delete.
   * @returns {Promise<void>}
   */
  async deleteTrip(tripId) {
    if (!tripId) {
        console.error("Trip ID is required to delete a trip.");
        throw new Error("Trip ID missing.");
    }
    if (!db) {
        console.warn("Firestore (db) is not available. Trip deletion will be skipped.");
        return;
    }
    try {
        const tripDocRef = doc(db, 'trips', tripId);
        await deleteDoc(tripDocRef);
        console.log(`Trip ${tripId} successfully deleted from Firestore.`);
    } catch (error) {
        console.error(`Error deleting trip ${tripId} from Firestore:`, error);
        throw new Error("Failed to delete the trip. Please try again.");
    }
  },

  /**
   * Updates a specific trip in Firestore.
   * @param {string} tripId - The ID of the trip to update.
   * @param {object} updatedData - An object containing the fields to update.
   * @returns {Promise<void>}
   */
  async updateTrip(tripId, updatedData) {
    if (!tripId) {
        console.error("Trip ID is required to update a trip.");
        throw new Error("Trip ID missing.");
    }
    if (!db) {
        console.warn("Firestore (db) is not available. Trip update will be skipped.");
        return;
    }
    try {
        const tripDocRef = doc(db, 'trips', tripId);
        await updateDoc(tripDocRef, {
            ...updatedData,
            updatedAt: Timestamp.fromDate(new Date()) // Always update the updatedAt timestamp
        });
        console.log(`Trip ${tripId} successfully updated in Firestore.`);
    } catch (error) {
        console.error(`Error updating trip ${tripId} in Firestore:`, error);
        throw new Error("Failed to update the trip. Please try again.");
    }
  }
};
