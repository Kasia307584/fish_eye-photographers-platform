// let jsonPhotoDb;
// let photographersSection = document.querySelector("section");
// let selectedTag = null;
// let photographers = [];

let manager = null;

function Photographer(jsonPhotographerObj, parentElem) {
    this.json = jsonPhotographerObj;
    this.tags = this.json['tags'];
    this.parentElem = parentElem;
    this.isOnScreen = false;

    this.createPhotographerElem = function() {
        let html = document.createElement("div");
        html.classList.add("card");
        
        let liTags = '';
    
        for (let tag of this.tags) { // cette méthode de for peut être utilisée pour les objets de type array
            liTags += `<li class="tag">#${tag}</li>`; 
        }
    
        html.innerHTML = `<div><a href="profil.html?id=${this.json["id"]}">
                          <img src="photos/Photographers_ID_Photos/${this.json["portrait"]}" alt="portrait_photographe">
                          </a></div>
                          <h2> ${this.json["name"]} </h2>
                          <p class="location"> ${this.json["city"]}, ${this.json["country"]} </p>
                          <p class="motto"> ${this.json["tagline"]} </p>
                          <p class="price"> ${this.json["price"]}€/jour </p>
                          <ul> ${liTags} </ul>`;
    
        return html;
    }

    this.elem = this.createPhotographerElem();

    this.showInGallery = function() {
        if (!this.isOnScreen) {
            this.parentElem.appendChild(this.elem);
            this.isOnScreen = true;
        }
    }

    this.hideInGallery = function() {
        if (this.isOnScreen) {
            this.parentElem.removeChild(this.elem);
            this.isOnScreen = false;
        }
    }

    this.checkTag = function(tag) {
        return this.tags.includes(tag);
    }
  }


function AllPhotographersPage(jsonObj) {
    this.headerElem = document.querySelector("header");
    this.navElem    = document.querySelector("nav");
    this.navliElems = this.navElem.querySelectorAll('.tag');
    this.mainElem   = document.querySelector("main");
    this.titleElem = document.createElement("div");
    this.titleElem.innerHTML = '<h1 class="title">Nos photographes</h1>';
    this.sectionElem = document.createElement("section"); // section elem containing all photographers
    this.json = jsonObj;
    this.photographers = [];
    this.prevSelectedTag = 'none'; // currently selected filter for photogrphers, 'none' mean show all
    this.isOnScreen = false;

    this.json["photographers"].forEach( (ph) => this.photographers.push(new Photographer(ph, this.sectionElem)) );

    // register nav bar click events
    this.navliElems.forEach( (li) => li.addEventListener( "click", (e) => manager.mainPage.filter(e.target) ) );

    this.show = function() { // show whole page with navi bar and all photographers
        if (!this.isOnScreen) {
            if (this.headerElem.childNodes.length === 1) {
                this.headerElem.appendChild(this.navElem);
            }

            this.mainElem.appendChild(this.titleElem);
            this.mainElem.appendChild(this.sectionElem);

            this.photographers.forEach( (ph) => ph.showInGallery() );

            this.isOnScreen = true;
        }
    }

    this.hide = function() { // remove page leaving only logo
        if (this.isOnScreen) {
            this.photographers.forEach( (ph) => ph.hideInGallery() );
            this.mainElem.removeChild(this.sectionElem);
            this.mainElem.removeChild(this.titleElem);
            this.headerElem.removeChild(this.navElem)

            this.isOnScreen = false;
        }
    }

    this.filter = function(target) { // target - li elem which triggered filter event
        let tag = target.textContent.substring(1).toLowerCase();
        
        if (tag === this.prevSelectedTag) {
            tag = 'none';
        }

        this.navliElems.forEach( (li) => li.classList.remove("tag--active") );
        this.photographers.forEach( (ph) => ph.hideInGallery() );

        if (tag !== 'none') {
            this.photographers.forEach( (ph) => { ph.checkTag(tag) && ph.showInGallery(); } );   // filter
            target.classList.add("tag--active");

        } else {
            this.photographers.forEach( (ph) => { ph.showInGallery(); } ); // show all
        }

        this.prevSelectedTag = tag;
    }
}

function PhotographerPage(jsonPhotographerObj, parentElem) {

}


function PhotographerSiteManager(jsonObj) {
    this.json = jsonObj;
    this.currentPage = 'main';
    this.mainPage = new AllPhotographersPage(this.json);
    this.photographersPages = new Map();

    this.showMainPage = function() {
        this.mainPage.show();
    }
}



// Creates html elem conatining single photographer and returning this html elem
// ph - json obj representing single photographer
// returning created elem representing ph photographer
/*
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
*/

/*
function showAllPhotographers() {
    photographers.forEach( (ph) => ph.hideInGallery() );
    photographers.forEach( (ph) => ph.showInGallery() );
}
*/
// Add all photographers whith paricular tag, when tag == null add all
// jsonObj - json obj with photographers db
// targetElem - html element to which appand
// tag - tag to show, when null show whole db
/*
function showPhotographersByTag(tag) {

    photographers.forEach( (ph) => ph.hideInGallery() );
    photographers.forEach( (ph) => { ph.checkTag(tag) && ph.showInGallery(); } );        
}
*/
/*    
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
*/

fetch("./FishEyeData.json")
.then( (response) => response.json()) // fonction fléchée; fonction standard aurait été écrit comme suit: .then(function(response){return response.json()})
.then( (jsonObj)  =>  {                // jsonObj est l'objet retourné par le .then précedent

    manager = new PhotographerSiteManager(jsonObj);
    manager.showMainPage();

/*
    jsonPhotoDb = jsonObj;

    jsonPhotoDb["photographers"].forEach( (ph) => photographers.push(new Photographer(ph, photographersSection)) );

    showAllPhotographers();

    document.querySelectorAll('.tag').forEach( 
        (li) => li.addEventListener("click",(e) => {
            //e.target.classList.add("class") => change couleur ds CSS / ici dans if else en dessous, enlever d'abord la class a tous le monde et puis si clique tu ajoute la class

            let tag = e.target.textContent.substring(1).toLowerCase();
            selectedTag = (selectedTag === tag) ? null : tag; // full version of that line is: if (selectedTag === tag) {selectedTag =  null;} else {selectedTag = tag;}

            if (selectedTag == null) {
                showAllPhotographers();
            } else {
                showPhotographersByTag(selectedTag);
            } 
            
        }) 
    );
*/
});

