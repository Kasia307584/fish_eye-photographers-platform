let page = null; // point to PhotographerDetailedPage obj

// comparasion functions using firstEl / secondEl as Image obj
function compareLikes(firstEl, secondEl) {
    return -(firstEl.likesCounter - secondEl.likesCounter); // revers sort
}

function compareDate(firstEl, secondEl) {
    return new Date(secondEl.date) - new Date(firstEl.date);
}

function compareTitle(firstEl, secondEl) {
    return firstEl.title.toUpperCase().localeCompare(secondEl.title.toUpperCase());
}

function Media(media, parentElem) {
    this.media = media; // single eleemnt of json media
    this.parentElem = parentElem;
    this.id = this.media.id;
    this.title =  this.media.title;
    this.likesCounter = this.media.likes; // number of likes
    this.date = this.media.date; // data of image
    this.imageElem = null; // dom elem with image/video, likes heart, ..
    this.likesCounterElem = null; // dom elem with number of likes
    this.isOnScreen = false;

    this.buildImageElem = function() {
        this.imageElem = document.createElement("div");
        this.imageElem.className = 'photo';

        let mediaLink = '';
        if ('image' in this.media) {  
            mediaLink = `<img src="../photos/${this.media.photographerId}/${this.media.image}" alt="TBD">`;
        } else { 
            mediaLink = `<video src="../photos/${this.media.photographerId}/${this.media.video}" alt="TBD"></video>`;
        }

        this.imageElem.innerHTML = `${mediaLink}
                                    <div class="info">
                                        <p>${this.title}</p>
                                        <div>
                                            <span>${this.likesCounter}</span>
                                            <i id="${this.id}" class="fas fa-heart"></i>
                                        </div>
                                    </div>`;

        // likes counter under the photo/video
        this.likesCounterElem = this.imageElem.querySelectorAll('div.info > div > span')[0];

        // heart icon under the photo
        let heartIconElem = this.imageElem.querySelectorAll('div.info > div > i')[0];

        // click event responsible for 'heart' clicking, which increase likes counter by 1
        heartIconElem.addEventListener( "click", (e) => page.updateLikesCounter(parseInt(e.target.id)) );
    }

    this.buildImageElem();

    this.showInGallery = function() {
        if (!this.isOnScreen) {
            this.parentElem.appendChild(this.imageElem);
            this.isOnScreen = true;
        }
    }

    this.hideInGallery = function() {
        if (this.isOnScreen) {
            this.parentElem.removeChild(this.imageElem);
            this.isOnScreen = false;
        }
    }

    this.updateLikesCounter = function() {
        this.likesCounter++;
        this.likesCounterElem.textContent = this.likesCounter;
    }
  }

// json - whole json obj
// photographerId - photographer's id from jason
function PhotographerDetailedPage(json, photographerId) {
    this.photographer = json['photographers'].find( (ph) => ph.id === photographerId ); // single photographer's json
    this.media = json.media.filter( (m) => m.photographerId === photographerId ); // all media 
    this.sectionTop = document.querySelector('section.top');
    this.sectionMain = document.querySelector('section.main');
    this.divPhotos = this.sectionMain.querySelector('div.photos');
    this.likesCounterElem = this.sectionMain.querySelectorAll('span.likes')[0]; // elem dispalying likes counter - cumulative number of all likes
    this.priceElem = this.sectionMain.querySelectorAll('span.price')[0]; // price per h
    this.likesCounter = this.media.reduce( (previousValue, currentValue) => previousValue + currentValue.likes, 0); // cumulative number of all likes
    this.images = []; // array of Image obj (dom elems with images/videos)
    this.idToImageMap = new Map();

    this.updateTopSection = function() { 
        // updating <section class="top">
        let htmlElem = document.createElement("div");
        
        let liTags = '\n';
        for (let tag of this.photographer.tags) { // cette méthode de for peut être utilisée pour les objets de type array
            liTags += `<li class="tag">#${tag}</li>`; 
            liTags += '\n';
        }

        htmlElem.innerHTML =`<div class="first_line">
                                <div class="name"><h1>${this.photographer.name}</h1></div>
                                <div class="contact_param"><p>Contactez-moi</p></div>
                            </div>
                            <p class="location">${this.photographer.city}, ${this.photographer.country}</p>
                            <p class="motto">${this.photographer.tagline}</p>
                            <ul class="tags"> ${liTags} </ul>`;

        this.sectionTop.appendChild(htmlElem);


        htmlElem = document.createElement("div");
        htmlElem.innerHTML =`<img src="../photos/Photographers_ID_Photos/${this.photographer.portrait}" alt="portrait_photographe" id="mimi_keel">`;

        this.sectionTop.appendChild(htmlElem);
    }

    this.updateTopSection();

    for (const m of this.media) {
        let mediaObj = new Media(m, this.divPhotos);
        this.images.push(mediaObj);
        this.idToImageMap.set(m.id, mediaObj);
    }

    // update counter with initil value
    this.likesCounterElem.textContent = this.likesCounter;

    // update proces
    this.priceElem.textContent = this.photographer.price + '€/jour'

    // for current photograpger (photographerId) populate <section class="top"> and <div class="photos">
    this.show = function(sortType) {
        this.images.forEach( (im) => im.hideInGallery() );

        switch (sortType) {
            case 'popularite':
                this.images.slice().sort(compareLikes).forEach( (im) => im.showInGallery() );
                break;            
            case 'date':
                this.images.slice().sort(compareDate).forEach( (im) => im.showInGallery() );
                break;            
            case 'titre':
                this.images.slice().sort(compareTitle).forEach( (im) => im.showInGallery() );
                break;            
            default: // == 'none'
                this.images.forEach( (im) => im.showInGallery() );
        }
    } 

    this.hide = function() { 
        this.images.forEach( (im) => im.hideInGallery() );
    }

    // update <span> elem with current cummulative value of likes
    this.updateLikesCounter = function(mediaId) {
        this.likesCounter++;
        this.likesCounterElem.textContent = this.likesCounter;
        this.idToImageMap.get(mediaId).updateLikesCounter();
    }
}


