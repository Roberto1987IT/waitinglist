document.addEventListener('DOMContentLoaded', () => {
  function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;
    const clockElement = document.getElementById('clock');
    if (clockElement) {
      clockElement.textContent = timeString;
    }
  }
  
  updateClock();
  setInterval(updateClock, 1000);

  const scriptURL = "https://script.google.com/macros/s/AKfycbyTxvWjUMRKMsjqjZXyYWLMXNZMABIyGTJRTGZ8AZowyY7gtH2rMDwgSfz0Z1PZtUBkTw/exec";
  const form = document.getElementById('waitlistForm');
  const submitButton = form.querySelector('button[type="submit"]');
  let isSubmitting = false;

  // Create popup element
  const popup = document.createElement('div');
  popup.id = 'popup';
  popup.innerHTML = `
    <div class="popup-content">
      <span class="popup-close">&times;</span>
      <div class="popup-message"></div>
    </div>
  `;
  document.body.appendChild(popup);

  // Popup functions
  function showPopup(message, type = 'success') {
    const popupMessage = popup.querySelector('.popup-message');
    popupMessage.textContent = message;
    popup.className = `popup ${type}`;
    popup.style.display = 'flex';
  }

  function hidePopup() {
    popup.style.display = 'none';
  }

  // Close popup when close button is clicked
  popup.querySelector('.popup-close').addEventListener('click', hidePopup);

  // Close popup if clicked outside
  popup.addEventListener('click', (e) => {
    if (e.target === popup) hidePopup();
  });
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    submitButton.disabled = true;
    submitButton.innerHTML = 'Os seus dados estão sendo analisados....';
    isSubmitting = true;

    const formData = new FormData(form);

    fetch(scriptURL, { 
      method: "POST", 
      body: formData 
    })
    .then((response) => {
      submitButton.disabled = false;
      submitButton.innerHTML = 'Entrar na Lista de Espera';
      isSubmitting = false;
      
      showPopup("Dados enviados com sucesso!");
      form.reset();
    })
    .catch((error) => {
      submitButton.disabled = false;
      submitButton.innerHTML = 'Entrar na Lista de Espera';
      isSubmitting = false;
      
      showPopup("Algo deu errado. Por favor, tente novamente!", 'error');
      console.error('Submission error:', error);
    });
  });

  document.getElementById('year').textContent = new Date().getFullYear();
});