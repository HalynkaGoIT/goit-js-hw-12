import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const loader = document.querySelector('.loader');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more-btn');
const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
});

export function createGallery(images) {
    const markup = images.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      return `<li class="gallery-item">
        <a class="gallery-link" href="${largeImageURL}">
        <img class="img-item" src="${webformatURL}" alt="${tags}"/>
        </a>
        <p>Likes <span>${likes}</span></p>
        <p>View <span>${views}</span></p>
        <p>Comments <span>${comments}</span></p>
        <p>Downloads <span>${downloads}</span></p>
        </li>`
    }).join('');
    gallery.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh(); 
};

export function clearGallery() {
    gallery.innerHTML = "";
}
export function showLoader() {
    loader.classList.add('is-visible');   
}

export function hideLoader() {  
    loader.classList.remove('is-visible');
}

export function showLoadMoreButton() {
    if (loadMoreBtn) {
        loadMoreBtn.classList.add('is-visible');
        loadMoreBtn.style.display = 'block';    
    }
}

export function hideLoadMoreButton() {
    if (loadMoreBtn) {
        loadMoreBtn.classList.remove('is-visible');
        loadMoreBtn.style.display = 'none';
    }
}