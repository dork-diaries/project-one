/*CODE BLOCK STARTS ⤵️: *************** GLOBAL VARIABLES *************** :⤵️ CODE BLOCK STARTS*/

let searchForm = document.querySelector("#search-form");
let resultsCard = document.querySelector("#results-card");
let randomBtn = document.querySelector("#random-btn");
let clearBtn = document.querySelector("#clear-btn");
let dropdownChoice = document.querySelector("#dropdown-choice");
let searchInput = document.querySelector("#search-input");
let drinkList = document.querySelector("#drink-list");
let baseUrl = "https://www.thecocktaildb.com/api/json/v1/1/";
let mainShow = document.getElementById("main-show");
let favoriteShow = document.getElementById("favorite-show");
let saved = document.getElementById("saved");
let alerts = document.getElementById("alert");
let alphabets = document.getElementById("alphabets");
let menu = document.getElementById("menu");
let menu_open = document.getElementById("bars");
let menu_close = document.getElementById("close");
let filter = document.getElementById("filterResults");
let totalText = document.getElementById("totalText");

/*CODE BLOCK ENDS ⤴️: ***************** GLOBAL VARIABLES ***************** :⤴️ CODE BLOCK ENDS*/

/*CODE BLOCK STARTS ⤵️: *************** This code block returns drinks + image + ingredients + instructions *************** :⤵️ CODE BLOCK STARTS*/

//* CODE CHUNK STARTS ⤵️: This function block fetches a random drink from an array of drinks
function randomCocktail() {
  resultsCard.classList.remove("hidden");
  const cocktailApi = "https://www.thecocktaildb.com/api/json/v1/1/random.php"; // This is the base url for the random cocktail
  fetch(cocktailApi)
    .then((res) => res.json())
    .then(function (data) {
      displayData(data);
    });
}
//* CODE CHUNK ENDS ⤴️: This function block fetches a random drink from an array of drinks

function mainSearch(event) {
  event.preventDefault();
  resultsCard.classList.remove("hidden");
  drinkList.innerHTML = "";
  let queryParam = dropdownChoice.value === "cocktail" ? `search.php?s=${searchInput.value}` : `filter.php?i=${searchInput.value}`;
  let requestUrl = `${baseUrl}${queryParam}`;
  console.log(requestUrl);
  fetch(requestUrl)
    .then(function (response) {
      let rtnData;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        rtnData = response.json();
        // console.log(rtnData);
        if (rtnData.drinks !== null) {
          return rtnData; // This returns the data if it is not null
        } else {
          return null;
        }
      } else {
        console.log(0);
        return null;
      }
    })
    .then(function (data) {
      let idUrl = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i="; // This is the base url for the drink id
      // console.log(data);
      let indexes = [];

      if (data === null || data.drinks === null) {
        drinkList.innerHTML = `<img src="https://media.tenor.com/KOZLvzU0o4kAAAAC/no-results.gif" alt="NOT Found" class="w-full my-3">`;
        drinkList.innerHTML += `<div class="p-2 bg-red-300 border-red-900 text-red-700 font-bold rounded">No cocktails found!</div>`;
      } else {
        //* CODE CHUNK STARTS ⤵️: This function block returns a random drink from an array of drinks
        let randomDrink;
        let dIndex; // This is the index of the random drink
        let length = data.drinks.length; // This is the length of the array of drinks

        for (let j = 0; j < length; j++) {
          randomDrink = Math.floor(Math.random() * length);
          if (!indexes.includes(randomDrink)) {
            indexes.push(randomDrink);
          }
          if (indexes.length >= 100) {
            //*! <== This numerical value sets the number of drinks that will return on screen
            break;
          }
        }

        let num = 0;
        totalText.innerHTML = ``;
        filter.innerHTML = `<option value="All" selected>All</option>`;
        for (let a = 0; a <= indexes.length; a += 10) {
          if (a > indexes.length || a + 10 > indexes.length) {
            num = indexes.length;
          } else if (a == 0) {
            num = 5;
          } else {
            num = a;
          }
          filter.innerHTML += `<option value="${num}">${num}</option>`;
        }
        document.getElementById("filter-cont").style.display = "flex"; //*! This displays the filter
        filter.style.display = "block";
        totalText.innerHTML = `${indexes.length} Drinks Found!`;
        //* CODE CHUNK ENDS ⤴️: This function block returns a random drink from an array of drinks

        //* CODE CHUNK STARTS ⤵️: This code chunk grabs all details of a drink using ID
        let cocktail, d_id; // This is the name of the drink and the ID of the drink
        for (let i = 0; i < indexes.length; i++) {
          dIndex = indexes[i]; // This is the index of the random drink
          cocktail = data.drinks[dIndex];
          d_id = cocktail.idDrink;
          fetch(idUrl + d_id) // This fetches the drink by ID
            .then((res) => res.json())
            .then((data) => displayData(data));
          //* CODE CHUNK ENDS ⤴️: This code chunk grabs all details of a drink using ID
        }
      }
    });
}

