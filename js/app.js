'use strict';

const coreBody = document.querySelector('.core__body'),
	welcomeWallpaper = document.querySelector('.welcome__wallpaper');

//add cards to page
class card {

	constructor(src, title, average, count, overview) {
		this.src = src;
		this.title = title;
		this.average = average;
		this.overview = overview;
		this.reduceNumber(count);
		this.color = this.averageColor();
	}

	reduceNumber(num) {
		const leng = String(num).length;

		if (leng >= 5) {
			this.count = (Math.round(num / 1000)) + 'K';
		} else if (leng === 4) {
			this.count = (Math.round(num / 100) / 10) + 'K';
		} else {
			this.count = num;
		}
	}

	averageColor() {
		if (this.average >= 8) {
			return 'olivedrab';
		} else if (this.average < 6) {
			return 'firebrick';
		} else {
			return 'gold';
		}
	}

	render() {
		const element = document.createElement('div');

		element.classList.add('card');
		element.innerHTML = `
			<div class="card__wallpaper">
				<img class="card__img" src="https://www.themoviedb.org/t/p/w600_and_h900_face${this.src}" alt="${this.title}" loading="lazy">
			</div>
			<div class="card__footer">
				<div class="card__title">
					${this.title}
				</div>
				<div class="card__score">
		 			<div class="card__average" style="color: ${this.color}">
						${this.average}
					</div>
					<div class="card__count">
						${this.count}
					</div>
				</div>
			</div>
		`;

		coreBody.append(element);
	}
}

class welcome {

	constructor(src, title, average, count, year, overview) {
		this.src = src;
		this.title = title;
		this.average = average;
		this.year = String(year).slice(0, 4);
		this.count = count;
		this.overview = overview;
		this.color = this.averageColor();
	}

	averageColor() {
		if (this.average >= 8) {
			return 'olivedrab';
		} else if (this.average < 6) {
			return 'firebrick';
		} else {
			return 'gold';
		}
	}

	render() {
		welcomeWallpaper.style.background = `url("https://www.themoviedb.org/t/p/original${this.src}") 50% 20% / cover no-repeat`;

		const element = document.createElement('div');

		element.classList.add('welcome__body');
		element.innerHTML = `
		<div class="welcome__main">
			<div class="welcome__title">
			${this.title}
			</div>
			<div class="welcome__year">
				© ${this.year}
			</div>
			<div class="welcome__subtitle">
			${this.overview}
			</div>
		</div>
		<div class="welcome__footer">
			<div class="welcome__average" style="background: ${this.color}">
			${this.average}
			</div>
			<div class="welcome__count">
			${this.count}
			</div>
		</div>
		`;

		welcomeWallpaper.append(element);
	}
}

let welcomeIsTrue = true;


//get data from API
function cardsCount(query = '') {
	const number = Math.floor(document.documentElement.clientWidth / 335) * 4; //335 = card width + column gap
	let tempNumber;
	for (let i = 0; i < number / 20; i++) {
		const url = changerUrl(i, query);
		fetch(url)
			.then(res => res.json())
			.then(data => {
				if (welcomeIsTrue) {
					createWelcome(data);
					welcomeIsTrue = false;
				}
				tempNumber = ((number - (20 * i)) >= 20) ? 20 : number % 20;
				createCards(data, tempNumber);
			});
	}
}

function changerUrl(i, query) {
	if (query) {
		return `https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query=${query}&page=${i + 1}`;
	}
	return `https://api.themoviedb.org/3/discover/movie?page=${i + 1}&sort_by=popularity.desc&api_key=4aff51c20dec81f753b4cac50ca60b49`;
}

function createCards(data, temp) {
	for (let i = 0; i < temp; i++) {
		const movie = data.results[i];
		new card(movie.poster_path, movie.title, movie.vote_average, movie.vote_count).render();
	}
}

function createWelcome(data) {
	const movie = data.results[0];
	new welcome(movie.poster_path, movie.title, movie.vote_average, movie.vote_count, movie.release_date, movie.overview).render();
}

cardsCount();

//search movies
document.querySelector('.header__search').addEventListener('submit', (e) => {
	e.preventDefault();
	welcomeIsTrue = true;
	welcomeWallpaper.innerHTML = `
		<div class="welcome__header">
			THE MOST SUITABLE
 		</div>
	`;
	coreBody.innerHTML = '';
	cardsCount(document.querySelector('.header__input').value);
});

//welcome section


// disabled transition bedore loading page
window.addEventListener('load', () => {
	document.querySelector('#transition-none').removeAttribute('id');
});

