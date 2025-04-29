// /fcap/js/script.js
document.addEventListener("DOMContentLoaded", () => {
  fetch("db/buttons.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erro HTTP! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const container = document.getElementById("button-container");
      if (!container || !data.buttons) {
        console.error("Container não encontrado ou dados inválidos");
        return;
      }

      // Ordena os botões pela propriedade 'order' antes de renderizar
      const sortedButtons = data.buttons.sort((a, b) => a.order - b.order);

      // Limpa o container antes de adicionar os novos botões
      container.innerHTML = '';

      sortedButtons.forEach((button) => {
        const wrapper = document.createElement("div");
        wrapper.className = "btn-wrapper";

        // Define a altura da descrição como variável CSS
        const descHeight = button.description ? "100px" : "0px";
        wrapper.style.setProperty("--desc-height", descHeight);

        wrapper.innerHTML = `
          <a href="${button.url}" class="btn" target="_blank" rel="noopener noreferrer">
            <img src="${button.icon}" class="btn-icon" alt="${button.title}">
            <span class="btn-text">${button.title}</span>
          </a>
          <div class="btn-description">${button.description || ""}</div>
        `;

        // Adiciona evento de clique para mobile
        if (window.innerWidth <= 600) {
          const btn = wrapper.querySelector('.btn');
          btn.addEventListener('click', (e) => {
            if (!button.url) e.preventDefault();
            wrapper.classList.toggle('mobile-open');
            
            // Fecha outros botões abertos
            document.querySelectorAll('.btn-wrapper').forEach(otherWrapper => {
              if (otherWrapper !== wrapper) {
                otherWrapper.classList.remove('mobile-open');
              }
            });
          });
        }

        container.appendChild(wrapper);
      });
    })
    .catch((err) => {
      console.error("Erro ao carregar botões:", err);
      const container = document.getElementById("button-container");
      if (container) {
        container.innerHTML = `
          <div class="error-message">
            <p>Não foi possível carregar os botões no momento.</p>
            <p>Por favor, tente novamente mais tarde.</p>
            <small>Erro: ${err.message}</small>
          </div>
        `;
      }
    });
});

// Adiciona listener para redimensionamento da tela (mobile/desktop)
window.addEventListener('resize', () => {
if (window.innerWidth > 600) {
  // Remove todas as classes mobile-open quando em desktop
  document.querySelectorAll('.btn-wrapper.mobile-open').forEach(wrapper => {
    wrapper.classList.remove('mobile-open');
  });
}
});
