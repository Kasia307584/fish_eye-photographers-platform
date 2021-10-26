let page = null; // point to PhotographerDetailedPage obj

function PhotographerDetailedPage(json, photographerId) {
    this.sectionTop = document.querySelector('section.top');
    this.divPhotos = document.querySelector('div.photos');
    this.json = json;
    this.photographerId = photographerId; // photographer's id
    this.photographerJson = this.json['photographers'].find( (ph) => ph.id === this.photographerId );
    this.media = this.json.media.filter( (m) => m.photographerId === this.photographerId );

    // for current photograpger (photographerId) populate <section class="top"> and <div class="photos">
    this.show = function() {
        // updating <section class="top">
        let htmlElem = document.createElement("div");
        
        let liTags = '\n';
        for (let tag of this.photographerJson.tags) { // cette méthode de for peut être utilisée pour les objets de type array
            liTags += `<li class="tag">#${tag}</li>`; 
            liTags += '\n';
        }

        htmlElem.innerHTML =`<div class="first_line">
                                <div class="name"><h1>${this.photographerJson.name}</h1></div>
                                <div class="contact_param"><p>Contactez-moi</p></div>
                            </div>
                            <p class="location">${this.photographerJson.city}, ${this.photographerJson.country}</p>
                            <p class="motto">${this.photographerJson.tagline}</p>
                            <ul class="tags"> ${liTags} </ul>`;

        this.sectionTop.appendChild(htmlElem);


        htmlElem = document.createElement("div");
        htmlElem.innerHTML =`<img src="../photos/Photographers_ID_Photos/${this.photographerJson.portrait}" alt="portrait_photographe" id="mimi_keel">`;

        this.sectionTop.appendChild(htmlElem);

        // updating <div class="photos">
        for (let m of this.media) {
            htmlElem = document.createElement("div");
            htmlElem.className = 'photo';

            if ('image' in m) { // <img>
                htmlElem.innerHTML =`<div class="photo">
                                    <img src="../photos/${m.photographerId}/${m.image}" alt="TBD">
                                    <div class="info">
                                        <p>${m.title}</p>
                                        <div>
                                            <p>${m.likes}</p>
                                            <i></i>
                                        </div>
                                    </div>
                                </div>`;
            } else { // <video>
                htmlElem.innerHTML =`<div class="photo">
                                    <video src="../photos/${m.photographerId}/${m.video}" alt="TBD"></video>
                                    <div class="info">
                                        <p>${m.title}</p>
                                        <div>
                                            <p>${m.likes}</p>
                                            <i></i>
                                        </div>
                                    </div>
                                </div>`;
            }

            this.divPhotos.appendChild(htmlElem);
        }
    }                                                                 
}

fetch("../FishEyeData.json")
.then( (response) => response.json()) // fonction fléchée; fonction standard aurait été écrit comme suit: .then(function(response){return response.json()})
.then( (jsonObj)  =>  {                // jsonObj est l'objet retourné par le .then précedent

    const url = new URL(window.location.href); 
    let photographerId = url.searchParams.get("id"); // window.location.href.match(/id=(\d+)$/)[1];
    if (photographerId === null) {
        console.log(`Wrong or none id # in: ${window.location.href}`);
    }
    photographerId = parseInt(photographerId);

    page = new PhotographerDetailedPage(jsonObj, photographerId);
    page.show();
});