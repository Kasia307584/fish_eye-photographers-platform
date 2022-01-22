let page = null; // point to AllPhotographersPage obj
const STICKY_VISIBLE_SCROLL = 100; // number of px on scrolling

// represents a separate photographer's card; allows to show or hide each card in gallery
class Photographer {
  #parentElem = null; // dom elem which is the parent of photographer's dom elem
  #elem = null; // dom elem containing photogrpher data
  #tags = null; // photographer's tags from json (Array)
  #isOnScreen = false; // true when photographer is on screen

  constructor(jsonPhotographerObj, parentElem) {
    this.#tags = jsonPhotographerObj.tags.slice(); // copy of tags in JSON
    this.#parentElem = parentElem;

    this.#elem = document.createElement("div");
    this.#elem.classList.add("card");

    let liTags = "\n";

    for (let tag of this.#tags) {
      liTags += `<li class="tag">#${tag}</li>`;
      liTags += "\n";
    }

    this.#elem.innerHTML = `<div>
                                    <a href="photographers_pages/profil.html?id=${jsonPhotographerObj.id}">
                                        <img src="photos/Photographers_ID_Photos/${jsonPhotographerObj.portrait}" alt="">
                                        <h2>${jsonPhotographerObj.name}</h2>
                                    </a>
                                </div>
                                <p class="location"> ${jsonPhotographerObj.city}, ${jsonPhotographerObj.country} </p>
                                <p class="motto"> ${jsonPhotographerObj.tagline} </p>
                                <p class="price"> ${jsonPhotographerObj.price}€/jour </p>
                                <ul> ${liTags} </ul>`;
  }

  showInGallery() {
    if (!this.#isOnScreen) {
      this.#parentElem.appendChild(this.#elem);
      this.#isOnScreen = true;
    }
  }

  hideInGallery() {
    if (this.#isOnScreen) {
      this.#parentElem.removeChild(this.#elem);
      this.#isOnScreen = false;
    }
  }

  checkTag(tag) {
    return this.#tags.includes(tag);
  }
}

// represents the whole page (navigation, all photographer's cards); allows to filter by tag, display element on scrolling
class AllPhotographersPage {
  #photographers = []; // Array of Photographer objects
  #aStickyElem = null; // <a href="#header" id="sticky"><p>Passer au contenu</p></a>
  #selectedNavLiTagElem = null; // currently selected filter for photogrphers, 'none' means show all

  constructor(jsonObj) {
    const navliElems = document.querySelectorAll("nav ul li.tag");
    const cardsSectionElem = document.querySelector("section.cards"); // section elem containing all photographers
    const buttonLogoElem = document.querySelector("button.logo-link");

    jsonObj.photographers.forEach((ph) =>
      this.#photographers.push(new Photographer(ph, cardsSectionElem))
    ); // creates objects in the array #photographers

    // register nav bar click events
    navliElems.forEach((li) =>
      li.addEventListener("click", this.onApplyFilterToPhotographers.bind(this))
    ); // we need bind because of this. inside the callback

    // register logo click event
    buttonLogoElem.addEventListener(
      "click",
      this.onUndoAnyFiltering.bind(this)
    );

    // sticky stuff
    this.#aStickyElem = document.querySelector("#sticky");
    this.#aStickyElem.style.display =
      window.scrollY > STICKY_VISIBLE_SCROLL ? "block" : "none";

    // register scroll event to show/hide 'Passer au contenu' link at the top of document
    document.addEventListener("scroll", this.onDocScroll.bind(this));

    this.#showAllPhotographers();
  }

  // show whole page with navi bar and all photographers
  #showAllPhotographers() {
    this.#photographers.forEach((ph) => ph.showInGallery());
  }

  // remove page leaving only logo
  #hideAllPhotographers() {
    this.#photographers.forEach((ph) => ph.hideInGallery());
  }

  // used to apply tag filter (on click event)
  onApplyFilterToPhotographers(e) {
    this.#selectedNavLiTagElem?.classList.remove("tag--active");
    this.#hideAllPhotographers();

    if (this.#selectedNavLiTagElem === e.target) {
      this.#showAllPhotographers(); // show all
      this.#selectedNavLiTagElem = null;
    } else {
      let tag = e.target.textContent.substring(1).toLowerCase();

      this.#photographers.forEach(
        (ph) => ph.checkTag(tag) && ph.showInGallery()
      ); // filter
      e.target.classList.add("tag--active");

      this.#selectedNavLiTagElem = e.target;
    }
  }

  // undo any filtering and show all photoghraphera (logo click event)
  onUndoAnyFiltering(e) {
    if (this.#selectedNavLiTagElem !== null) {
      this.#selectedNavLiTagElem?.classList.remove("tag--active");
      this.#hideAllPhotographers();
      this.#showAllPhotographers();
    }
  }

  onDocScroll(e) {
    this.#aStickyElem.style.display =
      window.scrollY > STICKY_VISIBLE_SCROLL ? "block" : "none";
  }
}

fetch("./FishEyeData.json")
  .then((response) => response.json())
  .then((jsonObj) => {
    page = new AllPhotographersPage(jsonObj);
  });
