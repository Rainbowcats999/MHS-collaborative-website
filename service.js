  // Only run speech-to-text on service.html
      const currentPage = window.location.pathname.split('/').pop() || 'service.html';
      
      if (currentPage === 'service.html') {
        // Speech-to-text functionality
        const searchInput = document.getElementById('searchInput');
        const micButton = document.getElementById('micButton');
        
        // Check browser support
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
          micButton.disabled = true;
          micButton.title = 'Speech recognition not supported in this browser';
          micButton.style.opacity = '0.5';
          micButton.style.cursor = 'not-allowed';
        } else {
          const recognition = new SpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = true;
          recognition.lang = 'en-US';
          
          let isListening = false;
          
          micButton.addEventListener('click', () => {
            if (isListening) {
              recognition.stop();
              isListening = false;
              micButton.classList.remove('listening');
            } else {
              searchInput.value = '';
              recognition.start();
              isListening = true;
              micButton.classList.add('listening');
            }
          });
          
          recognition.addEventListener('result', (event) => {
            let interimTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
              const transcript = event.results[i][0].transcript;
              
              if (event.results[i].isFinal) {
                searchInput.value += transcript + ' ';
              } else {
                interimTranscript += transcript;
              }
            }
            
            if (interimTranscript) {
              searchInput.placeholder = 'Hearing: ' + interimTranscript;
            }
          });
          
          recognition.addEventListener('end', () => {
            isListening = false;
            micButton.classList.remove('listening');
            searchInput.placeholder = 'Search...';
          });
          
          recognition.addEventListener('error', (event) => {
            console.error('Speech recognition error:', event.error);
            isListening = false;
            micButton.classList.remove('listening');
            alert('Error: ' + event.error);
          });
        }
      }