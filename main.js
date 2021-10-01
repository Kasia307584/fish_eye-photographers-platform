
fetch("./FishEyeData.json")
.then(response => {
    return response.json()
})
.then(function profilPhotographes(jsonObj) { 
    let photographes = jsonObj["photographers"]; 

    photographes.forEach(photographe => {
        let html = document.createElement("div");

        html.innerHTML = '<div class="name">' + photographe["name"] + '</div><span class="city">' + photographe["city"] + '</span><span class="country">' + photographe["country"] + '</span><div class="tagline">' + photographe["tagline"] + '</div><div class="price">' + photographe["price"] + '</div><div class="tags">' + photographe["tags"] + '</div>';
        
        document.querySelector("section").appendChild(html);
    });
});