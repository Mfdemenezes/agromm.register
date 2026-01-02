// Script para corrigir botão Modo Admin
(function() {
  function fixModoAdminButton() {
    const chips = document.querySelectorAll('.MuiChip-root');
    const modoAdminChip = Array.from(chips).find(chip => chip.textContent.includes('Modo Admin'));

    if (modoAdminChip && !modoAdminChip.dataset.fixed) {
      modoAdminChip.dataset.fixed = 'true';
      
      modoAdminChip.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        try {
          const response = await fetch('/admin/voltar-super-admin', {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token'),
              'Content-Type': 'application/json'
            }
          });
          
          const data = await response.json();
          
          if (data.access_token) {
            localStorage.setItem('token', data.access_token);
            localStorage.removeItem('fazenda');
            localStorage.removeItem('selectedFazenda');
            localStorage.removeItem('temp_admin_mode');
            window.location.href = '/';
          }
        } catch (error) {
          console.error('Erro:', error);
        }
      }, true);
      
      console.log('✅ Botão Modo Admin corrigido automaticamente!');
    }
  }

  // Executar quando a página carregar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixModoAdminButton);
  } else {
    fixModoAdminButton();
  }

  // Executar periodicamente para capturar mudanças do React
  setInterval(fixModoAdminButton, 2000);
})();
