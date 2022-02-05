'use strict';

// disabled transition bedore loading page

window.addEventListener('load', () => {
	document.querySelector('#transition-none').removeAttribute('id');
});

