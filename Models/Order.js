//Model for Order objects
export default class Order {
  constructor(id, name, phone, lessonIds, total) {
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.lessonIds = lessonIds;
    this.total = total;
    this.date = new Date();
  }
}
