const vueApp = Vue.createApp({

  created () {
    fetch('jsons/volunteer.json').then(response => response.json()).then(json => {
        this.services = json
    })

    fetch('jsons/students.json').then(response => response.json()).then(json => {
        this.helpers = json
    })
  },
  data() {
    return {
        services: [],
        helpers: []
      }
  },
  computed: {
   
  },
  methods: {
    /* Format dates */
    makeTextDate(dateArray){
      let month = ""
      let theDate = ""
      if(dateArray[1] === 1){
        month = "Jan."
      } else if (dateArray[1] === 2){
        month = "Feb."
      } else if (dateArray[1] === 3){
        month = "Mar."
      } else if (dateArray[1] === 4){
        month = "Apr."
      } else if (dateArray[1] === 5){
        month = "May"
      } else if (dateArray[1] === 6){
        month = "Jun."
      } else if (dateArray[1] === 7){
        month = "Jul."
      } else if (dateArray[1] === 8){
        month = "Aug."
      } else if (dateArray[1] === 9){
        month = "Sep."
      } else if (dateArray[1] === 10){
        month = "Oct."
      } else if (dateArray[1] === 11){
        month = "Nov."
      } else {
        month = "Dec."
      }

      theDate = month + " " + dateArray[2] + ", " + dateArray[0]
      return theDate
    },

    /* Rendering multiple hosts */
    renderHosts(hostsArray){
      let hostsText = ""

      if(hostsArray.length === 1){
        hostsText = hostsArray[0]
      } else {
        for(let i = 0; i < hostsArray.length; i++){
          if(i === hostsArray.length - 1){
            hostsText += "and " + hostsArray[i]
          } else {
            hostsText += hostsArray[i] + ", "
          }
        }
      }

      return hostsText
    }
}
});

vueApp.mount("#app");

const myModal = document.getElementById('myModal')
const myInput = document.getElementById('myInput')

if (myModal && myInput && typeof myModal.addEventListener === 'function') {
	try {
		myModal.addEventListener('shown.bs.modal', () => {
			try { myInput.focus(); } catch(e) { /* ignore focus errors */ }
		});
	} catch (e) {
		// defensive: if addEventListener throws, ignore so scripts continue
	}
}
// Mobile navbar toggle fix
document.addEventListener('DOMContentLoaded', () => {
	const navbarToggler = document.querySelector('.navbar-toggler');
	const navbarCollapse = document.getElementById('navbarNav');
	
	if (navbarToggler && navbarCollapse) {
		navbarToggler.addEventListener('click', () => {
			navbarCollapse.classList.toggle('show');
			// Force display flex when showing
			if (navbarCollapse.classList.contains('show')) {
				navbarCollapse.style.display = 'flex';
			} else {
				navbarCollapse.style.display = 'none';
			}
		});
	}
});

