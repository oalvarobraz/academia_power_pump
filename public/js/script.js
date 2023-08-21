

const carouselItems = document.querySelectorAll('.json-item');
let currentItem = 0;

function showItem(index) {
  carouselItems.forEach(item => {
    item.classList.remove('active');
  });

  carouselItems[index].classList.add('active');
}

function nextItem() {
  currentItem = (currentItem + 1) % carouselItems.length;
  showItem(currentItem);
}

function previousItem() {
  currentItem = (currentItem - 1 + carouselItems.length) % carouselItems.length;
  showItem(currentItem);
}


// ... restante do código ...

document.addEventListener('DOMContentLoaded', () => {
  showItem(currentItem);

  const nextButton = document.createElement('button');
  nextButton.innerText = '>';
  nextButton.className = 'carousel-button-next-button';
  nextButton.addEventListener('click', nextItem);

  const previousButton = document.createElement('button');
  previousButton.innerText = '<';
  previousButton.className = 'carousel-button-previous-button';
  previousButton.addEventListener('click', previousItem);

  const indicatorsContainer = document.getElementById('indicators');
  for (let i = 0; i < carouselItems.length; i++) {
    const indicator = document.createElement('div');
    indicator.className = 'carousel-indicator';
    indicator.addEventListener('click', () => {
      currentItem = i;
      showItem(currentItem);
    });
    indicatorsContainer.appendChild(indicator);
  }


  document.getElementById('json-carousel').appendChild(previousButton);
  document.getElementById('json-carousel').appendChild(nextButton);
});


