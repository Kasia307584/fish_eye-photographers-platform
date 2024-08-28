# FishEye - photographers platform

This is a solution to the [OpenClassrooms](https://openclassrooms.com/) project. OpenClassrooms is one of the largest online schools in Europe, based in Paris.

## Overview

### Screenshot

![](/photos/screenshot.png)

### The challenge

Users should be able to:

- Read elements on the page using assistive technologies and navigate the multimedia slider using the keyboard 
- Filter items on the main page using tags
- View an image gallery for each item
- Visualize multimedia in a slider and switch between them
- Sort multimedia using the select menu
- Add likes to content
- Fill out the form and see error messages upon submission if fields are empty or contain incorrect input
- See a button that allows to jump back to the header after scrolling down the main page
- Navigate the application using images, buttons, and the logo
- See hover states and animations for interactive elements
- View the optimal layout for the website depending on their device's screen size

### Links

- Live Site URL: [See the live page here](https://kasia307584.github.io/fish_eye-photographers-platform/)

## My process

### Built with

- Vanilla JavaScript
- OOP & Factory Method
- HTML DOM API
- JSON data
- ESLint & Prettier
- CSS3, HTML5 & BEM methodology

### What I learned

- make the website accessible
- use Object-Oriented Programming and the Factory Method design pattern
```js
class MediaFactory {
  static create(mediaJson, parentElem, page) {
    if ("image" in mediaJson) {
      return new MediaImg(mediaJson, parentElem, page);
    }
    return new MediaVideo(mediaJson, parentElem, page);
  }
}
```
- inject HTML through JavaScript
- fetch `JSON` data
- use URL routing to change pages
- use JavaScript methods (e.g., `forEach()`, `push()`, `slice()`, `includes()`)
- use DOM interfaces properties and methods (e.g., `Element.classList.add()`, `Event.target.textContent`)
```js
if (this.selectedNavLiTagElem === e.target) {
      this.showAllPhotographers(); 
      this.selectedNavLiTagElem = null;
    } else {
      const tag = e.target.textContent.substring(1).toLowerCase();

      this.photographers.forEach(
        (ph) => ph.checkTag(tag) && ph.showInGallery()
      ); 
      e.target.classList.add("tag--active");

      this.selectedNavLiTagElem = e.target;
    }
```
- create a lightbox
- use a linter (`ESLint`) and code formatter (`Prettier`)
- create my first `package.json`
- use a live server
- use accessibility validators (`Achecker`, `WAVE`, screen readers)

### Continued development

For better readability, maintainability and scalability of the code:
- split the code into smaller pieces (currently over 500 lines in profile.js)
- use JavaScript modules
- organize the project structure by keeping HTML, CSS, and JS files in separate folders