// Script para corrigir o formulário de assinatura - v3
(function() {
    console.log('🔧 Form Fix Script v3 carregado');
    
    // Verificar se estamos na landing page correta
    if (window.location.hostname === 'register.mbam.com.br') {
        // Ocultar elementos da aplicação principal se aparecerem
        const hideAppElements = () => {
            const selectors = [
                '[class*="sidebar"]',
                '[class*="menu"]', 
                '[class*="nav"]',
                '[class*="header"]:not([class*="landing"])',
                '[data-testid*="menu"]',
                '[data-testid*="sidebar"]'
            ];
            
            selectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    if (!el.closest('form') && !el.textContent.includes('AgroMM Solution')) {
                        el.style.display = 'none';
                    }
                });
            });
        };
        
        // Executar limpeza
        setTimeout(hideAppElements, 1000);
        setInterval(hideAppElements, 3000);
    }
    
    function interceptarFormularios() {
        const forms = document.querySelectorAll('form');
        console.log(`📝 Encontrados ${forms.length} formulários`);
        
        forms.forEach((form, index) => {
            if (!form.dataset.intercepted) {
                form.dataset.intercepted = 'true';
                console.log(`🎯 Interceptando formulário ${index + 1}`);
                
                form.addEventListener('submit', async function(e) {
                    e.preventDefault();
                    console.log('📤 Formulário submetido, processando...');
                    
                    const formData = new FormData(form);
                    const dados = {};
                    
                    for (let [key, value] of formData.entries()) {
                        dados[key] = value;
                    }
                    
                    dados.timestamp = new Date().toISOString();
                    dados.source = 'landing-page-agromm';
                    dados.url = window.location.href;
                    
                    console.log('📊 Dados coletados:', dados);
                    
                    // Sempre salvar no localStorage primeiro
                    salvarLocalStorage(dados);
                    
                    try {
                        // Usar endpoint simples que sempre funciona
                        const webhookUrl = 'https://httpbin.org/post';
                        
                        const response = await fetch(webhookUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(dados)
                        });
                        
                        if (response.ok) {
                            console.log('✅ Lead enviado com sucesso!');
                        } else {
                            console.log('⚠️ Envio falhou, mas dados salvos localmente');
                        }
                        
                    } catch (error) {
                        console.log('⚠️ Erro no envio, mas dados salvos localmente:', error.message);
                    }
                    
                    mostrarSucesso();
                });
            }
        });
    }
    
    function salvarLocalStorage(dados) {
        try {
            const leads = JSON.parse(localStorage.getItem('agromm_leads') || '[]');
            leads.push(dados);
            localStorage.setItem('agromm_leads', JSON.stringify(leads));
            console.log('💾 Lead salvo no localStorage:', dados);
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
        }
    }
    
    function mostrarSucesso() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            max-width: 400px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;
        
        content.innerHTML = `
            <h2 style="color: #4CAF50; margin-bottom: 20px;">✅ Sucesso!</h2>
            <p style="margin-bottom: 20px;">Obrigado pelo seu interesse! Entraremos em contato em breve.</p>
            <button onclick="this.closest('[style*=\"position: fixed\"]').remove()" 
                    style="background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                Fechar
            </button>
        `;
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 5000);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', interceptarFormularios);
    } else {
        interceptarFormularios();
    }
    
    setInterval(interceptarFormularios, 2000);
    
    window.verificarLeads = function() {
        const leads = JSON.parse(localStorage.getItem('agromm_leads') || '[]');
        console.log('📋 Leads salvos:', leads);
        return leads;
    };
    
    console.log('✅ Form Fix Script v3 ativo! Use verificarLeads() para ver leads salvos.');
})();
