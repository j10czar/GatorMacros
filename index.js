let menuData = []; 
let meal = 'dinner'
  let user_name = ''
  let user_calorie = 0
  let user_protein = 0
  var user_data = {}
const errortext = document.getElementById('errortext')






function getTodayDate() {
    const today = new Date();
  
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(today.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }




function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}


function getFromLocalStorage(key) {
  var storedData = localStorage.getItem(key);
  return JSON.parse(storedData);
}




//gator corner id: 62a8c2b8a9f13a0de3af64c4
//breakfast: 659adab6c625af072a83c89a
//lunch: 659adab6c625af072a83c8a7
//dinner: 659adab6c625af072a83c8b4
//--------
//broward id: 62b9907ab63f1e08defdd0bb
//breakfast: 6592d781e45d4306eff8ccd0
//lunch: 6592d781e45d4306eff8ccde
//dinner: 6592d781e45d4306eff8ccd7
//---------
//raquet: 64ccfa71c625af067ed9fd67


async function fetchCornerData() {
  try {
    const dinnerResponse = await fetch('https://api.dineoncampus.com/v1/location/62a8c2b8a9f13a0de3af64c4/periods/659adab6c625af072a83c8b4?platform=0&date='+getTodayDate());
    const lunchResponse = await fetch('https://api.dineoncampus.com/v1/location/62a8c2b8a9f13a0de3af64c4/periods/659adab6c625af072a83c8a7?platform=0&date='+getTodayDate());
    const breakfastResponse = await fetch('https://api.dineoncampus.com/v1/location/62a8c2b8a9f13a0de3af64c4/periods/659adab6c625af072a83c89a?platform=0&date='+getTodayDate());

    const dinnerJSON = await dinnerResponse.json();
    const lunchJSON = await lunchResponse.json();
    const breakfastJSON = await breakfastResponse.json();
    const dinnerData = dinnerJSON['menu']['periods']['categories'];
    const lunchData = lunchJSON['menu']['periods']['categories'];
    const breakfastData = breakfastJSON['menu']['periods']['categories'];
    const menuData = [breakfastData,lunchData,dinnerData]
    return menuData;
  } catch (error) {
    throw new Error(error);
  }
}






async function fetchBrowardData() {
  try {
    const dinnerResponse = await fetch('https://api.dineoncampus.com/v1/location/62b9907ab63f1e08defdd0bb/periods/6592d781e45d4306eff8ccd7?platform=0&date='+getTodayDate());
    const lunchResponse = await fetch('https://api.dineoncampus.com/v1/location/62b9907ab63f1e08defdd0bb/periods/6592d781e45d4306eff8ccde?platform=0&date='+getTodayDate());
    const breakfastResponse = await fetch('https://api.dineoncampus.com/v1/location/62b9907ab63f1e08defdd0bb/periods/6592d781e45d4306eff8ccd0?platform=0&date='+getTodayDate());

    const dinnerJSON = await dinnerResponse.json();
    const lunchJSON = await lunchResponse.json();
    const breakfastJSON = await breakfastResponse.json();
    const dinnerData = dinnerJSON['menu']['periods']['categories'];
    const lunchData = lunchJSON['menu']['periods']['categories'];
    const breakfastData = breakfastJSON['menu']['periods']['categories'];
    const menuData = [breakfastData,lunchData,dinnerData]
    return menuData;
  } catch (error) {
    throw new Error(error);
  }
}

async function fetchRaquetData() {
  try {
    const raquetResponse = await fetch('https://api.dineoncampus.com/v1/location/64ccfa71c625af067ed9fd67/periods?platform=0&date='+getTodayDate());

    const raquetJSON = await raquetResponse.json();
    const raquetData = raquetJSON['menu']['periods']['categories'];
    const menuData = [raquetData]
    return menuData;
  } catch (error) {
    throw new Error(error);
  }
}







//V is corresponding meal number in fetchedMenu data array
//breakfast 0
//lunch 1
//dinner 2

//raquet is 0 by default
function sortRawData(menuData,v){
  let sortedMenu = {}
  for(let i = 0;i<menuData[v].length; i++){
    for(let j = 0; j<menuData[v][i]['items'].length;j++){
      sortedMenu[menuData[v][i]['items'][j]['name']] = [parseInt(menuData[v][i]['items'][j]['calories']),
      parseInt(menuData[v][i]['items'][j]['nutrients'][1]['value'])]
    }
  }


  return sortedMenu
}




//for testing purposes
async function viewMenuData() {
  try {
    const fetchedCornerData = await fetchCornerData();
    const fetchedBrowardData = await fetchBrowardData();
    const fetchedRaquetData = await fetchRaquetData();
    console.log(fetchedCornerData)
    console.log(sortRawData(fetchedBrowardData,1))
    console.log(fetchedRaquetData)
    console.log(sortRawData(fetchedRaquetData,0))

  } catch (error) {
    console.log(error);
    errortext.innerHTML = 'Error with the UF dining servers:'+error.message // Handle any errors that occurred during fetching
  }
}




