export class Player {
    constructor() {
      this.resources = 1000; // Example starting resources
    }
  
    deductResources(amount) {
      if (this.resources >= amount) {
        this.resources -= amount;
        return true;
      } else {
        console.log('Not enough resources');
        return false;
      }
    }
  
    addResources(amount) {
      this.resources += amount;
    }
  }