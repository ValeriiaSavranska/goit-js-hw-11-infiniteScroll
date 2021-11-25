import './sass/main.scss';
import './js/components/scrollUpBtn';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import ImagesApiService from './js/services/api-service';
import BtnService from './js/components/interactive-btn';
import createMarkup from './js/components/createMarkup';

const formRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');

const imagesApiService = new ImagesApiService();
const loadMoreBtn = new BtnService({
  selector: '[data-action="load-more"]',
  hidden: true,
});

let gallery = null;

const searchImages = async e => {
  e.preventDefault();

  imagesApiService.resetPage();

  imagesApiService.query = e.currentTarget.elements.searchQuery.value.trim();
  if (!imagesApiService.query) {
    cleanMarkup();
    Notify.info('Sorry, there are no images matching your search query. Please try again.');
    return;
  }

  try {
    cleanMarkup();

    const { hits, total } = await imagesApiService.fetchImages();

    if (!hits.length) {
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return;
    }
    Notify.success(`Hooray! We found ${total} images.`);

    renderMarkup(hits);

    loadMoreBtn.show();
    checkLastPage(total, imagesApiService.page);

    gallery = new SimpleLightbox('.gallery a');
  } catch (error) {
    Notify.failure(error.message);
    cleanMarkup();
  }
};

const loadMoreImg = async () => {
  loadMoreBtn.disable();

  try {
    const { hits, total } = await imagesApiService.fetchImages();
    renderMarkup(hits);

    scrollDown();

    loadMoreBtn.enable();
    checkLastPage(total, imagesApiService.page);

    gallery.refresh();
  } catch (error) {
    Notify.failure(error.message);
    cleanMarkup();
  }
};

const renderMarkup = data => {
  const markup = createMarkup(data);
  galleryRef.insertAdjacentHTML('beforeend', markup);
};

const cleanMarkup = () => {
  galleryRef.innerHTML = '';
  loadMoreBtn.hide();
};

const checkLastPage = (totalImages, page) => {
  const totalPages = Math.ceil(totalImages / imagesApiService.per_page);
  if (page - 1 >= totalPages) {
    loadMoreBtn.hide();
  }
};

formRef.addEventListener('submit', searchImages);
loadMoreBtn.refs.button.addEventListener('click', loadMoreImg);

const scrollDown = () => {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};