function UserDataExists() {
  var userData = getFromLocalStorage('user-data');

  // Check if userData is not null or undefined
  return userData !== null && userData !== undefined;
}




function spawnWelcomeModal(title){
  document.getElementById('welcome-box').style.display = 'flex'
  document.getElementById('welcome-container').style.display = 'flex'
  document.getElementById('modal-title').innerHTML = title
  document.getElementById("welcome-submit").addEventListener('click',function(event){ 
    event.preventDefault();
    user_name = document.getElementById('name').value
    user_calorie = document.getElementById('calorie').value
    user_protein = document.getElementById('protein').value
    
    if(user_name==='' || user_name===' '){
      alert('Please fill out your first name')
    }
    else if(user_calorie>4000 || user_calorie<500){
      alert('Calorie goal must be between 4000 and 500')
    }
    else if(user_protein>250 || user_protein<10){
      alert('Protein goal must be between 250g and 10g')
    }
    else{
      document.getElementById('welcome-box').style.display = 'none'
      document.getElementById('welcome-container').style.display = 'none'
      user_data ={
        name: user_name,
        calorie: user_calorie,
        protein: user_protein
      }
      saveToLocalStorage('user-data', user_data)
      loadInfoPanel()

    }
    

  })

}


function spawnChangeModal(title){
  document.getElementById('welcome-box').style.display = 'flex'
  document.getElementById('welcome-container').style.display = 'flex'
  document.getElementById('modal-title').innerHTML = title
  document.getElementById('welcome-submit').innerHTML = "Change"
  

  // Get the existing close button
  var closeButton = document.querySelector('.close-button');


  if (!closeButton) {
      closeButton = document.createElement('button');
      closeButton.className = 'close-button';
      closeButton.textContent = 'Close';

      document.getElementById('modal-btn-container').appendChild(closeButton)
  }

  closeButton.addEventListener('click', function(event) {
      event.preventDefault();
      document.getElementById('welcome-box').style.display = 'none'
      document.getElementById('welcome-container').style.display = 'none'

  });

  document.getElementById("welcome-submit").addEventListener('click',function(event){
    event.preventDefault(); 
    user_name = document.getElementById('name').value
    user_calorie = document.getElementById('calorie').value
    user_protein = document.getElementById('protein').value
    
    if(user_name==='' || user_name===' '){
      alert('Please fill out your first name')
    }
    else if(user_calorie>4000 || user_calorie<500){
      alert('Calorie goal must be between 4000 and 500')
    }
    else if(user_protein>250 || user_protein<10){
      alert('Protein goal must be between 250g and 10g')
    }
    else{
      document.getElementById('welcome-box').style.display = 'none'
      document.getElementById('welcome-container').style.display = 'none'
      user_data ={
        name: user_name,
        calorie: user_calorie,
        protein: user_protein
      }
      saveToLocalStorage('user-data', user_data)
      loadInfoPanel()

    }
    

  })



}




function loadInfoPanel(){
  var timeOfDay = 'day'
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 5 && hour < 12) {
      timeOfDay="morning"
    } else if (hour >= 12 && hour < 18) {
      timeOfDay="afternoon"
    } else {
      timeOfDay="evening"
    }

    document.getElementById('greeting').innerHTML= "Good "+timeOfDay+" "+user_data.name+"!"
    document.getElementById('protein-display').innerHTML = "Protein goal: "+user_data.protein+'g'
    document.getElementById('calorie-display').innerHTML = "Calorie goal: "+user_data.calorie
    document.getElementById('change-goal').addEventListener('click',function(){
      spawnChangeModal("Change Goals")
    })

}

/**
 * Finds the index of the menu item that has the closest macro to the target.
 *
 * @param {string} macro - The macro to consider ('p' for protein, 'c' for calories).
 * @param {number} target - The target value for the macro.
 * @param {Object} menu - The menu, represented as an object where each key is an item name and the value is an array [calories, protein].
 * @returns {string} The key of the menu item that has the closest macro to the target.
 */
function closestMacro(macro,number,menu){
    let distance = Number.MAX_SAFE_INTEGER
    let closestIndex = 0
    let pc = 0
    if(macro==='c'){
      pc = 0
    }
    else{
      pc = 1
    }

    for(var item in menu){

      if((Math.abs(number-menu[item][pc]))<distance){
        distance= Math.abs(number-menu[item][pc])
        closestIndex = item

      }
    }

    return closestIndex

}



