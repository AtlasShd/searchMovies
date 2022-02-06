'use strict';

//add cards to page
class card {

	constructor(src, title, average, count) {
		this.src = src;
		this.title = title;
		this.average = average;
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

		document.querySelector('.core__body').append(element);
	}
}


//get data from API
function cardsCount() {
	const number = Math.floor(document.documentElement.clientWidth / 335) * 4; //335 = card width + column gap
	let tempNumber;
	for (let i = 0; i < number / 20; i++) {
		const url = `
		https://api.themoviedb.org/3/discover/movie?page=${i + 1}&sort_by=popularity.desc&api_key=4aff51c20dec81f753b4cac50ca60b49`;
		fetch(url)
			.then(res => res.json())
			.then(data => {
				tempNumber = ((number - (20 * i)) >= 20) ? 20 : number % 20;
				createCards(data, tempNumber);
			});
	}
}

function createCards(data, temp) {
	for (let i = 0; i < temp; i++) {
		const movie = data.results[i];
		new card(movie.poster_path, movie.title, movie.vote_average, movie.vote_count).render();
	}
}

cardsCount();

// disabled transition bedore loading page
window.addEventListener('load', () => {
	document.querySelector('#transition-none').removeAttribute('id');
});

