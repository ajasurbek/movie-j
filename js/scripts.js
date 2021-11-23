let elSearchForm = $_('.js-search-form');
let elSearchTitleInput = $_('.js-search-form__title-input', elSearchForm);
let elSearchRatingInput = $_('.js-search-form__rating-input', elSearchForm);
let elSearchGenreSelect = $_('.js-search-form__genre-select', elSearchForm);
let elSearchSortSelect = $_('.js-search-form__sort-select', elSearchForm);

let elSearchResults = $_('.search-results');


let elSearchResultTemplate = $_('#search-result-template').content;

let createGenreSelectOptions = function () {
  let movieCategories = [];

  normalizedMovies.forEach(function (movie) {
    movie.categories.forEach(function (category) {
      if (!movieCategories.includes(category)) {
        movieCategories.push(category);
      }
    });
  });

  movieCategories.sort();

  let elOptionsFragment = document.createDocumentFragment();

  movieCategories.forEach(function (category) {
    let elCategoryOption = createElement('option', '', category);
    elCategoryOption.value = category;

    elOptionsFragment.appendChild(elCategoryOption);
  });

  elSearchGenreSelect.appendChild(elOptionsFragment);
};

createGenreSelectOptions();


let renderResults = function (searchResults, searchRegex) {
  elSearchResults.innerHTML = '';

  let elResultsFragment = document.createDocumentFragment();

  searchResults.forEach((movie) => {
    let elMovie = elSearchResultTemplate.cloneNode(true);

    $_('.search-results__item', elMovie).dataset.imdbId = movie.imdbId;
    $_('.movie__poster', elMovie).src = movie.smallPoster;

    if (searchRegex.source === '(?:)') {
      $_('.movie__title', elMovie).textContent = movie.title;
    } else {
      $_('.movie__title', elMovie).innerHTML = movie.title.replace(searchRegex, `<mark class="px-0">${movie.title.match(searchRegex)}</mark>`);
    }

    $_('.movie__year', elMovie).textContent = movie.year;
    $_('.movie__rating', elMovie).textContent = movie.imdbRating;
    $_('.movie__trailer-link', elMovie).href = movie.trailer;

    elResultsFragment.appendChild(elMovie);
  });

  elSearchResults.appendChild(elResultsFragment);
};

let sortObjAZ = function (array) {
  return array.sort(function (a, b) {
    if (a.title > b.title) {
      return 1;
    } else if (a.title < b.title) {
      return -1;
    }
    return 0;
  });
};

let sortObjHighToLowRating = function (array) {
  return array.sort(function (a, b) {
    return b.imdbRating - a.imdbRating;
  });
};


let sortObjNewToOld = function (array) {
  return array.sort(function (a, b) {
    return b.year - a.year;
  });
};

let sortSearchResults = function (results, sortType) {
  if (sortType === 'az') {
    return sortObjAZ(results);
  } else if (sortType === 'za') {
    return sortObjAZ(results).reverse();
  } else if (sortType === 'rating_desc') {
    return sortObjHighToLowRating(results);
  } else if (sortType === 'rating_asc') {
    return sortObjHighToLowRating(results).reverse();
  } else if (sortType === 'year_desc') {
    return sortObjNewToOld(results);
  } else if (sortType === 'year_asc') {
    return sortObjNewToOld(results).reverse();
  }
};

let findMovies = function (title, minRating, genre) {
  return normalizedMovies.filter((movie) => {
    let doesMatchCategory = genre === 'All' || movie.categories.includes(genre);

    return movie.title.match(title) && movie.imdbRating >= minRating && doesMatchCategory;
  });
};


elSearchForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  let searchTitle = elSearchTitleInput.value.trim();
  let movieTitleRegex = new RegExp(searchTitle, 'gi');
  let minimumRating = Number(elSearchRatingInput.value);
  let genre = elSearchGenreSelect.value;
  let sorting = elSearchSortSelect.value;


  let searchResults = findMovies(movieTitleRegex, minimumRating, genre);
  searchResults = sortSearchResults(searchResults, sorting);

  renderResults(searchResults, movieTitleRegex);
});

let updateMovieModalContent = function (movie) {
  elMovieInfoModalTitle.textContent = movie.title;
};

let showMovieModal = function (eventTarget) {
  let movieImdbId = eventTarget.closest('.search-results__item').dataset.imdbId;


  let foundMovie = normalizedMovies.find(movie => movie.imdbId === movieImdbId);

  updateMovieModalContent(foundMovie);
};