class Food {
  constructor(name, calorie, carbohydrate, fat) {
    this.name = name;
    this.calorie = calorie;
    this.carbohydrate = carbohydrate;
    this.fat = fat;
  }
}

class UI {
  add(food) {
    
    //Get table with id ,create tr, pass object values with a delete symbol into table
    const list = document.getElementById('tbody-nutrition-list');
    const tr = document.createElement('tr');
    const d = new Date().toString().slice(0, 16);
    
    tr.innerHTML = `<td class="n-name">${food.name}</td>
                    <td class="n-cal">${food.calorie}</td>
                    <td class="n-car">${food.carbohydrate}</td>
                    <td class="n-fat">${food.fat}</td>  
                    <td>${d}</td> 
                    <td>&nbsp &nbsp<a href="#" class="delete-item secondary-content"><i class="fa fa-trash"></i></a></td>
    `;
    list.appendChild(tr);
  }
  //If clicked element is plus icon then get the parent element tr and pass it food object
  addFromSearch(target) {
    if (target.className === 'fa fa-plus') {     
      
      const tr = target.parentElement.parentElement.parentElement;   
      console.log(tr);
      const food = new Food(tr.children[0].innerHTML, tr.children[1].innerHTML, tr.children[2].innerHTML, tr.children[3].innerHTML, tr.children[4].innerHTML);
      //Instantiate UI
      const ui = new UI();
      //Call add function
      ui.add(food);
       
      Storage.save(food);
         
      
    }
  }
  //This deletes just from UI
  delete(target) {
    if (target.className === 'fa fa-trash') {
      target.parentElement.parentElement.parentElement.remove();
    }

  }
  
  //get all elements with class name n-cal,n-car,n-fat. These are the values are going to be summed
  sumNutritions(){
    function doSum(arr) { 
      //pass them in array , trim and sum     
      return Array.from(arr).reduce((acc, curr) => {
        return acc + parseFloat(curr.innerHTML.trim())
      }, 0)
    }
    let cal = doSum(document.getElementsByClassName('n-cal'));
    let car = doSum(document.getElementsByClassName('n-car'));
    let fat = doSum(document.getElementsByClassName('n-fat'))
    //Pass them in table's tfoot as total values
    document.getElementById('total-cal').innerHTML = `${cal.toFixed(2)} kcal`;
    document.getElementById('total-car').innerHTML = `${car.toFixed(2)} g`;
    document.getElementById('total-fat').innerHTML = `${cal.toFixed(2)} g`;
 
    
  }

  //Give Alert
  showAlert(m, className) {
    const message = document.createElement('div');
    message.className = `alert ${className} `;
    message.appendChild(document.createTextNode(m));
    const row = document.querySelector('#row');
    const form = document.querySelector('#nutrition-form');
    row.insertBefore(message, form);
    //Alert dissapers after 1,5 seconds
    setTimeout(function () {
      document.querySelector('.alert').remove();
    }, 1500);
  }
  //Clear fields
  clearInputs() {
    document.getElementById('nutrition').value = '';
    document.getElementById('calorie').value = '';
    document.getElementById('carbohydrate').value = '';
    document.getElementById('fat').value = '';
  }
   //Search/filter from json file
  searchFilter(e) {
    const input = e.target.value.toLowerCase();
    const tbody = document.querySelector('#search-output');
    const results = document.querySelector('#search-nutrition');
    //Get food.json    
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `food.json`, true);
    xhr.onload = function () {
      if (this.status === 200) {
        const response = JSON.parse(this.responseText);
        let content = '';
        response.forEach(function (item) {

          //If given any nutrition description contains the given input pass its values into content
          if (item.Description.toLowerCase().includes(input)) {
            results.style.display = "block";
            content += `<tr><td id="search-desc">${item.Description} </td>
                                   <td id="filter-cal">${(item.Data.Kilocalories).toFixed(1)} </td>
                                   <td id="filter-carb">${(item.Data.Carboydrate).toFixed(2)}</td>
                                   <td id="filter-fat"> ${(item.Data.Fat.Total).toFixed(2)} </td>                                 
                                   <td id="filter-icon"><a href="#" class="add-item secondary-content">&nbsp <i class="fa fa-plus"></i></a></td></tr>`;
          }
          //If not keep content empty and dont show tbody
          if (input === '') {
            content = '';
            results.style.display = "none";
          }
        });
        //Pass content into tbody
        tbody.innerHTML = content;
      }
    }
    xhr.send();
    e.preventDefault();
  }
}

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


