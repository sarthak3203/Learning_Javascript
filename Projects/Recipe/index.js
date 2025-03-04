const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');

//function to get recipes
const fetchRecipes = async (query) => {
  recipeContainer.innerHTML = "<h2>Fetching Recipes...</h2>";
  try {
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`) //always put https:// in the link otherwise it will not work
    const response = await data.json(); //await gives all data in one go and only works with async function
    //console.log(response)

    recipeContainer.innerHTML = "";
    response.meals.forEach(meal => {
      const recipeDiv = document.createElement('div'); //to create a div element recipeDiv
      recipeDiv.classList.add('recipe');
      recipeDiv.innerHTML = `
    <img src="${meal.strMealThumb}"> 
    <h3>${meal.strMeal}</h3>
    <p><span>${meal.strArea}</span> Dish</p>
    <p>Belongs to <span>${meal.strCategory}</span> Category</p>
    `
      const button = document.createElement('button');
      button.textContent = "View Recipe";
      recipeDiv.appendChild(button);

      //adding event listener to button

      button.addEventListener('click', () => {
        openRecipePopup(meal);

      })
      recipeContainer.appendChild(recipeDiv);
    })
  }
  catch (error) {
    recipeContainer.innerHTML = "<h2>No recipe found.Try searching another recipe!</h2>";
  }
}
//function to fetch ingredients and measurement
const fetchIngredients = (meal) => {
  let ingredientsList = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    if (ingredient) {
      const measure = meal[`strMeasure${i}`];
      ingredientsList += `<li>${measure} ${ingredient}<li>`

    }
  }
  return ingredientsList;

}
const openRecipePopup = (meal) => {
  recipeDetailsContent.innerHTML = `
      <h2 class="recipeName">${meal.strMeal}</h2>
      <h3>Ingredients:</h3>
      <ul class="ingredientList">${fetchIngredients(meal)}</ul>
      <div>
      <h3> Instructions: </h3>
      <p class="recipeInstructions"> ${meal.strInstructions}</p>

  `

  recipeDetailsContent.parentElement.style.display = "block";

}
recipeCloseBtn.addEventListener('click', () => {
  recipeDetailsContent.parentElement.style.display = "none";
})


searchBtn.addEventListener('click', (e) => {
  e.preventDefault(); //to prevent refreshing of page
  const searchInput = searchBox.value.trim();
  if (!searchInput) {
    recipeContainer.innerHTML = `<h2>Type the meal in search box first</h2>`
    return;
  }
  fetchRecipes(searchInput);
  //console.log("Button clicked");
})