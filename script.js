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

myModal.addEventListener('shown.bs.modal', () => {
  myInput.focus()
})
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

	// Replace any broken or visually invalid images with a fallback and style them
	const FALLBACK_SRC = 'imgs/Document.png';
	images.forEach(img => {
		// network/load error
		img.addEventListener('error', () => {
			console.warn('Carousel image failed to load, using fallback:', img.src);
			if (img.src.indexOf(FALLBACK_SRC) === -1) {
				img.src = FALLBACK_SRC;
				img.alt = 'placeholder image';
				img.classList.add('img-fallback');
			}
		});

		// image may load but render as a black/blank image in-browser (e.g., CMYK/JPEG issues)
		img.addEventListener('load', () => {
			// small threshold to catch corrupted or invalid images
			const tooSmall = (img.naturalWidth < 20 || img.naturalHeight < 20);
			if (tooSmall) {
				console.warn('Carousel image appears invalid (too small), replacing with fallback:', img.src);
				if (img.src.indexOf(FALLBACK_SRC) === -1) {
					img.src = FALLBACK_SRC;
					img.alt = 'placeholder image';
					img.classList.add('img-fallback');
				}
				return;
			}

			// Also test whether the image is mostly black by sampling pixels.
			// Draw the image to a small canvas and compute average brightness.
			try {
				const canvas = document.createElement('canvas');
				const ctx = canvas.getContext('2d');
				const SAMPLE_SIZE = 40; // draw to 40x40 for speed
				canvas.width = SAMPLE_SIZE;
				canvas.height = SAMPLE_SIZE;
				// draw the image scaled to the sample size
				ctx.drawImage(img, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
				const imgData = ctx.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE).data;
				let total = 0, count = 0;
				// sample every 4th pixel to reduce work
				for (let i = 0; i < imgData.length; i += 16) {
					const r = imgData[i];
					const g = imgData[i + 1];
					const b = imgData[i + 2];
					// perceived luminance
					const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
					total += lum;
					count++;
				}
				const avgLum = total / count; // 0-255
				// If average luminance is very low, image is likely black/invalid
				if (avgLum < 30) {
					console.warn('Carousel image appears mostly black (avgLum=' + Math.round(avgLum) + '), replacing with fallback:', img.src);
					if (img.src.indexOf(FALLBACK_SRC) === -1) {
						img.src = FALLBACK_SRC;
						img.alt = 'placeholder image';
						img.classList.add('img-fallback');
					}
				}
			} catch (e) {
				// cross-origin images may throw when reading pixels; ignore in that case
				// if images are cross-origin and you still see black, consider hosting them locally or enabling CORS
				// console.warn('Could not analyze image pixels:', e);
			}
		});
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