/*CODE BLOCK ENDS ⤴️: *************** This code block returns drinks + image + ingredients + instructions *************** : ⤴️ CODE BLOCK ENDS*/

/*CODE BLOCK STARTS ⤵️: *************** This code block returns ingredients + measurements *************** :⤵️ CODE BLOCK STARTS*/

//* CODE CHUNK STARTS ⤵️: This function fetches drinks by ID, then saves to favorites
function getFavorites(id) {
  // This function fetches drinks by ID, then saves to favorites
  drinkList.innerHTML = "";
  //*! This hides the drink to the favorites list
  document.getElementById("filter-cont").style.display = "none";
  filter.style.display = "none";
  totalText.innerHTML = ``;
  totalText.innerHTML = "";
  let idUrl = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";
  fetch(idUrl + id)
    .then((res) => res.json())
    .then((data) => displayData(data));
}
//* CODE CHUNK ENDS ⤴️: This function fetches drinks by ID, then saves to favorites

// This loop returns a random drink from an array of drinks along with the drink's ingredients paired with measurements, image, and instructions
function displayData(data, i = 0) {
  resultsCard.classList.remove("hidden");
  // console.log(data);
  let drink = data.drinks[i]; // This is the drink object
  let ingredients = []; // This is the array of ingredients
  let measures = []; // This is the array of measurements
  let ingredientsData, instructionsData, portions;
  //* CODE CHUNK STARTS ⤵️: This function block pints the ingredients data from an array of drinks
  for (let k = 1; k <= 15; k++) {
    if (drink[`strIngredient${k}`] != null && drink[`strIngredient${k}`] != undefined && `strIngredient${k}` in drink) {
      ingredients.push(drink[`strIngredient${k}`]);
    } else {
      break;
    }
  }
  //* CODE CHUNK ENDS ⤴️: This function block pints the ingredients data from an array of drinks

  //* CODE CHUNK STARTS ⤵️: This function block pints the measurement data from an array of drinks
  for (let a = 1; a <= 15; a++) {
    // This loop prints the measurement data from an array of drinks
    if (`strIngredient${a}` in drink && drink[`strMeasure${a}`] != null && drink[`strMeasure${a}`] != "") {
      measures.push(drink[`strMeasure${a}`]);
    } else {
      break;
    }
  }
  //* CODE CHUNK ENDS ⤴️: This function block pints the measurement data from an array of drinks

  //* CODE CHUNK STARTS ⤵️: This function block concatenates ingredients + measurement data from an array of drinks

  portions = `<ul>`; // This line opens the <ul> tag
  for (let b = 0; b < ingredients.length; b++) {
    // This loop concatenates ingredients + measurement data from an array of drinks
    if (measures[b] == null || measures[b] == undefined) {
      measures[b] = "";
    }
    portions += `<li>${ingredients[b]} - ${measures[b]}</li>`; // This concatenates the ingredients and measurements
  }
  if (ingredients.length != 0) {
    ingredientsData = `<p><b>Ingredients</b>: ${portions}</p>`; // This concatenates the ingredients and measurements
  } else {
    ingredientsData = "";
  }

  portions += `</ul>`; // This line closes the <ul> tag
  //* CODE CHUNK ENDS ⤴️: This function block concatenates ingredients + measurement data from an array of drinks

  //* CODE CHUNK STARTS ⤵️: This function block prints the ingredients + measurement + instructions + image data  (with save button) to the screen
  if (drink.strInstructions !== undefined) {
    instructionsData = `<p><b>Instructions</b>: ${drink.strInstructions}</p>`;
  } else {
    instructionsData = "";
  }
  drinkList.innerHTML += `<div class="item my-5">
  <h4 class="text-2xl font-bold mb-3">${drink.strDrink}</h4>
  <p><img height="200" width="200" src="${drink.strDrinkThumb}"></p> 
  ${ingredientsData}
  <br>
  ${instructionsData}

  <button class="text-sm py-2 px-4 rounded bg-blue-400 text-white text-sm" onclick='saveCocktail("${drink.strDrink}")'>Add to Favorites</button> 
  </div>`; // This onclick event saves the drink to favorites
}
//* CODE CHUNK ENDS ⤴️: This function block prints the ingredients + measurement + instructions + image data to the screen

