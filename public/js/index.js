let container = document.querySelector('.results');
let boxLength = container.offsetWidth;
const leftArrow = document.querySelector('#left-arrow');

leftArrow.addEventListener('click', () => {
    console.log(boxLength);
    container.scrollBy({
        left: boxLength * -0.5,
        behavior: "smooth"
    })
    // This condition makes scrolling circular 
    if (container.scrollLeft === 0) {
        container.scrollTo({
            left: container.scrollWidth,
            behavior: "smooth"
        })
    }
});
const rightArrow = document.querySelector('#right-arrow')
rightArrow.addEventListener('click', () => {
    container.scrollBy({
        left: boxLength * 0.5,
        behavior: "smooth"
    })

    // This condition makes scrolling circular
    if (container.scrollLeft > container.offsetWidth) {
        container.scrollTo({
            left: 0,
            behavior: "smooth"
        })
    }
});