//Model for Lesson objects
export default class Lesson {
  constructor(
    id,
    subject,
    location,
    price,
    spaces,
    image,
    description,
    rating
  ) {
    this.id = id;
    this.subject = subject;
    this.location = location;
    this.price = price;
    this.spaces = spaces;
    this.image = image;
    this.description = description;
    this.rating = rating;
  }
}
