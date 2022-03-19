let page = null; // point to PhotographerDetailedPage obj

// comparasion functions using firstEl / secondEl as Image obj
function compareLikes(firstEl, secondEl) {
  return -(firstEl.getLikesCounter() - secondEl.getLikesCounter()); // revers sort
}

function compareDate(firstEl, secondEl) {
  return new Date(secondEl.date) - new Date(firstEl.date);
}

function compareTitle(firstEl, secondEl) {
  return firstEl.title
    .toUpperCase()
    .localeCompare(secondEl.title.toUpperCase());
}

class MediaBase {
  #mediaElem = null; // media dom elem represeting particular image or video
  #parentElem = null; // dom elem containing all img/video
  #likesCounterElem = null; // dom elem with number of likes - likes counter under the photo/video
  #likesCounter = -1; // number of likes
  id = -1;
  title = "TBD";
  date = "1984-10-19"; // data of image
  mediaSrc = "TBD";
  #isOnScreen = false;
  #page = null; // point to PhotographerDetailedPage obj

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
    return "<p> ERROR: Media::_buildMediaLinkElem is not defined by subclass</p>";
  }

  _buildMediaElem() {
    this.#mediaElem = document.createElement("div");
    this.#mediaElem.className = "photo";

    this.#mediaElem.innerHTML = `${this._buildMediaLinkElem()}
                                    <div class="info">
                                        <p>${this.title}</p>
                                        <div>
                                            <p>${this.#likesCounter}</p>
                                            <i class="fas fa-heart" aria-label="likes" tabindex="0" data-media-id="${
                                              this.id
                                            }"></i>
                                        </div>
                                    </div>`;

    this.#likesCounterElem =
      this.#mediaElem.querySelector("div.info > div > p");

    // heart icon under the photo
    const heartIconElem = this.#mediaElem.querySelector("div.info > div > i");

    // heart icon on click event responsible for increase likes counter
    heartIconElem.addEventListener("click", this.updateLikesCounter.bind(this));
    heartIconElem.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        this.updateLikesCounter(e);
      }
    });

    // image on click event invoking Lightbox
    this.#mediaElem
      .querySelector("img, video")
      .addEventListener("click", (e) => {
        e.preventDefault();
        new Lightbox(parseInt(e.target.dataset.mediaId), page);
      });
    this.#mediaElem
      .querySelector("img, video")
      .addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          new Lightbox(parseInt(e.target.dataset.mediaId), page);
        }
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

  updateLikesCounter() {
    this.#likesCounter++;
    this.#likesCounterElem.textContent = this.#likesCounter;
    this.#page.updateLikesCounter();
  }

  getLikesCounter() {
    return this.#likesCounter;
  }

  // method needs to be updated in a subclass
  mediaType() {
    return "TBD";
  }
}

class MediaImg extends MediaBase {
  constructor(mediaJson, parentElem, page) {
    super(mediaJson, parentElem, page);
    this.mediaSrc = `../photos/${mediaJson.photographerId}/${mediaJson.image}`;
    this._buildMediaElem();
  }

  _buildMediaLinkElem() {
    return `<img src="${this.mediaSrc}" alt="${this.title}, closeup view" tabindex="0" data-media-id="${this.id}">`;
  }

  mediaType() {
    return "img";
  }
}

class MediaVideo extends MediaBase {
  constructor(mediaJson, parentElem, page) {
    super(mediaJson, parentElem, page);
    this.mediaSrc = `../photos/${mediaJson.photographerId}/${mediaJson.video}`;
    this._buildMediaElem();
  }

  _buildMediaLinkElem() {
    return `<video src="${this.mediaSrc}" alt="${this.title}" tabindex="0" data-media-id="${this.id}"></video>`;
  }

  mediaType() {
    return "video";
  }
}

class MediaFactory {
  static create(mediaJson, parentElem, page) {
    if ("image" in mediaJson) {
      return new MediaImg(mediaJson, parentElem, page);
    }
    return new MediaVideo(mediaJson, parentElem, page);
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
    const photographer = json.photographers.find(
      (ph) => ph.id === photographerId
    ); // single photographer's json
    const mediaJson = json.media.filter(
      (m) => m.photographerId === photographerId
    ); // all media
    const sectionTop = document.querySelector("section.top");
    const sectionMain = document.querySelector("section.main");
    const priceElem = sectionMain.querySelector("p.price");
    const divPhotosElem = sectionMain.querySelector("div.photos");
    const dropdownList = sectionMain.querySelector("div.dropdown-content");

    this.#sortTypeElem = sectionMain.querySelector("button.dropbtn");

    // updating <section class="top">
    let htmlElem = document.createElement("div");

    let liTags = "\n";

    photographer.tags.forEach((tag) => {
      liTags += `<li class="tag" aria-label="tag">#${tag}</li>`;
      liTags += "\n";
    });

    htmlElem.innerHTML = `<div class="first_line">
                                <div class="name"><h1>${photographer.name}</h1></div>
                                <button name="Contact Me" type="button" class="contact_param">
                                    <p>Contactez-moi</p>
                                </button>
                            </div>
                            <p class="location">${photographer.city}, ${photographer.country}</p>
                            <p class="motto">${photographer.tagline}</p>
                            <ul class="tags"> ${liTags} </ul>`;

    sectionTop.appendChild(htmlElem);

    htmlElem = document.createElement("div");
    htmlElem.innerHTML = `<img src="../photos/Photographers_ID_Photos/${photographer.portrait}" alt="${photographer.name}">`;

    sectionTop.appendChild(htmlElem);

    // 'contact me' modal window
    this.#contactMeModalWin = new ModalContactMe(photographer.name);

    // register click event launching 'contact me' modal window
    document
      .querySelector("button.contact_param")
      .addEventListener(
        "click",
        this.#contactMeModalWin.show.bind(this.#contactMeModalWin)
      );

    // register click event for dropdown menu
    this.#sortTypeElem.addEventListener("click", () => {
      dropdownList.style.display = "block";
      document.querySelector(".fa-chevron-down").style.display = "none";
      document.querySelector(".fa-chevron-up").style.display = "inline-block";
    });
    // register click events for sorting type (Trier par)
    document
      .querySelector(".dropdown-content__popularite")
      .addEventListener("click", () => {
        const show = this.show.bind(this);
        show("popularite");
        dropdownList.style.display = "none";
      });
    document
      .querySelector(".dropdown-content__date")
      .addEventListener("click", () => {
        const show = this.show.bind(this);
        show("date");
        dropdownList.style.display = "none";
      });
    document
      .querySelector(".dropdown-content__titre")
      .addEventListener("click", () => {
        const show = this.show.bind(this);
        show("titre");
        dropdownList.style.display = "none";
      });

    mediaJson.forEach((m) =>
      this.#media.push(MediaFactory.create(m, divPhotosElem, this))
    );

    // update counter stuff
    this.#likesCounter = mediaJson.reduce(
      (previousValue, currentValue) => previousValue + currentValue.likes,
      0
    ); // cumulative number of all likes and initial value
    this.#likesCounterElem = sectionMain.querySelector("p.likes");
    this.#likesCounterElem.textContent = this.#likesCounter;

    // update price
    priceElem.textContent = photographer.price + "€ / jour";
  }

  // for current photograpger (photographerId) populate <section class="top"> and <div class="photos">
  show(sortType) {
    this.#media.forEach((m) => m.hideInGallery());

    switch (sortType) {
      case "popularite":
        this.#sortTypeElem.firstChild.nodeValue = "Popularité";
        this.#media.sort(compareLikes).forEach((m) => m.showInGallery());
        break;
      case "date":
        this.#sortTypeElem.firstChild.nodeValue = "Date";
        this.#media.sort(compareDate).forEach((m) => m.showInGallery());
        break;
      case "titre":
        this.#sortTypeElem.firstChild.nodeValue = "Titre";
        this.#media.sort(compareTitle).forEach((m) => m.showInGallery());
        break;
      default:
        // == 'none'
        this.#sortTypeElem.firstChild.nodeValue = "Popularité";
        this.#media.sort(compareLikes).forEach((m) => m.showInGallery());
    }
  }

  hide() {
    this.#media.forEach((m) => m.hideInGallery());
  }

  // update <span> elem with current cummulative value of likes
  updateLikesCounter() {
    this.#likesCounter++;
    this.#likesCounterElem.textContent = this.#likesCounter;
  }

  // return pair {mediaType, mediaSrc} for current position
  #getMediaForCurrPos() {
    return {
      mediaType: this.#media[this.#currMediaPos].mediaType(),
      mediaSrc: this.#media[this.#currMediaPos].mediaSrc,
      title: this.#media[this.#currMediaPos].title,
    };
  }

  // on the base media's ID (mediaId) set current position to iterate media prev/next
  // return pair {mediaType, mediaSrc} of currently set position
  setMediaPos(mediaId) {
    this.#currMediaPos = this.#media.findIndex((m) => m.id === mediaId);
    return this.#getMediaForCurrPos();
  }

  getPrevMedia() {
    if (this.#currMediaPos === 0) {
      this.#currMediaPos = this.#media.length;
    }
    this.#currMediaPos--;

    return this.#getMediaForCurrPos();
  }

  getNextMedia() {
    if (this.#currMediaPos === this.#media.length - 1) {
      this.#currMediaPos = -1;
    }
    this.#currMediaPos++;

    return this.#getMediaForCurrPos();
  }
}