function createMeal(menu, proteinGoal, calorieGoal) {
  console.log(proteinGoal)
  console.log(calorieGoal)
  console.log(menu)
  let runningProtein = 0;
  let runningCalorie = 0;
  let meal = {};
  const vegetableArray = ['carrot', 'broccoli', 'spinach', 'tomato', 'cucumber', 'bell pepper', 'onion', 'lettuce', 'zucchini', 'potato', 'sweet potato', 'kale', 'cabbage', 'celery', 'eggplant', 'peas', 'asparagus', 'brussels sprouts', 'cauliflower', 'mushroom', 'green beans', 'pumpkin', 'butternut squash', 'turnip'];

  // Sort the menu items by protein-to-calorie ratio in descending order
  const sortedMenu = Object.entries(menu).sort((a, b) => (b[1][1] / b[1][0]) - (a[1][1] / a[1][0]));

  // Loop through the sorted menu
  for (let i = 0; i < sortedMenu.length; i++) {
      const item = sortedMenu[i];

      // If adding this item won't exceed the protein or calorie goal, add it to the meal
      if (runningProtein + item[1][1] <= proteinGoal && runningCalorie + item[1][0] <= calorieGoal) {
          meal[item[0]] = item[1];
          runningProtein += item[1][1];
          runningCalorie += item[1][0];
      }

      // If the protein or calorie goal has been reached, break the loop
      if (runningProtein >= proteinGoal && runningCalorie >= calorieGoal) {
          break;
      }
  }

  // Ensure the meal includes at least one vegetable
  for (let i = 0; i < vegetableArray.length; i++) {
      if (meal.hasOwnProperty(vegetableArray[i])) {
          return meal;
      }
  }

  // If no vegetable is included in the meal, add the first vegetable from the vegetableArray that is in the menu
  for (let i = 0; i < vegetableArray.length; i++) {
      if (menu.hasOwnProperty(vegetableArray[i])) {
          meal[vegetableArray[i]] = menu[vegetableArray[i]];
          break;
      }
  }

  return meal;
}

//------------ Define Functions Above this line-----------


    

async function gatorMacros(){
  if(!UserDataExists()){
    spawnWelcomeModal("Welcome to GatorMacros!")
  }
  else{
    user_data = getFromLocalStorage('user-data')
    loadInfoPanel()
    userName = user_data.name
    userCalorie = user_data.calorie
    userProtein = user_data.protein
  }



  try {
    const fetchedCornerData = await fetchCornerData();
    const fetchedBrowardData = await fetchBrowardData();
    const fetchedRaquetData = await fetchRaquetData();
    document.querySelectorAll('.load-container').forEach(element => {
      element.style.display = 'none';
  });
  
  document.querySelectorAll('.dining-select').forEach(element => {
      element.style.display = 'inline';
  });
    var breakfastMenu = {}
    var lunchMenu = {}
    var dinnerMenu = {}


    document.getElementById('breakfast-submit').addEventListener('click', function() {
      var breakfastOption = document.getElementById('breakfast-dropdown').value;
      console.log('Selected option for breakfast:', breakfastOption);
      document.getElementById('breakfast-select').style.display = 'none'
      if(breakfastOption==='corner'){
        
        breakfastMenu = sortRawData(fetchedCornerData,0)
      }
      else if(breakfastOption==='broward'){
        breakfastMenu = sortRawData(fetchedBrowardData,0)
      }
      else{
        breakfastMenu = sortRawData(fetchedRaquetData,0)
      }

      console.log(breakfastMenu)

      
      
    });  
    document.getElementById('lunch-submit').addEventListener('click', function() {
      var lunchOption = document.getElementById('lunch-dropdown').value;
      console.log('Selected option for lunch: ', lunchOption);
      document.getElementById('lunch-select').style.display = 'none'
      if(lunchOption==='corner'){
        lunchMenu = sortRawData(fetchedCornerData,1)
        
      }
      else if(lunchOption==='broward'){
        lunchMenu = sortRawData(fetchedBrowardData,1)
      }
      else{
        lunchMenu = sortRawData(fetchedRaquetData,0)
      }
      console.log(createMeal(lunchMenu,userProtein/3,userCalorie/3))
    });
    
    document.getElementById('dinner-submit').addEventListener('click', function() {
      var dinnerOption = document.getElementById('dinner-dropdown').value;
      console.log('Selected option for dinner: ', dinnerOption);
      document.getElementById('dinner-select').style.display = 'none'
      if(dinnerOption==='corner'){
        dinnerMenu = sortRawData(fetchedCornerData,2)
        
      }
      else if(dinnerOption==='broward'){
        dinnerMenu = sortRawData(fetchedBrowardData,2)
      }
      else{
        dinnerMenu = sortRawData(fetchedRaquetData,0)
      }
      console.log(dinnerMenu)
    });

    


    

  } catch (error) {
    console.log(error);
    errortext.innerHTML = 'Application Error:'+error.message 
  }
}







gatorMacros()


 