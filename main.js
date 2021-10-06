let jsonPhotoDb;
// let photoObj = [];

function showAllPhotographers(photoDb) {
    let photographes = photoDb["photographers"]; // on accède à l'objet photographers dans l'objet jsonObj

    photographes.forEach(ph => {
        let html = document.createElement("div");
        html.classList.add("card");
        
        // photoObj.push( { json: ph, elem: html });

        let liTags = '';

        for (let tag of ph['tags']) { // cette méthode de for peut être utilisée pour les objets de type array
            liTags += `<li class="tag">#${tag}</li>`; 
        }

        html.innerHTML = `<div><a href="#">
                          <img src="photos/Photographers_ID_Photos/${ph["portrait"]}" alt="portrait_photographe">
                          </a></div>
                          <h2> ${ph["name"]} </h2>
                          <p class="location"> ${ph["city"]}, ${ph["country"]} </p>
                          <p class="motto"> ${ph["tagline"]} </p>
                          <p class="price"> ${ph["price"]}€/jour </p>
                          <ul> ${liTags} </ul>`;

        document.querySelector("section").appendChild(html);
    });

}

fetch("./FishEyeData.json")
.then(response => response.json()) // fonction fléchée; fonction standard aurait été écrit comme suit: .then(function(response){return response.json()})
.then(function profilPhotographes(jsonObj) { // jsonObj est l'objet retourné par le .then précedent
    jsonPhotoDb = jsonObj;

    showAllPhotographers(jsonObj);

    document.querySelectorAll('.tag').forEach( (li) => li.addEventListener("click",function(e) {
        console.log(e.target);
        let content = e.target.innerHTML;
        console.log(content);
        
        // mon essai :
        document.querySelectorAll(".card").forEach(card => { // forEach applique la fonction à chaque element de tableau array dans l'ordre
            let tags = card.querySelectorAll(".tag");
            console.log(tags)
        })
    }) );

/*    
    let photographes = jsonObj["photographers"]; // on accède à l'objet photographers dans l'objet jsonObj

    photographes.forEach(photographe => {
        let html = document.createElement("div");
        html.classList.add("card");

        html.innerHTML = `<h2> ${photographe["name"]} </h2><p class="location"> ${photographe["city"]}, ${photographe["country"]} </p><p class="motto"> ${photographe["tagline"]} </p><p class="price"> ${photographe["price"]}€/jour </p><ul> ${photographe["tags"]} </ul>`;

        document.querySelector("section").appendChild(html);
    });
*/
});

