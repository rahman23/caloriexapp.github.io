
class Storage {
  //get Movies from local storage return it as array
  static get() {
    let nutritions;
    //If localstorage is empty
    if (localStorage.getItem('nutritions') === null) {
      nutritions = [];
    } else {
      nutritions = JSON.parse(localStorage.getItem('nutritions'));
    }
    return nutritions;
  }
  //Get values from local storage display them with ui.add function
  static display() {
    const nutritions = Storage.get();
    nutritions.forEach(function (food) {
      const ui = new UI;
      //Pass movie to UI
      ui.add(food);
    });
  }
  //Pass object in array ,save array in Local Storage
  static save(food) {    
    const nutritions = Storage.get();
    nutritions.push(food);
    localStorage.setItem('nutritions', JSON.stringify(nutritions));
  } 

  static remove(name){
    //Get the data form Local Storage
    const nutritions = Storage.get();
    nutritions.forEach(function (nutrition, index) {
      //if names match
      if (nutrition.name === name) {
       //Delete it from array
        nutritions.splice(index, 1);
      }
    });
    //Pass array in local storage
    localStorage.setItem('nutritions', JSON.stringify(nutritions));

   }
}