// Carousel functionality (moved from inline script in index.html)
document.addEventListener('DOMContentLoaded', () => {
	const carouselInner = document.getElementById('carouselInner');
	if (!carouselInner) return; // only run on pages with a carousel

	const prevBtn = document.getElementById('prevBtn');
	const nextBtn = document.getElementById('nextBtn');
	const carouselDots = document.getElementById('carouselDots');
	const images = carouselInner.querySelectorAll('img');

	console.log('Carousel: initializing - found', images.length, 'images');
	images.forEach((img, idx) => console.log('Carousel image', idx, img.src));

	// Replace any broken or visually invalid images with a fallback and style them
	const FALLBACK_SRC = 'imgs/Document.png';

	function replaceWithFallback(img) {
		if (img.src.indexOf(FALLBACK_SRC) === -1) {
			img.src = FALLBACK_SRC;
			img.alt = 'placeholder image';
			img.classList.add('img-fallback');
		}
	}

	function analyzeImage(img) {
		// small threshold to catch corrupted or invalid images
		const tooSmall = (img.naturalWidth < 20 || img.naturalHeight < 20);
		if (tooSmall) {
			console.warn('Carousel image appears invalid (too small), replacing with fallback:', img.src);
			replaceWithFallback(img);
			return;
		}

		// draw to canvas and compute average luminance
		try {
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			const SAMPLE_SIZE = 40; // draw to 40x40 for speed
			canvas.width = SAMPLE_SIZE;
			canvas.height = SAMPLE_SIZE;
			ctx.drawImage(img, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
			const imgData = ctx.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE).data;
			let total = 0, count = 0;
			for (let i = 0; i < imgData.length; i += 16) {
				const r = imgData[i];
				const g = imgData[i + 1];
				const b = imgData[i + 2];
				const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
				total += lum;
				count++;
			}
			const avgLum = total / count; // 0-255
			if (avgLum < 30) {
				console.warn('Carousel image appears mostly black (avgLum=' + Math.round(avgLum) + '), replacing with fallback:', img.src);
				replaceWithFallback(img);
			}
		} catch (e) {
			// canvas read may fail for cross-origin images; in that case, attempt to force-reload
			try {
				const forceImg = new Image();
				forceImg.onload = () => {
					// if the forced image loads with valid dimensions, analyze via canvas
					try {
						const canvas = document.createElement('canvas');
						const ctx = canvas.getContext('2d');
						const SAMPLE_SIZE = 40;
						canvas.width = SAMPLE_SIZE;
						canvas.height = SAMPLE_SIZE;
						ctx.drawImage(forceImg, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
						const imgData = ctx.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE).data;
						let total = 0, count = 0;
						for (let i = 0; i < imgData.length; i += 16) {
							const r = imgData[i];
							const g = imgData[i + 1];
							const b = imgData[i + 2];
							const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
							total += lum;
							count++;
						}
						const avgLum = total / count;
						if (avgLum < 30) replaceWithFallback(img);
					} catch (e2) {
						// still can't read pixels; fallback proactively
						replaceWithFallback(img);
					}
				};
				// add a cache-bust to avoid cached black render
				forceImg.src = img.src + ((img.src.indexOf('?') === -1) ? '?' : '&') + '_=' + Date.now();
				// if load errors, fallback
				forceImg.onerror = () => replaceWithFallback(img);
			} catch (e3) {
				replaceWithFallback(img);
			}
		}
	}

	images.forEach(img => {
		img.addEventListener('error', () => {
			console.warn('Carousel image failed to load, using fallback:', img.src);
			replaceWithFallback(img);
		});

		img.addEventListener('load', () => analyzeImage(img));

		// If the image is already complete (cached), run the analysis immediately
		if (img.complete) {
			// small timeout to ensure properties like naturalWidth are available
			setTimeout(() => {
				analyzeImage(img);
			}, 20);
		}

		// Retry analysis after short delays in case the image becomes available later
		setTimeout(() => { try { analyzeImage(img); } catch(e){ console.warn('retry analyze failed', e); } }, 500);
		setTimeout(() => { try { analyzeImage(img); } catch(e){ console.warn('retry analyze failed', e); } }, 1500);
	});

	let currentIndex = 0;
	const totalImages = images.length;

	// Create dots
	for (let i = 0; i < totalImages; i++) {
		const dot = document.createElement('div');
		dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
		dot.addEventListener('click', () => goToSlide(i));
		carouselDots.appendChild(dot);
	}

	const dots = carouselDots.querySelectorAll('.carousel-dot');

	function updateCarousel() {
		const offset = -currentIndex * 100;
		carouselInner.style.transform = `translateX(${offset}%)`;

		// Update dots
		dots.forEach((dot, index) => {
			dot.classList.toggle('active', index === currentIndex);
		});
	}

	function nextSlide() {
		currentIndex = (currentIndex + 1) % totalImages;
		updateCarousel();
	}

	function prevSlide() {
		currentIndex = (currentIndex - 1 + totalImages) % totalImages;
		updateCarousel();
	}

	function goToSlide(index) {
		currentIndex = index;
		updateCarousel();
	}

	prevBtn.addEventListener('click', prevSlide);
	nextBtn.addEventListener('click', nextSlide);
});

	// Fallback handler: ensure any element with data-bs-dismiss="modal" will close its nearest modal
	document.addEventListener('DOMContentLoaded', () => {
		// delegated handler: ensure any element with data-bs-dismiss="modal" closes its nearest modal
		document.addEventListener('click', (e) => {
			const btn = e.target.closest('[data-bs-dismiss="modal"]');
			if (!btn) return;
			const modalEl = btn.closest('.modal');
			if (!modalEl) return;
			try {
				const instance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
				instance.hide();
			} catch (err) {
				// fallback if bootstrap isn't available: remove show/display and backdrop
				modalEl.classList.remove('show');
				modalEl.style.display = 'none';
				const backdrop = document.querySelector('.modal-backdrop');
				if (backdrop) backdrop.parentNode.removeChild(backdrop);
			}
		});
	});

