
fetch("./FishEyeData.json")
.then(response => response.json()) // fonction fléchée; fonction standard aurait été écrit comme suit: .then(function(response){return response.json()})
.then(function profilPhotographes(jsonObj) { // jsonObj est l'objet retourné par le .then précedent
    let photographes = jsonObj["photographers"]; // on accède à l'objet photographers dans l'objet jsonObj

    photographes.forEach(photographe => {
        let html = document.createElement("div");

        html.innerHTML = `<div class="name"> ${photographe["name"]} </div><span class="city"> ${photographe["city"]}, </span><span class="country"> ${photographe["country"]} </span><div class="tagline"> ${photographe["tagline"]} </div><div class="price"> ${photographe["price"]}€/jour </div><div class="tags"> ${photographe["tags"]} </div>`;

        document.querySelector("section").appendChild(html);
    });
});