// prototype for the Restaurant class
var Restaurant = {

    getFullAddress: function () {
        return this.streetAdress + "<br>" + this.city + ", " + this.state + "&nbsp;&nbsp;" + this.zip;
    }

};
//onload funtion grabs the cuisines information from server.
//when information is loaded calls upon build menu to setup the radio btns
window.onload = function() {
    var cuisineData;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("get", "cuisines", true);
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            //parsing before being sent off
            cuisineData = JSON.parse(xmlhttp.responseText);
            buildMenu(cuisineData);
        }
    }
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send(null);



};


function buildMenu(cuisines) {

    // get the menu element
    var menu = document.getElementById("cuisine-menu");
    //arbitrary value to help set the first radio to be checked
    var firstBtnChecked = false;
    //itterate thru the array creating appropriate buttons and accociating the
    //appropriate listener
    cuisines.forEach(function(cuisine) {
        var radiobutton = document.createElement("input");
        radiobutton.setAttribute("type","radio");
        radiobutton.setAttribute("id",cuisine);
        radiobutton.setAttribute("name","cuisine");
        radiobutton.setAttribute("value",cuisine);
        radiobutton.onclick = function(){selectCuisine(this)};
        //this checks the first button and calls up the data for that button
        if(firstBtnChecked == false) {
            firstBtnChecked = true;
            radiobutton.setAttribute("checked","true");
            selectCuisine(radiobutton);
        }
        //Add text to the radio buttons
        menu.appendChild(radiobutton);
        var span = document.createElement("radioText");
        span.innerText = " " +cuisine;
        menu.appendChild(span);
        menu.appendChild(document.createElement("hr"));
    });



}


function selectCuisine(radiobutton) {
    getRestaurants(radiobutton.value);
}


function getRestaurants( selectedCuisine ) {
    //array to hold all the restaraunts from the cuisine
    var arrOfRestaurants = [];
    //new XHR from restaurant selected
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("get", "restaurants/"+selectedCuisine, true);
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
           var restaurantData= JSON.parse(xmlhttp.responseText);
           restaurantData.forEach(function(currentRest){
            //setting each restaurnats as Restaurants object.
            //allows some methods used later on, and further prototyping
            Object.setPrototypeOf(currentRest,Restaurant);
            arrOfRestaurants.push(currentRest);
           });
           //call the show to diplay stuff
           showRestaurants(arrOfRestaurants)     
        }
    }
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send(null);
     

}

function showRestaurants( restaurants ) {

    var info = document.getElementById("restaurant-info");

    // clear the existing restaurant display
    info.innerHTML = "";

    // iterate through the restaurants
        
        
        // display a horizontal rule after all but the last review
        for(let i = 0; i < restaurants.length; i++) {
            //gives the Name and Adress a tag with info
            var restaurantAdress = document.createElement("h1");
            restaurantAdress.innerHTML =restaurants[i].name +"</br>"+ restaurants[i].getFullAddress();
            info.appendChild(restaurantAdress);
            //make this img work similar to a button
            //the onclick sends to the toggle down below
            var maxMinBtn = document.createElement("img");
            maxMinBtn.setAttribute("src", "/images/plus.png");
            maxMinBtn.setAttribute("value", i);
            maxMinBtn.setAttribute("id", "review-toggle-" + i);
            maxMinBtn.onclick = function(){toggleReview(i)};
            info.appendChild(maxMinBtn);
            
            //div to toss review info
            var review = document.createElement("div");
            review.setAttribute("id","review-"+i);
            review.style.display = "none";
            review.innerHTML =restaurants[i].reviews;
            info.appendChild(review);
            //divide it up using hr
            var hr = document.createElement("hr");
            info.appendChild(hr);
        }
}


// use this function to show and hide the review
//this was given to us, implimented above
function toggleReview(i) {

    // set the 'toggle' image
    var toggleImg = document.getElementById("review-toggle-"+i);

    var display = "none";
    var src     = "/images/plus.png"

    if( toggleImg.getAttribute("src").indexOf("plus") > -1 ) {
        // currently displaying plus
        src     = "/images/minus.png"
        display = "block";
    }

    toggleImg.setAttribute("src",src);

    // show/hide the review
    var reviewDiv = document.getElementById("review-"+i)
    reviewDiv.style.display = display;

}