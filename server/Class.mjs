function Trail(id,name,downhill,difficulty,length,duration,elevation,startpoint,trails,endpoint,description,images){
    this.id = id;
    this.name = name;
    this.downhill = downhill;
    this.difficulty = difficulty;
    this.length = length;
    this.duration = duration;
    this.elevation = elevation;

    this.startpoint = startpoint;
    this.trails = trails;
    this.endpoint = endpoint; 

    this.description = description;
    this.images = images;
}
function Review(id,user_id,trail_id,rating,comment){
    this.id = id;
    this.user_id = user_id;
    this.trail_id = trail_id;
    this.rating = rating;
    this.comment = comment;
}
export {Trail,Review};