class Food {
  constructor(name, calorie, carbohydrate, fat) {
    this.name = name;
    this.calorie = calorie;
    this.carbohydrate = carbohydrate;
    this.fat = fat;
  }
}




//eventlistener for Search/Filter
document.getElementById('input').addEventListener('keyup',
  function (e) {
    const ui = new UI();
    ui.searchFilter(e)
    e.preventDefault();
  });


//Add new Nutrition via form
document.getElementById('nutrition-form').addEventListener('submit', function (e) {
  //Get values from HTML
  const ntr = document.getElementById('nutrition').value,
    cal = document.getElementById('calorie').value,
    carbon = document.getElementById('carbohydrate').value,
    fat = document.getElementById('fat').value
  //Instantiate food object
  const food = new Food(ntr, cal, carbon, fat);
  //Instantiate UI
  const ui = new UI();
  //Validate Fields
  if (ntr === '' || cal === '' || carbon === '' || fat === '') {
    ui.showAlert('Please fill out all field.', 'bg-danger');
  }
  else {
    //Call add function
    ui.add(food);
    //Save to Local Storage
    Storage.save(food);    
    //Call Local storage add function
    //Storage.add(food);
    ui.showAlert('The nutrition has been added succesfully.', 'bg-success');
    ui.clearInputs();
  }
  e.preventDefault();
});

//Delete from list
document.getElementById('tbody-nutrition-list').addEventListener('click', function (e) {
  const ui = new UI();
  //Delete
  ui.delete(e.target);
  //Get tr and selected nutrition's name
  const tr = e.target.parentElement.parentElement.parentElement;
  const name = tr.children[0].innerHTML;
  //Pass the name to Storage.remove function (we need the name to delete)
  Storage.remove(name);
  //Update Sum Values
  ui.sumNutritions(); 
  //Update number of items for Your sum
  document.getElementById('your-sum').innerHTML = document.getElementById('tbody-nutrition-list').rows.length;
  ui.showAlert('Selected nutrition has been removed!', 'bg-success');
  e.preventDefault();

});


//Adding from custom search/filter with plus icon
document.getElementById('search-output').addEventListener('click', function (e) {
  const ui = new UI();
  ui.addFromSearch(e.target); 
  ui.showAlert('The nutrition has been added succesfully!', 'bg-success');
  e.preventDefault();

});

//If there is new item that has been added into list then sumNutritions is called
document.getElementById('tbody-nutrition-list').addEventListener('DOMNodeInserted',function(){
  const ui = new UI(); 
  //List has been changed then Sum the values
  ui.sumNutritions(); 
  //Update number of items for Your sum
  document.getElementById('your-sum').innerHTML = document.getElementById('tbody-nutrition-list').rows.length;


});


//DOM Load Event
document.addEventListener('DOMContentLoaded', function(){
  document.getElementById('search-nutrition').style.display = "none";  
  Storage.display(); 
});


