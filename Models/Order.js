//Model for Order objects
export default class Order {
  constructor(name, email, phone, lessonIds, total) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.lessonIds = lessonIds;
    this.total = total;
    this.date = new Date();
  }
}
