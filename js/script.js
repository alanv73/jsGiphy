const API_KEY = '4Eucvf78mFgNEQ63fIOsZIdwYUhlXCZB';
const SEARCH_MODE = 1;
const TRENDING_MODE = 2;
let numRecs = 5;
let offset = 0;
const section = $('#photos');
let display_mode = TRENDING_MODE;

let imgClicked = (url, height, width) => {
	if (width > height && width > 500) {
		let scale = 500 / width;
		width = 500;
		height *= scale;
	} else if (height > width && height > 500) {
		let scale = 500 / height;
		height = 500;
		width *= scale;
	}
	let singleG = $('#single-gif');
	let mainImg = $('#mainImg');
	mainImg.attr('src', '');
	mainImg.attr('src', url);
	document.getElementById(
		'single-gif'
	).style.height = `${height}px`;
	document.getElementById('mainImg').style.height = `${height}px`;
	singleG.slideToggle(true);
	document.getElementById('single-gif').style.width = `${width}px`;
	document.getElementById('mainImg').style.width = `${width}px`;
	// mainImg.click(() => closeImg());
};

let closeImg = () => {
	let singleG = $('#single-gif');
	singleG.slideToggle(false);
};

let getGifs = (endPoint) => {
	console.log(endPoint);
	$.getJSON(endPoint, (giphs) => {
		if (
			giphs.pagination.total_count >
			giphs.pagination.offset + giphs.pagination.count
		) {
			$('#more').toggle(true);
		}
		giphs.data.forEach((giph) => {
			// let preview = giph.images.fixed_height.url;
			let preview = giph.images.fixed_height_small.url;
			let img = document.createElement('img');
			img.src = preview;
			img.alt = 'giphy';
			img.addEventListener(
				'click',
				() =>
					imgClicked(
						giph.images.original.url,
						+giph.images.original.height,
						+giph.images.original.width
					),
				false
			);
			img.className = 'giphy';
			section.append(img);
		});
	});
};

let getTrendingGifs = () => {
	offset = 0;
	$('#criteria').val('');
	display_mode = TRENDING_MODE;
	section.html('');
	let h2 = document.createElement('h2');
	h2.textContent = 'Trending';
	section.append(h2);
	numRecs = +$('#recs').val();
	let endPoint = `https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=${numRecs}&rating=R&offset=${offset}`;
	getGifs(endPoint);
};

let getMore = () => {
	let criteria;
	offset += numRecs;
	let title = $('#photos h2').text();
	section.html('');
	let h2 = document.createElement('h2');
	h2.textContent = title;
	section.append(h2);
	if ($('#criteria').val()) {
		criteria = $('#criteria').val();
	}
	numRecs = +$('#recs').val();
	let endPoints = {
		1 : `http://api.giphy.com/v1/gifs/search?q=${criteria}&api_key=${API_KEY}&limit=${numRecs}&rating=R&offset=${offset}`,
		2 : `https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=${numRecs}&rating=R&offset=${offset}`
	};
	getGifs(endPoints[display_mode]);
};

let newSearch = () => {
	display_mode = SEARCH_MODE;
	let criteria = $('#criteria').val();
	numRecs = +$('#recs').val();
	let searchEndpoint = `http://api.giphy.com/v1/gifs/search?q=${criteria}&api_key=${API_KEY}&rating=R&limit=${numRecs}`;
	section.html('');
	let h2 = document.createElement('h2');
	h2.textContent = criteria;
	section.append(h2);

	getGifs(searchEndpoint);
};

$('#criteria').keyup((code) => {
	if (code.which === 13) {
		newSearch();
	}
});

$('#more').toggle(false);
getTrendingGifs();
