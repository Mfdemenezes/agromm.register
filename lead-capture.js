// Lead Capture Script - Final Version
(function() {
    console.log('🚀 Lead Capture FINAL carregado');
    
    function capturarFormularios() {
        const forms = document.querySelectorAll('form');
        console.log(`📝 Forms encontrados: ${forms.length}`);
        
        forms.forEach((form, i) => {
            if (!form.dataset.captured) {
                form.dataset.captured = 'true';
                console.log(`🎯 Capturando form ${i + 1}`);
                
                form.addEventListener('submit', async function(e) {
                    e.preventDefault();
                    console.log('📤 ENVIANDO LEAD...');
                    
                    const formData = new FormData(form);
                    const lead = {};
                    
                    for (let [key, value] of formData.entries()) {
                        lead[key] = value;
                    }
                    
                    lead.timestamp = new Date().toISOString();
                    lead.source = 'register.mbam.com.br';
                    
                    console.log('📊 LEAD CAPTURADO:', lead);
                    
                    // Salvar sempre no localStorage
                    const leads = JSON.parse(localStorage.getItem('agromm_leads') || '[]');
                    leads.push(lead);
                    localStorage.setItem('agromm_leads', JSON.stringify(leads));
                    console.log('💾 SALVO NO LOCALSTORAGE');
                    
                    // Tentar enviar (sem bloquear o sucesso)
                    try {
                        await fetch('https://httpbin.org/post', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify(lead)
                        });
                        console.log('✅ ENVIADO PARA HTTPBIN');
                    } catch (e) {
                        console.log('⚠️ HTTPBIN FALHOU, MAS LEAD SALVO');
                    }
                    
                    // Mostrar sucesso
                    mostrarSucesso();
                });
            }
        });
    }
    
    function mostrarSucesso() {
        const modal = document.createElement('div');
        modal.innerHTML = `
            <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;justify-content:center;align-items:center;z-index:99999;">
                <div style="background:white;padding:30px;border-radius:10px;text-align:center;max-width:400px;">
                    <h2 style="color:#4CAF50;margin-bottom:20px;">✅ Lead Capturado!</h2>
                    <p style="margin-bottom:20px;">Obrigado! Entraremos em contato em breve.</p>
                    <button onclick="this.closest('div').parentNode.remove()" style="background:#4CAF50;color:white;border:none;padding:10px 20px;border-radius:5px;cursor:pointer;">Fechar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        setTimeout(() => modal.remove(), 5000);
    }
    
    // Executar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', capturarFormularios);
    } else {
        capturarFormularios();
    }
    
    setInterval(capturarFormularios, 3000);
    
    // Função global para verificar leads
    window.verificarLeads = () => {
        const leads = JSON.parse(localStorage.getItem('agromm_leads') || '[]');
        console.log('📋 LEADS SALVOS:', leads);
        return leads;
    };
    
    console.log('✅ Lead Capture ATIVO! Digite verificarLeads() para ver dados.');
})();
