import axios from 'axios';

export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }

  async fetchImages() {
    const BASE_URL = 'https://pixabay.com/api/';
    const API_KEY = '24464627-f47c997de86c962dcc3f2ff0b';
    const searchParams = new URLSearchParams({
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: this.per_page,
      page: this.page,
    });

    this.incrementPage();

    const { data } = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&${searchParams}`,
    );
    return data;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