/*CODE BLOCK ENDS ⤴️: *************** This code block returns ingredients + measurements *************** :⤴️ CODE BLOCK ENDS*/

/*CODE BLOCK STARTS ⤵️: *************** This code block saves retrievable cocktails to local storage *************** :⤵️ CODE BLOCK STARTS*/
function filerResults() {
  let num = document.getElementById("filterResults").value;
  let item = document.querySelectorAll(".items .item");
  for (let k = 0; k < item.length; k++) {
    item[k].style.display = "none";
  }
  if (num == "All") {
    num = item.length;
  }
  for (let j = 0; j < num; j++) {
    item[j].style.display = "block";
  }
}

function favoriteSearch() {
  resultsCard.classList.add("hidden");
  // This function searches for drinks in local storage
  mainShow.style.display = "none";
  favoriteShow.style.display = "block";
  drinkList.innerHTML = "";
}
``;
function mainSearchInit() {
  favoriteShow.style.display = "none";
  mainShow.style.display = "block";
  drinkList.innerHTML = "";
}

// Grabs all past cocktails
let dataStorage = JSON.parse(localStorage.getItem("cocktailName")) || [];
// Function to save a searched cocktail name in local storage.
let saveCocktail = function (name) {
  let flag = false; // This flag is used to check if the drink is already in local storage
  if (dataStorage) {
    // Checks if a name is already present in local storage
    for (let i = 0; i < dataStorage.length; i++) {
      if (dataStorage[i] === name) {
        flag = true;
      }
    }
  }
  //* CODE CHUNK STARTS ⤵️: This function block displays a message if a cocktail saves successfully or is already saved
  if (!flag) {
    // This if statement checks if the drink is already in local storage
    dataStorage.push(name);
    localStorage.setItem("cocktailName", JSON.stringify(dataStorage));
    alerts.innerHTML = `<div class="p-3 bg-green-300 border-green-900 text-green-700 font-bold rounded">Cocktails saved!</div>`;
    setTimeout(() => {
      alerts.innerHTML = "";
    }, 3000); // This line clears the alerts after 3 seconds
  } else {
    alerts.innerHTML = `<div class="p-3 bg-red-300 border-red-900 text-red-700 font-bold rounded">Cocktails already present!</div>`;
    setTimeout(() => {
      alerts.innerHTML = "";
    }, 3000); // This line clears the alerts after 3 seconds
  }
  //* CODE CHUNK ENDS ⤴️: This function block displays a message if a cocktail saves successfully or is already saved

  // This loads the cocktails again.
  loadCocktails();
};

// Function to delete a cocktail name in local storage.
let removeCocktail = function (name) {
  let flag = false; // This flag is used to check if the drink is already in local storage
  if (dataStorage) {
    let index = dataStorage.indexOf(name);
    if (index > -1) {
      //*! only splice array when item is found
      dataStorage.splice(index, 1); //*! 2nd parameter means remove one item only
    }
    localStorage.setItem("cocktailName", JSON.stringify(dataStorage));
    alerts.innerHTML = `<div class="p-3 bg-green-300 border-green-900 text-green-700 font-bold rounded">Cocktail removed!</div>`;
    setTimeout(() => {
      alerts.innerHTML = "";
    }, 3000); // This line clears the alerts after 3 seconds
  }

  // This loads the cocktails again.
  loadCocktails();
};

//* CODE CHUNK STARTS ⤵️: This function block displays all saved cocktails
function loadCocktails() {
  saved.innerHTML = ""; // Clears everything in saved cocktails field
  if (dataStorage.length > 0) {
    // This if statement checks if there are any saved cocktails
    for (let i = 0; i < dataStorage.length; i++) {
      saved.innerHTML += `<div class="lg:w-1/4 md:w-4/12 sm:w-1/2 p-3">
      <div class="bg-blue-500 rounded">
          <button class="bg-blue-500 rounded py-5 px-7 hover:bg-blue-600 font-bold text-white w-full" onclick="getFavorites('${dataStorage[i]}')">${dataStorage[i]}</button>
          <button class="bg-red-500 p-2 text-sm font-medium rounded w-full hover:bg-red-600 text-white" onclick="removeCocktail('${dataStorage[i]}')">Remove</button>
      </div>
  </div>`;
    }
  } else {
    saved.innerHTML += `<div class="lg:w-1/4 md:w-4/12 sm:w-1/2 p-3">
          No cocktails present!
      </div>`;
  }
}
//* CODE CHUNK ENDS ⤴️: This function block displays all saved cocktails

