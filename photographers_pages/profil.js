let page = null; // point to PhotographerDetailedPage obj


// comparasion functions using firstEl / secondEl as Image obj
function compareLikes(firstEl, secondEl) {
    return -(firstEl.getLikesCounter() - secondEl.getLikesCounter()); // revers sort
}


function compareDate(firstEl, secondEl) {
    return new Date(secondEl.date) - new Date(firstEl.date);
}


function compareTitle(firstEl, secondEl) {
    return firstEl.title.toUpperCase().localeCompare(secondEl.title.toUpperCase());
}


class MediaBase {
    #mediaElem = null;        // media dom elem represeting particular image or video
    #parentElem = null;       // dom elem containing all img/video
    #likesCounterElem = null; // dom elem with number of likes - likes counter under the photo/video
    #likesCounter = -1;        // number of likes
    id = -1;
    title = 'TBD';
    date = "1984-10-19";  // data of image
    mediaSrc = 'TBD';
    #isOnScreen = false;
    #page = null;         // point to PhotographerDetailedPage obj

    constructor(mediaJson, parentElem, page) {
        this.#parentElem = parentElem;
        this.id = mediaJson.id;
        this.title = mediaJson.title;
        this.#likesCounter = mediaJson.likes;
        this.date = mediaJson.date;
        this.#page = page;
    }

    // method needs to be updated in a subclass
    _buildMediaLinkElem() {
        return `<p> ERROR: Media::_buildMediaLinkElem is not defined by subclass</p>`;
    }

