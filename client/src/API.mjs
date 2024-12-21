import { Trail, Review } from "../../server/Class.mjs";
const SERVER_URL = "http://localhost:3001";

// Trail Api

const getTrails = async () => {
    const response = await fetch(SERVER_URL + '/api/trails/');
    const trails = await response.json();
    if (response.ok) {
      return trails.map((trail) => new Trail(trail.id, trail.name,null,null,trail.length, trail.duration,null, trail.startpoint,null,null,null,null));
    }
    else {
      throw trails;
    }
}
const getTrailsMoreInfo = async (startpoint) => {
    const response = await fetch(SERVER_URL + '/api/trails/' + startpoint);
    const trails = await response.json();
    if (response.ok) {
      return trails.map((trail) => new Trail(trail.id, trail.name, trail.downhill, trail.difficulty, trail.length, trail.duration, trail.elevation, trail.startpoint, null,trail.endpoint, trail.description, trail.images));
    }
    else {
      throw trails;
    }
}
const getTrail = async (id) => {
    const response = await fetch(SERVER_URL + '/api/trail/' + id);
    const trail = await response.json();
    if (response.ok) {
      return new Trail(trail.id, trail.name, trail.downhill, trail.difficulty, trail.length, trail.duration, trail.elevation, trail.startpoint, trail.trails,trail.endpoint, trail.description, trail.images);
    }
    else {
      throw trail;
    }
}
const saveTrail = async (trail) => {
  const response = await fetch(SERVER_URL + '/api/trail', {
    method: 'POST',
    body: trail 
  });
  if (response.ok) {
    return await response.json();
  }
  else {
    const errMessage = await response.text();
    throw errMessage;
  }
}

// Review Api

const submitReview = async (review) => {
  const response = await fetch(SERVER_URL + '/api/review', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(review)
  });
  if (response.ok) {
    return await response.json();
  }
  else {
    const errMessage = await response.text();
    throw errMessage;
  }
}

const getReviewsByTrail = async (trail_id) => {
  const response = await fetch(SERVER_URL + '/api/review/' + trail_id);
  const reviews = await response.json();
  console.log("Reviews", reviews);
  if (response.ok) {
    return reviews.map((review) => new Review(review.id, review.user_id, review.trail_id, review.rating, review.comment));
  }
  else {
    console.log(reviews);
    throw reviews;
    
  }
}

// User Api

const login = async (credentials) => {
    const response = await fetch(SERVER_URL + '/api/sessions', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(credentials),
      credentials: 'include'
    });
  
    if(response.ok) {
      const user = await response.json();
      return user;
    }
    else {
      const errDetails = await response.text();
      throw errDetails;
    }
}
const getUserInfo = async () => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    credentials: 'include'
  });
  const user = await response.json();
  if (response.ok) {
    return user;
  } else {
    throw user;
  }
}
const logout = async () => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    method: 'DELETE',
    credentials: 'include'
  });
  if (response.ok) 
    return null;
}
const register = async (newUser) => {
  const response = await fetch(SERVER_URL + '/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newUser),
    credentials: 'include'
  });

  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errDetails = await response.text();
    throw errDetails;
  }
};


const API = { login, getUserInfo, logout,register, getTrails, getTrailsMoreInfo, getTrail, saveTrail, submitReview, getReviewsByTrail };
export default API;