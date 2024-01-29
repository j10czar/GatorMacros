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
      let c = parseInt(menuData[v][i]['items'][j]['calories'])
      let p = parseInt(menuData[v][i]['items'][j]['nutrients'][1]['value'])
      let cRatio = c/p
      let pRatio = p/c
      let score = c+25*p
      if(p===0 || isNaN(p)){
        cRatio = c
        pRatio = 0
      }
      if(isNaN(p)){
        p = 0
      }
      sortedMenu[menuData[v][i]['items'][j]['name']] =
      {
        calories: c,
        protein: p,
        score: c+25*p,
        cRatio: cRatio,
        pRatio: pRatio
      }
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
  document.getElementById('modal-container').style.display = 'flex'
  document.getElementById('modal-title').innerHTML = title
  document.getElementById("welcome-submit").addEventListener('click',function(){ 
    user_name = document.getElementById('welcome-name').value
    user_calorie = document.getElementById('welcome-calorie').value
    user_protein = document.getElementById('welcome-protein').value
    
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
      document.getElementById('modal-container').style.display = 'none'
      user_data ={
        name: user_name,
        calorie: user_calorie,
        protein: user_protein,
        dislikedFoods: [],
        veggies: true
      }
      saveToLocalStorage('user-data', user_data)
      location.reload()
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
}




/**
 * Creates a meal based on the given menu, protein goal, calorie goal, and dietary preferences.
 * 
 * @param {Object} menu - The menu containing the available food items and their nutritional values.
 * @param {number} proteinGoal - The desired protein goal for the meal.
 * @param {number} calorieGoal - The desired calorie goal for the meal.
 * @param {boolean} isRegen - Indicates whether the meal should be randomly generated.
 * @param {boolean} isVeggie - Indicates whether the meal should include veggies.
 * @returns {Object} - The created meal with selected food items and their nutritional values.
 */
function createMeal(menu, proteinGoal, calorieGoal, isRegen, isVeggie) {
  let runningProtein = 0
  let runningCalorie = 0
  let meal = {}
  let goalMet = ''

  //create 3 arrays of the menu items sorted by score, cRatio, and pRatio in decenting order
  let scoreArray = Object.entries(menu).map(([item, values]) => ({
    item, 
    calories: values.calories, 
    protein: values.protein, 
    score: values.score
  }))
  scoreArray.sort((a, b) => b.score - a.score)

  let cRatioArray = Object.entries(menu).map(([item, values]) => ({
    item, 
    calories: values.calories, 
    protein: values.protein, 
    cRatio: values.cRatio
  }))
  cRatioArray.sort((a, b) => b.cRatio - a.cRatio)

  let pRatioArray = Object.entries(menu).map(([item, values]) => ({
    item, 
    calories: values.calories, 
    protein: values.protein, 
    pRatio: values.pRatio
  }))
  pRatioArray.sort((a, b) => b.pRatio - a.pRatio)


  //step 1: add the highest scoring items to the meal 
  //check if either the protein or calorie goal has been met
  for(let i = 0; i<scoreArray.length;i++){
    if(runningProtein>=proteinGoal*0.8){
      goalMet = 'protein'
      break
    }
    else if(runningCalorie>=calorieGoal*0.8){
      goalMet = 'calorie'
      break
    }
    else if(runningCalorie+scoreArray[i].calories<=calorieGoal && runningProtein+scoreArray[i].protein<=proteinGoal){
      runningProtein+=scoreArray[i].protein
      runningCalorie+=scoreArray[i].calories
      meal[scoreArray[i].item] = {
        calories: scoreArray[i].calories,
        protein: scoreArray[i].protein
      }
    }
  }

  //step 2: based on the goal that was met, add the remaining items to the meal based on the cRatio or pRatio
  if(goalMet==='protein'){
    //fill in the remaining calories with the items that have the highest cRatio
    for(let i = 0; i<cRatioArray.length;i++){
      if(runningCalorie>=calorieGoal*0.95){
        break
      }
      else if(runningCalorie+cRatioArray[i].calories<=calorieGoal){
        runningCalorie+=cRatioArray[i].calories
        meal[cRatioArray[i].item] = {
          calories: cRatioArray[i].calories,
          protein: cRatioArray[i].protein
        }
      }
    }
  }
  else{
    //fill in the remaining protein with the items that have the highest pRatio
    for(let i = 0; i<pRatioArray.length;i++){
      if(runningProtein>=proteinGoal*0.95){
        break
      }
      else if(runningProtein+pRatioArray[i].protein<=proteinGoal){
        runningProtein+=pRatioArray[i].protein
        meal[pRatioArray[i].item] = {
          calories: pRatioArray[i].calories,
          protein: pRatioArray[i].protein
        }
      }
    }
  }


  //includes veggies if the user wants them
  if(isVeggie){
    let veggies = ['broccoli','carrots','cauliflower','celery','cucumber','green beans','lettuce','mushrooms','onions','peppers','spinach','tomatoes']
    outer: for(let i= 0; i<scoreArray.length;i++){
      for(let j=0; j<veggies.length;j++){
        if(scoreArray[i].item.toLowerCase().includes(veggies[j])){
          meal[scoreArray[i].item] = {
            calories: scoreArray[i].calories,
            protein: scoreArray[i].protein
          }
          break outer
        }
      }
    }  
  }


  return meal


}


function createRaquetMeal(menu, proteinGoal, calorieGoal) {

  let userScoreGoal = calorieGoal+25*proteinGoal
  let meal = {}

  const desserts = ["Chocolate Chip Cookie","Cinnamon Churros","Cinnamon Roll","Cinnamon and Sugar Donut","Strawberry Shortcake Biscuit",]
  let menuArray = Object.entries(menu).map(([item, values]) => ({
    item, 
    calories: values.calories, 
    protein: values.protein, 
    score: values.score
  }))

  let dessertArray = []
  let entreeArray = []

  for(let i=0; i<menuArray.length;i++){
    if(desserts.includes(menuArray[i].item)){
      dessertArray.push(menuArray[i])
    }
    else{
      entreeArray.push(menuArray[i])
    }
  }

  entreeArray.sort((a, b) => b.score - a.score)
  dessertArray.sort((a, b) => b.score - a.score)


  for(let i = 0; i<entreeArray.length;i++){
    if(entreeArray[i].score<=userScoreGoal){
      for(let j = 0; j<dessertArray.length;j++){
        if(entreeArray[i].score+dessertArray[j].score<=userScoreGoal){
          meal[entreeArray[i].item] = {
            calories: entreeArray[i].calories,
            protein: entreeArray[i].protein
          }
          meal[dessertArray[j].item] = {
            calories: dessertArray[j].calories,
            protein: dessertArray[j].protein
          }
          return meal
        }
      } 

    }
  }



  
  
}

function calculateTotals(meal) {
  let totalProtein = 0;
  let totalCalories = 0;

  // Loop through the meal object
  for (let item in meal) {
      // Add the protein and calorie values of each item to the totals
      totalCalories += meal[item]['calories'];
      totalProtein += meal[item]['protein'];
  }

  // Return an object with the total protein and calorie values
  return {
      totalProtein: totalProtein,
      totalCalories: totalCalories
  };
}



function openSettings(){
  let user_data = getFromLocalStorage('user-data')
  document.getElementById('settings-box').style.display = 'flex'
  document.getElementById('modal-container').style.display = 'flex'

  if(user_data.veggies){
    document.getElementById('vegetables-included').checked = true
  }
  


  var closeButton = document.querySelector('.close-button');


  closeButton.addEventListener('click', function(event) {
      event.preventDefault();
      document.getElementById('settings-box').style.display = 'none'
      document.getElementById('modal-container').style.display = 'none'
      document.getElementById('settings-errors').innerHTML = ''

  });

  document.getElementById("settings-submit").addEventListener('click',function(){
    let allowed = false
    user_name = document.getElementById('settings-name').value
    user_calorie = document.getElementById('settings-calorie').value
    user_protein = document.getElementById('settings-protein').value
    user_veggies = document.getElementById('vegetables-included').checked



    if(user_data.veggies!=user_veggies){
      allowed = true
    }
    
    if(user_name != '' && user_name != null){
      user_data.name = user_name
      allowed = true
    }
    if(user_calorie != '' && user_calorie != null){
      if((user_calorie>4000 || user_calorie<500)){
        document.getElementById('settings-errors').innerHTML = 'Calorie goal must be between 4000 and 500'
      }
      else{
        user_data.calorie = user_calorie
        allowed = true
      }
    }
    if(user_protein != ''&& user_protein != null){
      if(user_protein>250 || user_protein<10){
        document.getElementById('settings-errors').innerHTML = 'Protein goal must be between 250g and 10g'
      }
      else{
        user_data.protein = user_protein
        allowed = true
      }
    }

    if(allowed){
      document.getElementById('settings-box').style.display = 'none'
      document.getElementById('modal-container').style.display = 'none'
      document.getElementById('settings-errors').innerHTML = ''
      user_data.veggies = user_veggies
      saveToLocalStorage('user-data', user_data)
      loadInfoPanel()
      location.reload()
    }
    else{
      document.getElementById('settings-errors').innerHTML = 'No changes were made.'
    }
    

  })

}

function removeOption(id,option){
    let selectElement = document.getElementById(id);
      let options = selectElement.options;

    for (let i = options.length - 1; i >= 0; i--) {
        if (options[i].value ===  option) { // replace with the value of the option you want to remove
            selectElement.remove(i);
        }
    }

}

//------------ Define Functions Above this line-----------


    

async function gatorMacros(){
  if(!UserDataExists()){
    spawnWelcomeModal("Welcome to GatorMacros!")
  }
  else{
    document.querySelectorAll('.load-container').forEach(element => {
      element.style.display = 'flex';
    });
    
    user_data = getFromLocalStorage('user-data')
    loadInfoPanel()
    userName = user_data.name
    userCalorie = user_data.calorie
    userProtein = user_data.protein
    userVeggies = user_data.veggies
    try {

      let fetchedCornerData;
      let fetchedBrowardData;
      let fetchedRaquetData;
  
      if(getFromLocalStorage('date-fetched')===getTodayDate()){
        document.querySelectorAll('.load-container').forEach(element => {
          element.style.display = 'none';
        });
          if(getFromLocalStorage('corner-data')!=null && getFromLocalStorage('corner-data')!=undefined){
            fetchedCornerData = getFromLocalStorage('corner-data')
          }
          else{
            removeOption('breakfast-dropdown','corner')
            removeOption('lunch-dropdown','corner')
            removeOption('dinner-dropdown','corner')
            document.getElementById('menu-info').innerHTML = 'Gator Corner is currently closed.'
            document.getElementById('menu-info').style.display = 'flex'
          }
          if(getFromLocalStorage('broward-data')!=null && getFromLocalStorage('broward-data')!=undefined){
            fetchedBrowardData = getFromLocalStorage('broward-data')
          }
          else{
            removeOption('breakfast-dropdown','broward')
            removeOption('lunch-dropdown','broward')
            removeOption('dinner-dropdown','broward')
            document.getElementById('menu-info').innerHTML = 'Broward Dining is currently closed.'
            document.getElementById('menu-info').style.display = 'flex'
          }
          if(getFromLocalStorage('raquet-data')!=null && getFromLocalStorage('raquet-data')!=undefined && sortRawData(getFromLocalStorage('raquet-data'),0).length>0){
            fetchedRaquetData = getFromLocalStorage('raquet-data')
  
          }
          else{
            removeOption('lunch-dropdown','raquet')
            removeOption('dinner-dropdown','raquet')
            document.getElementById('menu-info').innerHTML = 'Raquet Club is currently closed.'
            document.getElementById('menu-info').style.display = 'flex'
          }
          
          
  
      }
      else{
  
        saveToLocalStorage('date-fetched',getTodayDate())
      
        try{
          fetchedCornerData = await fetchCornerData();
          saveToLocalStorage('corner-data', fetchedCornerData)
        }catch(error){
          removeOption('breakfast-dropdown','corner')
          removeOption('lunch-dropdown','corner')
          removeOption('dinner-dropdown','corner')
          document.getElementById('menu-info').innerHTML = 'Gator Corner is currently closed.'
          document.getElementById('menu-info').style.display = 'flex'
        }
        try{
          fetchedBrowardData = await fetchBrowardData();
          saveToLocalStorage('broward-data', fetchedBrowardData)
        }catch(error){
          removeOption('breakfast-dropdown','broward')
          removeOption('lunch-dropdown','broward')
          removeOption('dinner-dropdown','broward')
          document.getElementById('menu-info').innerHTML = 'Broward Dining is currently closed.'
          document.getElementById('menu-info').style.display = 'flex'
        }
        try{
          let tempRaquet = await fetchRaquetData();
          if(sortRawData(tempRaquet,0).length>0){
            fetchedRaquetData = tempRaquet
            saveToLocalStorage('raquet-data', fetchedRaquetData)
          }
          else{
            removeOption('lunch-dropdown','raquet')
            removeOption('dinner-dropdown','raquet')
            document.getElementById('menu-info').innerHTML = 'Raquet Club is currently closed.'
            document.getElementById('menu-info').style.display = 'flex'
            
          }
        }
        catch(error){
          removeOption('lunch-dropdown','raquet')
          removeOption('dinner-dropdown','raquet')
          document.getElementById('menu-info').innerHTML = 'Raquet Club is currently closed.'
          document.getElementById('menu-info').style.display = 'flex'
        }
        document.querySelectorAll('.load-container').forEach(element => {
          element.style.display = 'none';
      });
    }
      
      document.querySelectorAll('.dining-select').forEach(element => {
          element.style.display = 'inline';
      });
      var breakfastMenu = {}
      var lunchMenu = {}
      var dinnerMenu = {}
      let locations = {
        'corner': 'Gator Corner:',
        'broward': 'Broward Dining:',
        'raquet': 'Raquet Club:'
      }
  
  
      document.getElementById('breakfast-submit').addEventListener('click', function() {
        var breakfastOption = document.getElementById('breakfast-dropdown').value;
        document.getElementById('breakfast-location').innerHTML = locations[breakfastOption]
        document.getElementById('breakfast-location').style.display = 'flex'
        document.getElementById('breakfast-select').style.display = 'none'
        if(breakfastOption==='broward'){
          breakfastMenu = sortRawData(fetchedBrowardData,0)
        }
        else{
          breakfastMenu = sortRawData(fetchedCornerData,0)
        }
  
  
        let meal = createMeal(breakfastMenu,userProtein/3,userCalorie/3,false,userVeggies)
  
  
        let ul = document.getElementById('breakfast-menu');
        for (let key in meal) {
            let li = document.createElement('li');
            li.textContent = key;
            ul.appendChild(li);
        }
        document.getElementById('breakfast-output').style.display = 'flex'
        document.getElementById('breakfast-c').innerHTML = 'Calories: '+calculateTotals(meal).totalCalories
        document.getElementById('breakfast-p').innerHTML = 'Protein: '+calculateTotals(meal).totalProtein
  
  
        
        
      });  
      document.getElementById('lunch-submit').addEventListener('click', function() {
        let meal = {}
        var lunchOption = document.getElementById('lunch-dropdown').value;
        document.getElementById('lunch-location').innerHTML = locations[lunchOption]
        document.getElementById('lunch-location').style.display = 'flex'
        document.getElementById('lunch-select').style.display = 'none'
        if(lunchOption==='corner'){
          lunchMenu = sortRawData(fetchedCornerData,1)
          meal = createMeal(lunchMenu,userProtein/3,userCalorie/3,false,userVeggies)
          
        }
        else if(lunchOption==='broward'){
          lunchMenu = sortRawData(fetchedBrowardData,1)
          meal = createMeal(lunchMenu,userProtein/3,userCalorie/3,false,userVeggies)
        }
        else{
          lunchMenu = sortRawData(fetchedRaquetData,0)
          meal = createRaquetMeal(lunchMenu,userProtein/3,userCalorie/3)
        }
  
  
        let ul = document.getElementById('lunch-menu');
        for (let key in meal) {
            let li = document.createElement('li');
            li.textContent = key;
            ul.appendChild(li);
        }
        document.getElementById('lunch-output').style.display = 'flex'
        document.getElementById('lunch-c').innerHTML = 'Calories: '+calculateTotals(meal).totalCalories
        document.getElementById('lunch-p').innerHTML = 'Protein: '+calculateTotals(meal).totalProtein
  
      });
      
      document.getElementById('dinner-submit').addEventListener('click', function() {
        let meal = {}
        var dinnerOption = document.getElementById('dinner-dropdown').value;
        document.getElementById('dinner-location').innerHTML = locations[dinnerOption]
        document.getElementById('dinner-location').style.display = 'flex'
        document.getElementById('dinner-select').style.display = 'none'
        if(dinnerOption==='corner'){
          dinnerMenu = sortRawData(fetchedCornerData,2)
          meal = createMeal(dinnerMenu,userProtein/3,userCalorie/3,false,userVeggies)
          
        }
        else if(dinnerOption==='broward'){
         
          dinnerMenu = sortRawData(fetchedBrowardData,2)
          meal = createMeal(dinnerMenu,userProtein/3,userCalorie/3,false,userVeggies)
        }
        else{
          dinnerMenu = sortRawData(fetchedRaquetData,0)
          meal = createRaquetMeal(dinnerMenu,userProtein/3,userCalorie/3)
        }
  
  
        let ul = document.getElementById('dinner-menu');
        for (let key in meal) {
            let li = document.createElement('li');
            li.textContent = key;
            ul.appendChild(li);
        }
        document.getElementById('dinner-output').style.display = 'flex'
        document.getElementById('dinner-c').innerHTML = 'Calories: '+calculateTotals(meal).totalCalories
        document.getElementById('dinner-p').innerHTML = 'Protein: '+calculateTotals(meal).totalProtein
  
      });
  
      
  
  
      
  
    } catch (error) {
      console.log(error);
      errortext.innerHTML = 'Application Error:'+error.message 
    }
  }



  
}







gatorMacros()