    _buildMediaElem() {
        this.#mediaElem = document.createElement("div");
        this.#mediaElem.className = 'photo';

        this.#mediaElem.innerHTML = `${this._buildMediaLinkElem()}
                                    <div class="info">
                                        <p>${this.title}</p>
                                        <div>
                                            <p>${this.#likesCounter}</p>
                                            <i class="fas fa-heart" data-media-id="${this.id}"></i>
                                        </div>
                                    </div>`;

        this.#likesCounterElem = this.#mediaElem.querySelector('div.info > div > p');

        // heart icon under the photo
        let heartIconElem = this.#mediaElem.querySelector('div.info > div > i');

        // heart icon on click event responsible for increase likes counter
        heartIconElem.addEventListener("click", this.updateLikesCounter.bind(this));

        // image on click event invoking Lightbox 
        this.#mediaElem.querySelector('img, video').addEventListener('click', e => {
            e.preventDefault();
            new Lightbox(parseInt(e.target.dataset.mediaId), page);
        });
    }

    showInGallery() {
        if (!this.#isOnScreen) {
            this.#parentElem.appendChild(this.#mediaElem);
            this.#isOnScreen = true;
        }
    }

    hideInGallery() {
        if (this.#isOnScreen) {
            this.#parentElem.removeChild(this.#mediaElem);
            this.#isOnScreen = false;
        }
    }

    updateLikesCounter(e) {
        this.#likesCounter++;
        this.#likesCounterElem.textContent = this.#likesCounter;
        this.#page.updateLikesCounter();
    }

    getLikesCounter() {
        return this.#likesCounter;
    }

    // method needs to be updated in a subclass
    mediaType() {
        return 'TBD';
    }
}


class MediaImg extends MediaBase {
    constructor(mediaJson, parentElem, page) {
        super(mediaJson, parentElem, page);
        this.mediaSrc = `../photos/${mediaJson.photographerId}/${mediaJson.image}`;
        this._buildMediaElem();
    }

    _buildMediaLinkElem() {
        return `<img src="${this.mediaSrc}" alt="${this.title}" data-media-id="${this.id}">`;
    }

    mediaType() {
        return 'img';
    }

}


class MediaVideo extends MediaBase {
    constructor(mediaJson, parentElem, page) {
        super(mediaJson, parentElem, page);
        this.mediaSrc = `../photos/${mediaJson.photographerId}/${mediaJson.video}`;
        this._buildMediaElem();
    }

    _buildMediaLinkElem() {
        return `<video src="${this.mediaSrc}" alt="${this.title}" data-media-id="${this.id}"></video>`;
    }

    mediaType() {
        return 'video';
    }
}

class MediaFactory {
    static create(mediaJson, parentElem, page) {
        if ('image' in mediaJson) {
            return new MediaImg(mediaJson, parentElem, page);
        } else {
            return new MediaVideo(mediaJson, parentElem, page);
        }
    }
}


class PhotographerDetailedPage {
    #sortTypeElem = null;
    #likesCounter = -1;
    #likesCounterElem = null; // elem dispalying likes counter - cumulative number of all likes
    #contactMeModalWin = null;
    #media = []; // array of Media obj (dom elems with images/videos)
    #currMediaPos = 0; // 

    constructor(json, photographerId) {
        const photographer = json['photographers'].find( (ph) => ph.id === photographerId ); // single photographer's json
        const mediaJson = json.media.filter( (m) => m.photographerId === photographerId ); // all media 
        const sectionTop = document.querySelector('section.top');
        const sectionMain = document.querySelector('section.main');
        const priceElem = sectionMain.querySelector('p.price'); // price per h
        const divPhotosElem = sectionMain.querySelector('div.photos');

        this.#sortTypeElem = sectionMain.querySelector('button.dropbtn');
    
        // updating <section class="top">
        let htmlElem = document.createElement("div");
        
        let liTags = '\n';
        for (let tag of photographer.tags) { // cette méthode de for peut être utilisée pour les objets de type array
            liTags += `<li class="tag">#${tag}</li>`; 
            liTags += '\n';
        }

        htmlElem.innerHTML =`<div class="first_line">
                                <div class="name"><h1>${photographer.name}</h1></div>
                                <button name="contactez_moi" type="button" class="contact_param">
                                    <p>Contactez-moi</p>
                                </button>
                            </div>
                            <p class="location">${photographer.city}, ${photographer.country}</p>
                            <p class="motto">${photographer.tagline}</p>
                            <ul class="tags"> ${liTags} </ul>`;

        sectionTop.appendChild(htmlElem);


        htmlElem = document.createElement("div");
        htmlElem.innerHTML =`<img src="../photos/Photographers_ID_Photos/${photographer.portrait}" alt="${photographer.name}" id="mimi_keel">`;

        sectionTop.appendChild(htmlElem);
        
        // 'contact me' modal window
        this.#contactMeModalWin = new ModalContactMe(photographer.name);
    
        // register click event launching 'contact me' modal window
        document.querySelector("button.contact_param").addEventListener("click", this.#contactMeModalWin.show.bind(this.#contactMeModalWin));
    
        // register click events for sorting type (Trier par)
        document.querySelector(".dropdown-content__popularite").addEventListener( "click", (e) => {let show = this.show.bind(this); show('popularite');} );
        document.querySelector(".dropdown-content__date").addEventListener( "click",       (e) => {let show = this.show.bind(this); show('date')} );
        document.querySelector(".dropdown-content__titre").addEventListener( "click",      (e) => {let show = this.show.bind(this); show('titre')} );
    
        mediaJson.forEach( (m) => this.#media.push( MediaFactory.create(m, divPhotosElem, this) ) );
   
        // update counter stuff
        this.#likesCounter = mediaJson.reduce( (previousValue, currentValue) => previousValue + currentValue.likes, 0); // cumulative number of all likes and initial value
        this.#likesCounterElem = sectionMain.querySelector('p.likes');
        this.#likesCounterElem.textContent = this.#likesCounter;
    
        // update price
        priceElem.textContent = photographer.price + '€ / jour'
    }

    // for current photograpger (photographerId) populate <section class="top"> and <div class="photos">
    show(sortType) {
        this.#media.forEach( (m) => m.hideInGallery() );

        switch (sortType) {
            case 'popularite':
                this.#sortTypeElem.firstChild.nodeValue = 'Popularité';
                this.#media.sort(compareLikes).forEach( (m) => m.showInGallery() );
                break;
            case 'date':
                this.#sortTypeElem.firstChild.nodeValue = 'Date';
                this.#media.sort(compareDate).forEach( (m) => m.showInGallery() );
                break;
            case 'titre':
                this.#sortTypeElem.firstChild.nodeValue = 'Titre';
                this.#media.sort(compareTitle).forEach( (m) => m.showInGallery() );
                break;
            default: // == 'none'
                this.#sortTypeElem.firstChild.nodeValue = 'Popularité';
                this.#media.sort(compareLikes).forEach( (m) => m.showInGallery() );
        }
    } 

    hide() { 
        this.#media.forEach( (m) => m.hideInGallery() );
    }

    // update <span> elem with current cummulative value of likes
    updateLikesCounter() {
        this.#likesCounter++;
        this.#likesCounterElem.textContent = this.#likesCounter;
    }

    // return pair {mediaType, mediaSrc} for current position
    #getMediaForCurrPos() {
        return { mediaType: this.#media[this.#currMediaPos].mediaType(), 
                 mediaSrc:  this.#media[this.#currMediaPos].mediaSrc,
                 title:     this.#media[this.#currMediaPos].title        };
    }

    // on the base media's ID (mediaId) set current position to iterate media prev/next
    // return pair {mediaType, mediaSrc} of currently set position
    setMediaPos(mediaId) {
        this.#currMediaPos = this.#media.findIndex( (m) => m.id === mediaId );
        return this.#getMediaForCurrPos();
    }

    getPrevMedia() {
        if(this.#currMediaPos === 0) {
            this.#currMediaPos = this.#media.length;
        }
        this.#currMediaPos--;

        return this.#getMediaForCurrPos();

    }

    getNextMedia() {
        if(this.#currMediaPos === this.#media.length - 1) {
            this.#currMediaPos = -1;
        }
        this.#currMediaPos++;

        return this.#getMediaForCurrPos();
    }
}


class Lightbox {
    #page = null;      // point to PhotographerDetailedPage obj
    #element = null;   // dom element with lightbox
    #container = null; // container for media
    #title = null;     // media's title under img/video

    // mediaId - media id from json
    // page - PhotographerDetailedPage obj
    constructor(mediaId, page) {  // (url, images)
        this.#page = page;
        this.#element = this.#buildDOM();
        this.#container = this.#element.querySelector('.lightbox__container');
        this.#title = this.#element.querySelector('p.lightbox__title');

        this.onKeyUp = this.onKeyUp.bind(this);
        document.addEventListener('keyup', this.onKeyUp)

        this.#loadImage(this.#page.setMediaPos(mediaId));

        document.body.appendChild(this.#element);
    }

    // keybord navigation events
    onKeyUp(e) {
        if (e.key === 'Escape') {
            this.close(e);
        } else if (e.key === 'ArrowLeft') {
            this.prev(e);
        } else if (e.key === 'ArrowRight') {
            this.next(e);
        }
    }

    // close lightbox on mouse/keyboard event 
    close(e) {
        e.preventDefault();
        this.#element.classList.add('fadeOut');
        window.setTimeout( () => { this.#element.parentElement.removeChild(this.#element) }, 500);
        document.removeEventListener('keyup', this.onKeyUp);
    }

    // load next image/video on mouse/keyboard event 
    next(e) {
        e.preventDefault();
        this.#loadImage(this.#page.getNextMedia());
    }

    // load previous image/video on mouse/keyboard event 
    prev(e) {
        e.preventDefault();
        this.#loadImage(this.#page.getPrevMedia());
    }

    #buildDOM() {
        const htmlElem = document.createElement('div');
        htmlElem.classList.add('lightbox');

        htmlElem.innerHTML =`<div class="lightbox__content">
                                <button class="lightbox__close"><i class="fas fa-times"></i></button>
                                <button class="lightbox__next"><i class="fas fa-chevron-right"></i></button>
                                <button class="lightbox__prev"><i class="fas fa-chevron-right"></i></button>
                                <div class="lightbox__container"></div>
                                <p class="lightbox__title"></p>
                            </div>`;

        htmlElem.querySelector('.lightbox__close').addEventListener('click', this.close.bind(this));
        htmlElem.querySelector('.lightbox__next' ).addEventListener('click', this.next.bind(this));
        htmlElem.querySelector('.lightbox__prev' ).addEventListener('click', this.prev.bind(this));

        return htmlElem;
    }

    // loads image/video into lightbox
    #loadImage(media) {
        this.#container.innerHTML = '';

        let htmlElem = '';
        if (media.mediaType === 'img') {
            htmlElem = `<img src="${media.mediaSrc}" alt="${media.title}">`;
        } else {
            htmlElem = `<video controls>
                            <source src="${media.mediaSrc}" type="video/mp4" width="620">
                            <p>Sorry, your browser doesn't support embedded videos.</p>
                        </video>`;
        }

        this.#container.innerHTML = htmlElem;
        this.#title.textContent = media.title;
    }
}


// Contact form modal box
class ModalContactMe {
    bground = null;

    constructor(photographerName) {
        this.bground  = document.querySelector(".bground");

        document.querySelector(".modal-title__name").textContent = photographerName;

        const closeIcon = document.querySelector(".close");
        const submitBtn = document.querySelector("input.btn-submit");

        // close modal event
        closeIcon.addEventListener("click", this.close.bind(this));

        // submit modal event
        submitBtn.addEventListener("click", this.submit.bind(this));
    }

    // launch modal form 
    show(e) {
        this.bground.style.display = "block";
    }

    // submit the form, for a moment does nothing
    submit(e) {
        e.preventDefault();
        this.close();
        //document.querySelector("form").submit();
    }

    // close modal form
    close(e) {
        this.bground.style.display = "none";
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
});


// json - whole json obj
// photographerId - photographer's id from jason
// function PhotographerDetailedPage(json, photographerId) {
//     this.photographer = json['photographers'].find( (ph) => ph.id === photographerId ); // single photographer's json
//     this.media = json.media.filter( (m) => m.photographerId === photographerId ); // all media 
//     this.sectionTop = document.querySelector('section.top');
//     this.sectionMain = document.querySelector('section.main');
//     this.divPhotos = this.sectionMain.querySelector('div.photos');
//     this.likesCounterElem = this.sectionMain.querySelector('p.likes'); // elem dispalying likes counter - cumulative number of all likes
//     this.priceElem = this.sectionMain.querySelector('p.price'); // price per h
//     this.sortTypeElem = this.sectionMain.querySelector('button.dropbtn');
//     this.likesCounter = this.media.reduce( (previousValue, currentValue) => previousValue + currentValue.likes, 0); // cumulative number of all likes
//     this.images = []; // array of Image obj (dom elems with images/videos)
//     this.idToImageMap = new Map();
//     this.contactMeModalWin = null;

//     this.updateTopSection = function() { 
//         // updating <section class="top">
//         let htmlElem = document.createElement("div");
        
//         let liTags = '\n';
//         for (let tag of this.photographer.tags) { // cette méthode de for peut être utilisée pour les objets de type array
//             liTags += `<li class="tag">#${tag}</li>`; 
//             liTags += '\n';
//         }

//         htmlElem.innerHTML =`<div class="first_line">
//                                 <div class="name"><h1>${this.photographer.name}</h1></div>
//                                 <button name="contactez_moi" type="button" class="contact_param">
//                                     <p>Contactez-moi</p>
//                                 </button>
//                             </div>
//                             <p class="location">${this.photographer.city}, ${this.photographer.country}</p>
//                             <p class="motto">${this.photographer.tagline}</p>
//                             <ul class="tags"> ${liTags} </ul>`;

//         this.sectionTop.appendChild(htmlElem);


//         htmlElem = document.createElement("div");
//         htmlElem.innerHTML =`<img src="../photos/Photographers_ID_Photos/${this.photographer.portrait}" alt="portrait_photographe" id="mimi_keel">`;

//         this.sectionTop.appendChild(htmlElem);
//     }

//     this.updateTopSection();

//     // 'contact me' modal window
//     this.contactMeModalWin = new ModalContactMe(this.photographer.name);

//     // register click event launching 'contact me' modal window
//     document.querySelector("button.contact_param").addEventListener("click", this.contactMeModalWin.show.bind(this.contactMeModalWin));

//     // register click events for sorting type (Trier par)
//     document.querySelector(".dropdown-content__popularite").addEventListener( "click", (e) => {let show = this.show.bind(this); show('popularite');} );
//     document.querySelector(".dropdown-content__date").addEventListener( "click",       (e) => {let show = this.show.bind(this); show('date')} );
//     document.querySelector(".dropdown-content__titre").addEventListener( "click",      (e) => {let show = this.show.bind(this); show('titre')} );

//     for (const m of this.media) {
//         let mediaObj = MediaFactory.create(m, this.divPhotos, this) // new Media(m, this.divPhotos);
//         this.images.push(mediaObj);
//         this.idToImageMap.set(m.id, mediaObj);
//     }

//     // update counter with initil value
//     this.likesCounterElem.textContent = this.likesCounter;

//     // update proces
//     this.priceElem.textContent = this.photographer.price + '€ / jour'

//     // for current photograpger (photographerId) populate <section class="top"> and <div class="photos">
//     this.show = function(sortType) {
//         this.images.forEach( (im) => im.hideInGallery() );

//         switch (sortType) {
//             case 'popularite':
//                 this.sortTypeElem.firstChild.nodeValue = 'Popularité';
//                 this.images.sort(compareLikes).forEach( (im) => im.showInGallery() );
//                 break;
//             case 'date':
//                 this.sortTypeElem.firstChild.nodeValue = 'Date';
//                 this.images.sort(compareDate).forEach( (im) => im.showInGallery() );
//                 break;
//             case 'titre':
//                 this.sortTypeElem.firstChild.nodeValue = 'Titre';
//                 this.images.sort(compareTitle).forEach( (im) => im.showInGallery() );
//                 break;
//             default: // == 'none'
//                 this.sortTypeElem.firstChild.nodeValue = 'Popularité';
//                 this.images.sort(compareLikes).forEach( (im) => im.showInGallery() );
//         }

//         //console.log(this.sortTypeElem.innerHTML);
//     } 

//     this.hide = function() { 
//         this.images.forEach( (im) => im.hideInGallery() );
//     }

//     // update <span> elem with current cummulative value of likes
//     this.updateLikesCounter = function() {
//         this.likesCounter++;
//         this.likesCounterElem.textContent = this.likesCounter;
//     }
// /*    
//     this.updateLikesCounter = function(mediaId) {
//         this.likesCounter++;
//         this.likesCounterElem.textContent = this.likesCounter;
//         this.idToImageMap.get(mediaId).updateLikesCounter();
//     }
// */
// }


// class implementing lightbox for images and video
// class Lightbox {

//     // mediaId - media id from json
//     // images - array of Images
//     constructor(mediaId, images) {  // (url, images)
//         this.images = images;
//         this.currIndex = images.findIndex( (el) => el.id === mediaId );
//         this.element = this.buildDOM(this.images[this.currIndex]);
//         this.container = this.element.querySelector('.lightbox__container');
//         this.title = this.element.querySelector('p.lightbox__title');
//         this.loadImage(this.images[this.currIndex]); // this.loadImage(url);
//         this.onKeyUp = this.onKeyUp.bind(this);
//         document.body.appendChild(this.element);
//         document.addEventListener('keyup', this.onKeyUp)
//     }

//     // loads image/video into lightbox
//     loadImage(imgObj) {  // loadImage(url)
//         this.container.innerHTML = '';

//         let media = '';
//         if (imgObj.mediaType === 'img') {
//             media = `<img src="${imgObj.mediaSrc}" alt="TBD">`;
//         } else {
//             media = `<video controls>
//                         <source src="${imgObj.mediaSrc}" type="video/mp4" width="620">
//                         <p>Sorry, your browser doesn't support embedded videos.</p>
//                     </video>`;
//         }

//         this.container.innerHTML = media;
//         this.title.textContent = imgObj.title;
//     }

//     // keybord navigation events
//     onKeyUp(e) {
//         if (e.key === 'Escape') {
//             this.close(e);
//         } else if (e.key === 'ArrowLeft') {
//             this.prev(e);
//         } else if (e.key === 'ArrowRight') {
//             this.next(e);
//         }
//     }

//     // close lightbox on mouse/keyboard event 
//     close(e) {
//         e.preventDefault();
//         this.element.classList.add('fadeOut');
//         // enableBodyScroll(this.element);
//         window.setTimeout(() => {
//             this.element.parentElement.removeChild(this.element)
//         }, 500);
//         document.removeEventListener('keyup', this.onKeyUp);
//     }

//     // load next image/video on mouse/keyboard event 
//     next(e) {
//         e.preventDefault();

//         if(this.currIndex === this.images.length - 1) {
//             this.currIndex = -1;
//         }
//         this.currIndex++;

//         this.loadImage(this.images[this.currIndex])
//     }

//     // load previous image/video on mouse/keyboard event 
//     prev(e) {
//         e.preventDefault();

//         if(this.currIndex === 0) {
//             this.currIndex = this.images.length;
//         }
//         this.currIndex--;

//         this.loadImage(this.images[this.currIndex]);
//     }

//     buildDOM(imgObj) {
//         const dom = document.createElement('div');
//         dom.classList.add('lightbox');

//         dom.innerHTML = `   <button class="lightbox__close"><i class="fas fa-times"></i></button>
//                             <button class="lightbox__next"><i class="fas fa-chevron-right"></i></button>
//                             <button class="lightbox__prev"><i class="fas fa-chevron-right"></i></button>
//                             <div class="lightbox__container"></div>
//                             <p class="lightbox__title"></p>`;

//         dom.querySelector('.lightbox__close').addEventListener('click', this.close.bind(this));
//         dom.querySelector('.lightbox__next').addEventListener('click', this.next.bind(this));
//         dom.querySelector('.lightbox__prev').addEventListener('click', this.prev.bind(this));

//         return dom;
//     }
// }



/*
function Media(media, parentElem) {
    this.media = media; // single eleemnt of json media
    this.parentElem = parentElem;
    this.id = this.media.id;
    this.title =  this.media.title;
    this.likesCounter = this.media.likes; // number of likes
    this.date = this.media.date; // data of image
    this.imageElem = null; // dom elem with image/video, likes heart, ..
    this.mediaSrc = '';
    this.mediaType = 'img';
    this.likesCounterElem = null; // dom elem with number of likes
    this.isOnScreen = false;

    this.buildImageElem = function() {
        this.imageElem = document.createElement("div");
        this.imageElem.className = 'photo';

        let mediaLink = '';
        if ('image' in this.media) {
            this.mediaSrc = `../photos/${this.media.photographerId}/${this.media.image}`;
            mediaLink = `<img src="${this.mediaSrc}" alt="TBD" data-media-id="${this.id}">`;
        } else {
            this.mediaType = 'video';
            this.mediaSrc = `../photos/${this.media.photographerId}/${this.media.video}`;
            mediaLink = `<video src="${this.mediaSrc}" alt="TBD" data-media-id="${this.id}"></video>`;
        }

        this.imageElem.innerHTML = `${mediaLink}
                                    <div class="info">
                                        <p>${this.title}</p>
                                        <div>
                                            <p>${this.likesCounter}</p>
                                            <i class="fas fa-heart" data-media-id="${this.id}"></i>
                                        </div>
                                    </div>`;

        // likes counter under the photo/video
        this.likesCounterElem = this.imageElem.querySelectorAll('div.info > div > p')[0];

        // heart icon under the photo
        let heartIconElem = this.imageElem.querySelectorAll('div.info > div > i')[0];

        // heart icon on click event responsible for increase likes counter
        heartIconElem.addEventListener( "click", (e) => page.updateLikesCounter(parseInt(e.target.dataset.mediaId)) );

        // image on click event invoking Lightbox 
        this.imageElem.querySelectorAll('img, video')[0].addEventListener('click', e => {
            e.preventDefault();
            new Lightbox(parseInt(e.target.dataset.mediaId), page.images);
        });
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
*/
