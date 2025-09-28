import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery, PER_PAGE } from './js/pixabay-api';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions';

const form = document.querySelector('.form');
const input = document.querySelector('[name="search-text"]');
const loadMoreBtn = document.querySelector('.load-more-btn');
const gallery = document.querySelector('.gallery');

let currentQuery = '';
let currentPage = 1;     
let totalPages = 0;      

hideLoadMoreButton();

function smoothScrollAfterLoad() {
  const firstCard = gallery.querySelector('.gallery-item');
  if (!firstCard) return;
  const { height } = firstCard.getBoundingClientRect();
  window.scrollBy({ top: height * 2, behavior: 'smooth' });
}

async function fetchAndRender({ doScroll = false } = {}) {
  showLoader();
  loadMoreBtn.disabled = true;

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    if (!Array.isArray(data.hits) || data.hits.length === 0) {
      
      if (currentPage === 1) {
        iziToast.info({
          title: 'No results',
          message:
            'Sorry, there are no images matching your search query. Please try again!',
          position: 'topRight',
        });
      } else {
        
        iziToast.info({
          title: 'Info',
          message: "We're sorry, but you've reached the end of search results.",
          position: 'topRight',
        });
      }
      hideLoadMoreButton();
      return;
    }

    createGallery(data.hits);

    if (currentPage === 1) {
      totalPages = Math.ceil(data.totalHits / PER_PAGE);
    }

    if (currentPage < totalPages) {
      showLoadMoreButton();
      loadMoreBtn.disabled = false;
    } else {
      hideLoadMoreButton();
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }

    currentPage += 1;

    if (doScroll) {
      smoothScrollAfterLoad();
    }
  } catch (err) {
    console.error(err);
    hideLoadMoreButton(); 
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
    loadMoreBtn.disabled = false;
  }
}

form.addEventListener('submit', async e => {
  e.preventDefault();

  const query = input.value.trim();
  if (!query) {
    iziToast.warning({
      title: 'Caution',
      message: 'Please type something to search.',
      position: 'topRight',
    });
    return;
  }

  currentQuery = query;
  currentPage = 1;   
  totalPages = 0;    
  clearGallery();
  hideLoadMoreButton();

  await fetchAndRender({ doScroll: false });
});

loadMoreBtn.addEventListener('click', async () => {
  if (totalPages && currentPage > totalPages) {
    hideLoadMoreButton();
    iziToast.info({
      title: 'Info',
      message: "We're sorry, but you've reached the end of search results.",
      position: 'topRight',
    });
    return;
  }

  await fetchAndRender({ doScroll: true });
});