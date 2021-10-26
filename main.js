
let page = null; // point to AllPhotographersPage obj

function Photographer(jsonPhotographerObj, parentElem) {
    this.json = jsonPhotographerObj;
    this.tags = this.json.tags;
    this.parentElem = parentElem;
    this.isOnScreen = false;

    this.createPhotographerElem = function() {
        let html = document.createElement("div");
        html.classList.add("card");
        
        let liTags = '\n';
    
        for (let tag of this.tags) { // cette méthode de for peut être utilisée pour les objets de type array
            liTags += `<li class="tag">#${tag}</li>`; 
            liTags += '\n';
        }

        html.innerHTML =`<div>
                            <a href="photographers_pages/profil.html?id=${this.json.id}">
                            <img src="photos/Photographers_ID_Photos/${this.json.portrait}" alt="portrait_photographe">
                            </a>
                        </div>
                        <p class="location"> ${this.json.city}, ${this.json.country} </p>
                        <p class="motto"> ${this.json.tagline} </p>
                        <p class="price"> ${this.json.price}€/jour </p>
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
    this.navliElems = document.querySelectorAll('nav ul li.tag');
    this.cardsSectionElem = document.querySelector("section.cards"); // section elem containing all photographers
    this.jsonObj = jsonObj;
    this.photographers = []; // photographer html elements
    this.selectedNavLiTagElem = null; // currently selected filter for photogrphers, 'none' mean show all

    this.jsonObj.photographers.forEach( (ph) => this.photographers.push(new Photographer(ph, this.cardsSectionElem)) );

    // register nav bar click events
    this.navliElems.forEach( (li) => li.addEventListener( "click", (e) => page.onFilter(e.target) ) );

    // register logo click event
    document.getElementsByClassName('logo-link')[0].addEventListener( "click", (e) => page.showAll() );

    this.show = function() { // show whole page with navi bar and all photographers
        this.photographers.forEach( (ph) => ph.showInGallery() );
    }

    this.hide = function() { // remove page leaving only logo
        this.photographers.forEach( (ph) => ph.hideInGallery() );
    }

    // used to serve tag filter buttons
    this.onFilter = function(target) { // target - li elem which triggered filter event
        this.selectedNavLiTagElem?.classList.remove("tag--active");
        this.photographers.forEach( (ph) => ph.hideInGallery() );

        if (this.selectedNavLiTagElem === target) {
            this.photographers.forEach( (ph) => ph.showInGallery() ); // show all
            this.selectedNavLiTagElem = null;
        } else {
            let tag = target.textContent.substring(1).toLowerCase();

            this.photographers.forEach( (ph) => ph.checkTag(tag) && ph.showInGallery() );   // filter
            target.classList.add("tag--active");

            this.selectedNavLiTagElem = target;
        }
    }

    // show all photoghrapher - used by logo click event
    this.showAll = function() { // show whole page with navi bar and all photographers
        if (this.selectedNavLiTagElem !== null) {
            this.selectedNavLiTagElem?.classList.remove("tag--active");
            this.hide();
            this.show();
        }
    }
}

fetch("./FishEyeData.json")
.then( (response) => response.json()) // fonction fléchée; fonction standard aurait été écrit comme suit: .then(function(response){return response.json()})
.then( (jsonObj)  =>  {                // jsonObj est l'objet retourné par le .then précedent
    page = new AllPhotographersPage(jsonObj);
    page.show();
});
