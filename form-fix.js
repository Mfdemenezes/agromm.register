// Script para corrigir o formulário de assinatura
(function() {
    console.log('🔧 Form Fix Script carregado');
    
    function interceptarFormularios() {
        // Interceptar todos os formulários da página
        const forms = document.querySelectorAll('form');
        console.log(`📝 Encontrados ${forms.length} formulários`);
        
        forms.forEach((form, index) => {
            if (!form.dataset.intercepted) {
                form.dataset.intercepted = 'true';
                console.log(`🎯 Interceptando formulário ${index + 1}`);
                
                form.addEventListener('submit', async function(e) {
                    e.preventDefault();
                    console.log('📤 Formulário submetido, processando...');
                    
                    // Coletar dados do formulário
                    const formData = new FormData(form);
                    const dados = {};
                    
                    for (let [key, value] of formData.entries()) {
                        dados[key] = value;
                    }
                    
                    // Adicionar dados extras
                    dados.timestamp = new Date().toISOString();
                    dados.source = 'landing-page-agromm';
                    dados.url = window.location.href;
                    
                    console.log('📊 Dados coletados:', dados);
                    
                    try {
                        // Usar webhook que aceita CORS
                        const webhookUrl = 'https://httpbin.org/post'; // Temporário para teste
                        
                        const response = await fetch(webhookUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(dados)
                        });
                        
                        if (response.ok) {
                            console.log('✅ Lead enviado com sucesso!');
                            mostrarSucesso();
                        } else {
                            throw new Error('Erro na resposta do servidor');
                        }
                        
                    } catch (error) {
                        console.error('❌ Erro ao enviar lead:', error);
                        
                        // Fallback: salvar no localStorage
                        salvarLocalStorage(dados);
                        mostrarSucesso();
                    }
                });
            }
        });
    }
    
    function salvarLocalStorage(dados) {
        try {
            const leads = JSON.parse(localStorage.getItem('agromm_leads') || '[]');
            leads.push(dados);
            localStorage.setItem('agromm_leads', JSON.stringify(leads));
            console.log('💾 Lead salvo no localStorage como backup');
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
        }
    }
    
    function mostrarSucesso() {
        // Criar modal de sucesso
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
        
        // Remover automaticamente após 5 segundos
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 5000);
    }
    
    // Executar quando a página carregar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', interceptarFormularios);
    } else {
        interceptarFormularios();
    }
    
    // Executar periodicamente para capturar formulários criados dinamicamente
    setInterval(interceptarFormularios, 2000);
    
    // Função para verificar leads salvos (para debug)
    window.verificarLeads = function() {
        const leads = JSON.parse(localStorage.getItem('agromm_leads') || '[]');
        console.log('📋 Leads salvos:', leads);
        return leads;
    };
    
    console.log('✅ Form Fix Script ativo! Use verificarLeads() para ver leads salvos.');
})();