/*CODE BLOCK ENDS ⤴️: *************** This code block saves retrievable cocktails to local storage *************** :⤴️ CODE BLOCK ENDS*/

/*CODE BLOCK STARTS ⤵️: *************** This code block fetches list of cocktails by alphabet letter *************** :⤵️ CODE BLOCK STARTS*/

// fetch list of cocktail by the first letter
function alphaDrink(letter) {
  resultsCard.classList.remove("hidden");
  for (let i = 0; i <= 20; i++) {
    // Get Drink for Selected letter
    fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?f=" + letter)
      .then((response) => response.json())
      .then((data) => displayData(data, i));
  }
  let num = 0;
  let limit = 20;
  totalText.innerHTML = ``;
  filter.innerHTML = `<option value="All" selected>All</option>`;
  for (let a = 0; a <= limit; a += 10) {
    if (a > limit || a + 10 > limit) {
      num = limit;
    } else if (a == 0) {
      num = 5;
    } else {
      num = a;
    }
    filter.innerHTML += `<option value="${num}">${num}</option>`;
  }
  document.getElementById("filter-cont").style.display = "flex"; //*! This line displays the filter
  filter.style.display = "block";
  totalText.innerHTML = `${limit} Drinks Found!`;
}

/*CODE BLOCK ENDS ⤴️: *************** This code block fetches list of cocktails by alphabet letter *************** :⤴️ CODE BLOCK ENDS*/

/*CODE BLOCK STARTS ⤵️: *************** This code block contains event listeners *************** :⤵️ CODE BLOCK STARTS*/

// EVENT LISTENERS
// init

//* CODE CHUNK STARTS ⤵️: This function block listens for a click on the Get Random Cocktail button
randomBtn.addEventListener("click", function () {
  drinkList.innerHTML = "";
  let limit = 1;
  document.getElementById("filter-cont").style.display = "none"; //*! This line hides the filter
  filter.style.display = "none";
  totalText.innerHTML = ``;
  for (let i = 0; i < limit; i++) {
    randomCocktail();
  }
});
//* CODE CHUNK ENDS ⤴️: This function block listens for a click on the Get Random Cocktail button

//* CODE CHUNK STARTS ⤵️: This function block listens for a click on the Clear Favorites button
clearBtn.addEventListener("click", function () {
  localStorage.removeItem("cocktailName");
  dataStorage = [];
  localStorage.setItem("cocktailName", JSON.stringify(dataStorage));
  // saved.innerHTML = "";
  drinkList.innerHTML = "";
  resultsCard.classList.add("hidden");
  loadCocktails();
});
//* CODE CHUNK ENDS ⤴️: This function block listens for a click on the Clear Favorites button

searchForm.addEventListener("submit", mainSearch); // This event listener searches for cocktails

//* CODE CHUNK STARTS ⤵️: This function block listens for a click on the alphabet buttons
alphabets.addEventListener("change", function () {
  drinkList.innerHTML = "";
  mainSearchInit();
  // This event listener searches for cocktails by alphabet
  let letter = alphabets.value;
  alphaDrink(letter); // This function block listens for a click on the alphabet buttons
});
//* CODE CHUNK ENDS ⤴️: This function block listens for a click on the Clear Favorites button

loadCocktails(); // This event listener loads all saved cocktails
mainSearchInit(); // This event listener loads the main search page

/*CODE BLOCK ENDS ⤴️: *************** This code block contains event listeners *************** :⤴️ CODE BLOCK ENDS*/

//* CODE CHUNK STARTS ⤵️: This function block toggles, opens and closes, the mobile hamburger menu
function open_menu() {
  menu_open.style.display = "none";
  menu_close.style.display = "block";
  menu.style.display = "flex";
  console.log(1);
}
function close_menu() {
  menu_close.style.display = "none";
  menu_open.style.display = "block";
  menu.style.display = "none";
}
//* CODE CHUNK ENDS ⤴️: This function block toggles, opens and closes, the mobile hamburger menu
