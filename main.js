let jsonPhotoDb;
let photographersSection = document.querySelector("section");
let selectedTag = null;

// Creates html elem conatining single photographer and returning this html elem
// ph - json obj representing single photographer
// returning created elem representing ph photographer
function createPhotographerElem(ph) {
    let html = document.createElement("div");
    html.classList.add("card");
    
    let liTags = '';

    for (let tag of ph['tags']) { // cette méthode de for peut être utilisée pour les objets de type array
        liTags += `<li class="tag">#${tag}</li>`; 
    }

    html.innerHTML = `<div><a href="profil.html?id=${ph["id"]}">
                      <img src="photos/Photographers_ID_Photos/${ph["portrait"]}" alt="portrait_photographe">
                      </a></div>
                      <h2> ${ph["name"]} </h2>
                      <p class="location"> ${ph["city"]}, ${ph["country"]} </p>
                      <p class="motto"> ${ph["tagline"]} </p>
                      <p class="price"> ${ph["price"]}€/jour </p>
                      <ul> ${liTags} </ul>`;

    return html;
}

// Add all photographers whith paricular tag, when tag == null add all
// jsonObj - json obj with photographers db
// targetElem - html element to which appand
// tag - tag to show, when null show whole db
function showPhotographersByTag(jsonObj, targetElem, tag = null) {
    let photographers = jsonObj["photographers"];

    // remove all photographer from targetElem
    while (targetElem.firstChild) {
        targetElem.firstChild.remove();
    }

    if (tag === null) {  // add all
        photographers.forEach((ph) => targetElem.appendChild( createPhotographerElem(ph) ) );
    } else {  // add only with tags
        photographers.forEach((ph) => {
            if ( ph['tags'].includes(tag) ) {
                targetElem.appendChild( createPhotographerElem(ph) );
            }
        });        
    }
}

fetch("./FishEyeData.json")
.then( (response) => response.json()) // fonction fléchée; fonction standard aurait été écrit comme suit: .then(function(response){return response.json()})
.then( (jsonObj)  =>  {                // jsonObj est l'objet retourné par le .then précedent
    jsonPhotoDb = jsonObj;

    showPhotographersByTag(jsonPhotoDb, photographersSection);

    document.querySelectorAll('.tag').forEach( 
        (li) => li.addEventListener("click",(e) => {
            //e.target.classList.add("class") => change couleur ds CSS / ici dans if else en dessous, enlever d'abord la class a tous le monde et puis si clique tu ajoute la class

            let tag = e.target.textContent.substring(1).toLowerCase();
            selectedTag = (selectedTag === tag) ? null : tag; // full version of that line is: if (selectedTag === tag) {selectedTag =  null;} else {selectedTag = tag;}

            showPhotographersByTag(jsonPhotoDb, photographersSection, selectedTag);
        }) 
    );
});

