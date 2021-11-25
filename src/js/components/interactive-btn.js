export default class BtnService {
  constructor({ selector, hidden = false, text = 'Load more' }) {
    this.refs = this.getRefs(selector);
    this.text = text;
    hidden && this.hide();
  }

  getRefs(selector) {
    const refs = {};
    refs.button = document.querySelector(selector);
    refs.label = refs.button.querySelector('.label');
    refs.spinner = refs.button.querySelector('.spinner-grow');
    return refs;
  }

  enable() {
    this.refs.button.disabled = false;
    this.refs.label.textContent = this.text;
    this.refs.spinner.classList.add('is-hidden');
  }

  disable() {
    this.refs.button.disabled = true;
    this.refs.label.textContent = 'Loading...';
    this.refs.spinner.classList.remove('is-hidden');
  }

  show() {
    this.refs.button.classList.remove('is-hidden');
  }

  hide() {
    this.refs.button.classList.add('is-hidden');
  }
}
