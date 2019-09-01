interface Date {
  addDays(days: number): Date;
  isValidDate(): boolean;
}

Date.prototype.addDays = function(days) {
  return this.setDate(this.getDate() + days);
};

Date.prototype.isValidDate = function() {
  return this instanceof Date && !isNaN(this);
};

