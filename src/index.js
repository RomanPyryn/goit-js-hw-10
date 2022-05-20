import './css/styles.css';
import debounce from "lodash.debounce";
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const infoEl = document.querySelector('.country-list');

inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));


function onInput(e) {
    const name = e.target.value.trim();
    listEl.innerHTML = '';
    infoEl.innerHTML = '';


    if (name !== '') {
        fetchCountries(name)
        .then(onFetchSucces)
        .catch(onFetchError);
    };
}

function onFetchSucces(country) {
    if (country.length > 10) {
        Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
    };
    if (country.length > 2 && country.length < 10) {
        
        listEl.insertAdjacentHTML('beforeend', createListMarkup(country));
    };
    if (country.length == 1) {
        listEl.insertAdjacentHTML('beforeend', createBigNameMarkup(country));
        infoEl.insertAdjacentHTML('beforeend', createInfoMarkup(country));
    };
}

function onFetchError(error) {
    console.log(error);
    Notiflix.Notify.failure("Oops, there is no country with that name")
    
}

function createListMarkup(country) {
    return country.map(({ name, flags }) => {
        return `
        <li class="country-list__item">
            <img src="${flags.svg}" alt="${name.official}" width="25px" class="item__img">
            ${name.official}
        </li>
        `
    } ).join('');
};

function createBigNameMarkup(country) {
    return country.map(({ name, flags }) => {
        return `
        <li class="country-list__item--big">
            <img src="${flags.svg}" alt="${name.official}" width="35px" class="item__img">
            <span>${name.official}</span>
        </li>
        `
    } ).join('');
};

function createInfoMarkup(country) {
    return country.map(({ capital, population, languages }) => {
        return `
        <ul class="country-info">
        <li class="country-info__item">
            <span class="item__bold">Capital:</span> ${capital}
        </li>
        <li class="country-info__item">
            <span class="item__bold">Population:</span> ${population}
        </li>
        <li class="country-info__item">
            <span class="item__bold">Languages:</span> ${Object.values(languages).join(', ')}
        </li>
        </ul>
        `
    } ).join('');
};