/**
 * @property {HTMLElement} element
 * @property {string[]} images Image's links of lightbox 
 */
class Lightbox {

    static init() {
        const links = Array.from(document.querySelectorAll('div.photos img[src$=".jpg"], div.photos video[src$=".mp4"]'));
        const gallery = links.map(link => link.getAttribute('src'));
        links.forEach(link => link.addEventListener('click', e => {
            e.preventDefault();
            new Lightbox(e.currentTarget.getAttribute('src'), gallery);
        }))
    }

    /**
     * 
     * @param {string} url Image's URL
     * @param {string[]} images Image's links of lightbox 
     * @param {string} url Currently displayed image
     */
    constructor(url, images) {
        this.element = this.buildDOM(url);
        this.images = images;
        this.loadImage(url);
        this.onKeyUp = this.onKeyUp.bind(this);
        document.body.appendChild(this.element);
        // disableBodyScroll(this.element);
        document.addEventListener('keyup', this.onKeyUp)
    }

    /**
     * 
     * @param {string} url Image's URL 
     */
    loadImage(url) {
        this.url = null;
        const image = new Image();
        const container = this.element.querySelector('.lightbox__container');
        container.innerHTML = '';
        image.onload = () => {
            container.appendChild(image)
            this.url = url
        }
        image.src = url;
    }
    /**
     * 
     * @param {KeyboardEvent} e 
     */
    onKeyUp(e) {
        if (e.key === 'Escape') {
            this.close(e);
        } else if (e.key === 'ArrowLeft') {
            this.prev(e);
        } else if (e.key === 'ArrowRight') {
            this.next(e);
        }
    }
    /**
     * 
     * @param {MouseEvent/KeyboardEvent} e 
     */
    close(e) {
        e.preventDefault();
        this.element.classList.add('fadeOut');
        // enableBodyScroll(this.element);
        window.setTimeout(() => {
            this.element.parentElement.removeChild(this.element)
        }, 500);
        document.removeEventListener('keyup', this.onKeyUp);
    }
    /**
     * 
     * @param {MouseEvent/KeyboardEvent} e 
     */
    next(e) {
        e.preventDefault();
        let i = this.images.findIndex(image => image === this.url);
        if(i === this.images.length - 1) {
            i = -1;
        }
        this.loadImage(this.images[i + 1])
    }
    /**
     * 
     * @param {MouseEvent/KeyboardEvent} e 
     */
     prev(e) {
        e.preventDefault();
        let i = this.images.findIndex(image => image === this.url);
        if(i === 0) {
            i = this.images.length;
        }
        this.loadImage(this.images[i - 1]);
    }

    buildDOM(url) {
        const dom = document.createElement('div');
        dom.classList.add('lightbox');
        dom.innerHTML = `   <button class="lightbox__close"><i class="fas fa-times"></i></button>
                            <button class="lightbox__next"><i class="fas fa-chevron-right"></i></button>
                            <button class="lightbox__prev"><i class="fas fa-chevron-right"></i></button>
                            <div class="lightbox__container">
                                <img src="${url}" alt=""> 
                            </div>`;
        dom.querySelector('.lightbox__close').addEventListener('click', this.close.bind(this));
        dom.querySelector('.lightbox__next').addEventListener('click', this.next.bind(this));
        dom.querySelector('.lightbox__prev').addEventListener('click', this.prev.bind(this));

        return dom;
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
    page.show('popularite');
    Lightbox.init();
});

// Contact form modal box
// DOM Elements => mets dans le then
const modalbg  = document.querySelector(".bground");
const modalBtn = document.querySelector(".filter p");
const closeIcon = document.querySelector(".close");

// launch modal event => mets dans le then
modalBtn.addEventListener("click", launchModal);

// launch modal form => peut etre en dehors de then
function launchModal() {
  modalbg.style.display = "block";
}

// close modal event => mets dans le then
closeIcon.addEventListener("click", closeModal);

// close modal form => peut etre en dehors de then
function closeModal() {
  modalbg.style.display = "none";
}