class Lightbox {
  #page = null; // point to PhotographerDetailedPage obj
  #element = null; // dom element with lightbox
  #container = null; // container for media
  #title = null; // media's title under img/video

  // mediaId - media id from json
  // page - PhotographerDetailedPage obj
  constructor(mediaId, page) {
    // (url, images)
    this.#page = page;
    this.#element = this.#buildDOM();
    this.#container = this.#element.querySelector(".lightbox__container");
    this.#title = this.#element.querySelector("p.lightbox__title");

    this.onKeyUp = this.onKeyUp.bind(this);
    document.addEventListener("keyup", this.onKeyUp);

    this.#loadImage(this.#page.setMediaPos(mediaId));

    document.body.appendChild(this.#element);
  }

  // keybord navigation events
  onKeyUp(e) {
    if (e.key === "Escape") {
      this.close(e);
    } else if (e.key === "ArrowLeft") {
      this.prev(e);
    } else if (e.key === "ArrowRight") {
      this.next(e);
    }
  }

  // close lightbox on mouse/keyboard event
  close(e) {
    e.preventDefault();
    this.#element.classList.add("fadeOut");
    window.setTimeout(() => {
      this.#element.parentElement.removeChild(this.#element);
    }, 500);
    document.removeEventListener("keyup", this.onKeyUp);
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
    const htmlElem = document.createElement("div");
    htmlElem.classList.add("lightbox");

    htmlElem.innerHTML = `<div class="lightbox__content" aria-label="image closeup view">
                                <button class="lightbox__close"><i class="fas fa-times" aria-label="Close dialog"></i></button>
                                <button class="lightbox__next"><i class="fas fa-chevron-right" aria-label="Next image"></i></button>
                                <button class="lightbox__prev"><i class="fas fa-chevron-right" aria-label="Previous image"></i></button>
                                <div class="lightbox__container"></div>
                                <p class="lightbox__title"></p>
                            </div>`;

    htmlElem
      .querySelector(".lightbox__close")
      .addEventListener("click", this.close.bind(this));
    htmlElem
      .querySelector(".lightbox__next")
      .addEventListener("click", this.next.bind(this));
    htmlElem
      .querySelector(".lightbox__prev")
      .addEventListener("click", this.prev.bind(this));

    return htmlElem;
  }

  // loads image/video into lightbox
  #loadImage(media) {
    this.#container.innerHTML = "";

    let htmlElem = "";
    if (media.mediaType === "img") {
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
    this.bground = document.querySelector(".bground");

    document.querySelector("#modal-title__name").textContent = photographerName;

    const closeIcon = document.querySelector(".close");
    const submitBtn = document.querySelector("input.btn-submit");

    // close modal event
    closeIcon.addEventListener("click", this.close.bind(this));
    window.addEventListener("keyup", (e) => {
      if (e.key === "Escape") {
        this.close(e);
      }
    });

    // submit modal event
    submitBtn.addEventListener("click", this.submit.bind(this));
    submitBtn.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        this.submit.bind(this);
      }
    });
  }

  // launch modal form
  show() {
    this.bground.style.display = "block";
  }

  // submit the form, for a moment does nothing
  submit(e) {
    e.preventDefault();
    this.checkValidity();
    //document.querySelector("form").submit();
  }

  // close modal form
  close() {
    this.bground.style.display = "none";
  }

  // check validity of modal inputs
  checkValidity() {
    const firstNameInput = document.querySelector("#first_name");
    const lastNameInput = document.querySelector("#last_name");
    const emailInput = document.querySelector("#email");
    const yourMessageInput = document.querySelector("#your_message");

    const firstNameDiv = firstNameInput.parentElement;
    const lastNameDiv = lastNameInput.parentElement;
    const emailDiv = emailInput.parentElement;
    const yourMessageDiv = yourMessageInput.parentElement;

    // email regex
    let regex = /^([a-z0-9_.-]+@[\da-z.-]+\.[a-z.]{2,6})$/;

    let isValid = true;

    if (!firstNameInput.validity.valid) {
      isValid = false;
      firstNameDiv.setAttribute("data-error-visible", "true");
    } else {
      firstNameDiv.setAttribute("data-error-visible", "false");
    }

    if (!lastNameInput.validity.valid) {
      isValid = false;
      lastNameDiv.setAttribute("data-error-visible", "true");
    } else {
      lastNameDiv.setAttribute("data-error-visible", "false");
    }

    if (!regex.test(emailInput.value)) {
      isValid = false;
      emailDiv.setAttribute("data-error-visible", "true");
    } else {
      emailDiv.setAttribute("data-error-visible", "false");
    }

    if (!yourMessageInput.validity.valid) {
      isValid = false;
      yourMessageDiv.setAttribute("data-error-visible", "true");
    } else {
      yourMessageDiv.setAttribute("data-error-visible", "false");
    }

    if (isValid) {
      this.close();
    }
  }
}

fetch("../FishEyeData.json")
  .then((response) => response.json())
  .then((jsonObj) => {
    // jsonObj est l'objet retourné par le .then précedent

    const url = new URL(window.location.href);
    let photographerId = url.searchParams.get("id"); // window.location.href.match(/id=(\d+)$/)[1];
    if (photographerId === null) {
      console.log(`Wrong or none id # in: ${window.location.href}`);
    }
    photographerId = parseInt(photographerId);

    page = new PhotographerDetailedPage(jsonObj, photographerId);
    page.show("popularite");
  });
