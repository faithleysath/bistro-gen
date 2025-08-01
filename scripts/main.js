let generatedData = null; // Store the generated data globally
let aiTemplates = {}; // Store AI generated templates

const generateBtn = document.getElementById('generate-btn');
const identityInput = document.getElementById('identity-input');
const menuContainer = document.getElementById('menu-container');
const saveHint = document.querySelector('.save-hint');

const widthSlider = document.getElementById('width-slider');
const widthValue = document.getElementById('width-value');
const templateSelectorGroup = document.getElementById('template-selector-group');

// AI Template elements
const createAITemplateBtn = document.getElementById('create-ai-template-btn');
const manageTemplatesBtn = document.getElementById('manage-templates-btn');
const aiTemplateModal = document.getElementById('ai-template-modal');
const templateManagerModal = document.getElementById('template-manager-modal');

let selectedTemplate = 'elegant'; // Default template

widthSlider.addEventListener('input', (e) => widthValue.textContent = e.target.value);

templateSelectorGroup.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-group-item')) {
        // Remove active class from all buttons
        templateSelectorGroup.querySelectorAll('.btn-group-item').forEach(btn => {
            btn.classList.remove('active');
        });
        // Add active class to the clicked button
        e.target.classList.add('active');
        // Update selected template
        const newTemplate = e.target.dataset.template;

        // If the template is actually changed and data exists, re-render
        if (newTemplate !== selectedTemplate && generatedData) {
            selectedTemplate = newTemplate;
            const imageWidth = parseInt(widthSlider.value, 10);
            menuContainer.innerHTML = '<p>正在切换模板...</p>';
            saveHint.style.display = 'none';
            renderMenuAsImage(generatedData, selectedTemplate, imageWidth);
        } else {
            selectedTemplate = newTemplate;
        }
    }
});

generateBtn.addEventListener('click', async () => {
    const identity = identityInput.value.trim();
    if (!identity) {
        alert('请输入你的身份描述！');
        return;
    }

    const imageWidth = parseInt(widthSlider.value, 10);

    const btnSpan = generateBtn.querySelector('span');
    btnSpan.textContent = '生成中...';
    generateBtn.disabled = true;
    menuContainer.style.display = 'block';
    menuContainer.innerHTML = '<p>正在为您精心绘制菜单...</p>'; // Show loading message
    saveHint.style.display = 'none';


    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identity: identity })
        });

        if (!response.ok) {
            throw new Error(`服务器出错了: ${response.statusText}`);
        }

        const data = await response.json();
        generatedData = data; // Save data globally
        await renderMenuAsImage(data, selectedTemplate, imageWidth);
        

    } catch (error) {
        console.error('生成失败:', error);
        menuContainer.innerHTML = `<div class="error"><p>糟糕，灵感枯竭了... 请稍后再试。</p><p class="error-details">${error.message}</p></div>`;
    } finally {
        btnSpan.textContent = '生成我的 Bistro';
        generateBtn.disabled = false;
    }
});

async function renderMenuAsImage(data, template, width) {
    const renderFunction = template === 'elegant' ? renderElegantTemplate : renderMinimalistTemplate;
    const menuHtml = renderFunction(data);

    const captureContainer = document.createElement('div');
    captureContainer.style.position = 'absolute';
    captureContainer.style.left = '-9999px';
    captureContainer.style.top = '0';
    captureContainer.style.width = `${width}px`;
    // Let height be auto
    
    document.body.appendChild(captureContainer);
    
    const iframe = document.createElement('iframe');
    iframe.style.width = `${width}px`;
    iframe.style.height = 'auto';
    iframe.style.border = 'none';
    captureContainer.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(menuHtml);
    doc.close();

    await new Promise(resolve => {
        iframe.onload = () => setTimeout(resolve, 500);
    });
    
    const canvas = await html2canvas(doc.body, {
        useCORS: true,
        scale: 2,
        width: width,
        windowWidth: width,
        backgroundColor: '#ffffff',
    });

    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));

    // Revoke previous blob URL if it exists to free memory
    const existingImage = document.getElementById('menu-image');
    if (existingImage && existingImage.src.startsWith('blob:')) {
        URL.revokeObjectURL(existingImage.src);
    }

    const imageUrl = URL.createObjectURL(blob);
    const menuImage = new Image();
    menuImage.id = 'menu-image';
    menuImage.src = imageUrl;
    menuImage.style.width = `${width}px`;
    menuImage.style.maxWidth = '100%';
    menuImage.style.cursor = 'pointer';

    menuImage.addEventListener('click', () => {
        window.open(imageUrl, '_blank');
    });
    
    // Clear placeholder and show image
    menuContainer.innerHTML = '';
    menuContainer.appendChild(menuImage);
    menuContainer.appendChild(saveHint);
    saveHint.style.display = 'block';

    document.body.removeChild(captureContainer);
}

// Initialize AI Templates from localStorage
function initializeAITemplates() {
    const stored = localStorage.getItem('bistro-ai-templates');
    if (stored) {
        try {
            aiTemplates = JSON.parse(stored);
            updateTemplateSelector();
        } catch (error) {
            console.error('Failed to load AI templates:', error);
            aiTemplates = {};
        }
    }
}

// Save AI Templates to localStorage
function saveAITemplates() {
    localStorage.setItem('bistro-ai-templates', JSON.stringify(aiTemplates));
}

// Update template selector with AI templates
function updateTemplateSelector() {
    // Remove existing AI template buttons
    const existingAIButtons = templateSelectorGroup.querySelectorAll('[data-template^="ai-template-"]');
    existingAIButtons.forEach(btn => btn.remove());
    
    // Add AI template buttons
    Object.keys(aiTemplates).forEach(templateId => {
        const template = aiTemplates[templateId];
        const button = document.createElement('button');
        button.className = 'btn-group-item';
        button.dataset.template = templateId;
        button.textContent = template.name;
        templateSelectorGroup.appendChild(button);
    });
}

// AI Template Modal Event Listeners
createAITemplateBtn.addEventListener('click', () => {
    aiTemplateModal.style.display = 'flex';
    resetAITemplateModal();
});

manageTemplatesBtn.addEventListener('click', () => {
    templateManagerModal.style.display = 'flex';
    updateTemplateList();
});

// Close modal event listeners
document.getElementById('close-ai-modal').addEventListener('click', () => {
    aiTemplateModal.style.display = 'none';
});

document.getElementById('close-manager-modal').addEventListener('click', () => {
    templateManagerModal.style.display = 'none';
});

document.getElementById('cancel-ai-template').addEventListener('click', () => {
    aiTemplateModal.style.display = 'none';
});

// Click outside modal to close
aiTemplateModal.addEventListener('click', (e) => {
    if (e.target === aiTemplateModal) {
        aiTemplateModal.style.display = 'none';
    }
});

templateManagerModal.addEventListener('click', (e) => {
    if (e.target === templateManagerModal) {
        templateManagerModal.style.display = 'none';
    }
});

// Input method selector
document.querySelector('.input-method-selector .button-group').addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-group-item')) {
        // Remove active class from all buttons
        e.target.parentElement.querySelectorAll('.btn-group-item').forEach(btn => {
            btn.classList.remove('active');
        });
        // Add active class to clicked button
        e.target.classList.add('active');
        
        const method = e.target.dataset.method;
        const textArea = document.getElementById('text-input-area');
        const imageArea = document.getElementById('image-input-area');
        
        if (method === 'text') {
            textArea.style.display = 'block';
            imageArea.style.display = 'none';
        } else {
            textArea.style.display = 'none';
            imageArea.style.display = 'block';
        }
    }
});

// Image upload functionality
const imageUploadZone = document.getElementById('image-upload-zone');
const imageFileInput = document.getElementById('image-file-input');
const imagePreview = document.getElementById('image-preview');
const previewImage = document.getElementById('preview-image');
const uploadPlaceholder = document.querySelector('.upload-placeholder');

let selectedImageData = null;

imageUploadZone.addEventListener('click', () => {
    imageFileInput.click();
});

imageUploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    imageUploadZone.classList.add('dragover');
});

imageUploadZone.addEventListener('dragleave', () => {
    imageUploadZone.classList.remove('dragover');
});

imageUploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    imageUploadZone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleImageFile(files[0]);
    }
});

imageFileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleImageFile(e.target.files[0]);
    }
});

document.getElementById('remove-image').addEventListener('click', () => {
    selectedImageData = null;
    imagePreview.style.display = 'none';
    uploadPlaceholder.style.display = 'block';
    imageFileInput.value = '';
});

function handleImageFile(file) {
    if (!file.type.startsWith('image/')) {
        alert('请选择图片文件！');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        selectedImageData = e.target.result;
        previewImage.src = selectedImageData;
        uploadPlaceholder.style.display = 'none';
        imagePreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

// Generate AI Template
document.getElementById('generate-ai-template').addEventListener('click', async () => {
    const method = document.querySelector('.input-method-selector .btn-group-item.active').dataset.method;
    const templateName = document.getElementById('template-name').value.trim() || 'AI生成模版';
    
    let content = '';
    if (method === 'text') {
        content = document.getElementById('template-description').value.trim();
        if (!content) {
            alert('请输入模版描述！');
            return;
        }
    } else {
        if (!selectedImageData) {
            alert('请上传图片！');
            return;
        }
        content = selectedImageData;
    }
    
    const generateBtn = document.getElementById('generate-ai-template');
    const originalText = generateBtn.textContent;
    generateBtn.textContent = '生成中...';
    generateBtn.disabled = true;
    
    try {
        const response = await fetch('/api/generate-ai-template', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: method,
                content: content,
                templateName: templateName
            })
        });
        
        if (!response.ok) {
            throw new Error(`服务器出错了: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // Store the AI template
        aiTemplates[result.templateId] = {
            name: result.templateName,
            jsCode: result.jsCode,
            functionName: result.functionName,
            createdAt: result.createdAt
        };
        
        saveAITemplates();
        updateTemplateSelector();
        
        // Close modal and show success message
        aiTemplateModal.style.display = 'none';
        alert(`模版 "${result.templateName}" 创建成功！`);
        
    } catch (error) {
        console.error('AI模版生成失败:', error);
        alert(`模版生成失败: ${error.message}`);
    } finally {
        generateBtn.textContent = originalText;
        generateBtn.disabled = false;
    }
});

function resetAITemplateModal() {
    document.getElementById('template-description').value = '';
    document.getElementById('template-name').value = '';
    selectedImageData = null;
    imagePreview.style.display = 'none';
    uploadPlaceholder.style.display = 'block';
    imageFileInput.value = '';
    
    // Reset to text input method
    document.querySelector('.input-method-selector .btn-group-item[data-method="text"]').classList.add('active');
    document.querySelector('.input-method-selector .btn-group-item[data-method="image"]').classList.remove('active');
    document.getElementById('text-input-area').style.display = 'block';
    document.getElementById('image-input-area').style.display = 'none';
}

// Template Manager Functions
function updateTemplateList() {
    const templateList = document.getElementById('template-list');
    
    if (Object.keys(aiTemplates).length === 0) {
        templateList.innerHTML = `
            <div class="empty-template-list">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <p>还没有AI模版</p>
                <p>点击"创建AI模版"来生成你的第一个模版</p>
            </div>
        `;
        return;
    }
    
    templateList.innerHTML = '';
    Object.keys(aiTemplates).forEach(templateId => {
        const template = aiTemplates[templateId];
        const templateItem = document.createElement('div');
        templateItem.className = 'template-item';
        templateItem.innerHTML = `
            <div class="template-info">
                <h3>${template.name}</h3>
                <p>创建时间: ${new Date(template.createdAt).toLocaleString()}</p>
            </div>
            <div class="template-actions">
                <button class="btn-use" onclick="useAITemplate('${templateId}')">使用</button>
                <button class="btn-export" onclick="exportAITemplate('${templateId}')">导出</button>
                <button class="btn-delete" onclick="deleteAITemplate('${templateId}')">删除</button>
            </div>
        `;
        templateList.appendChild(templateItem);
    });
}

// Template management functions
window.useAITemplate = function(templateId) {
    selectedTemplate = templateId;
    
    // Update template selector
    templateSelectorGroup.querySelectorAll('.btn-group-item').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const targetBtn = templateSelectorGroup.querySelector(`[data-template="${templateId}"]`);
    if (targetBtn) {
        targetBtn.classList.add('active');
    }
    
    // Re-render if data exists
    if (generatedData) {
        const imageWidth = parseInt(widthSlider.value, 10);
        menuContainer.innerHTML = '<p>正在切换模板...</p>';
        saveHint.style.display = 'none';
        renderMenuAsImage(generatedData, selectedTemplate, imageWidth);
    }
    
    templateManagerModal.style.display = 'none';
};

window.exportAITemplate = function(templateId) {
    const template = aiTemplates[templateId];
    const exportData = {
        version: "1.0",
        template: template
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name}.bistro-template`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

window.deleteAITemplate = function(templateId) {
    const template = aiTemplates[templateId];
    if (confirm(`确定要删除模版 "${template.name}" 吗？`)) {
        delete aiTemplates[templateId];
        saveAITemplates();
        updateTemplateSelector();
        updateTemplateList();
        
        // If the deleted template was selected, switch to elegant
        if (selectedTemplate === templateId) {
            selectedTemplate = 'elegant';
            templateSelectorGroup.querySelector('[data-template="elegant"]').classList.add('active');
        }
    }
};

// Import template functionality
document.getElementById('import-template-btn').addEventListener('click', () => {
    document.getElementById('import-file-input').click();
});

document.getElementById('import-file-input').addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importData = JSON.parse(e.target.result);
                if (importData.version && importData.template) {
                    const newId = `ai-template-${Date.now()}`;
                    aiTemplates[newId] = importData.template;
                    saveAITemplates();
                    updateTemplateSelector();
                    updateTemplateList();
                    alert(`模版 "${importData.template.name}" 导入成功！`);
                } else {
                    alert('无效的模版文件格式！');
                }
            } catch (error) {
                alert('模版文件解析失败！');
            }
        };
        reader.readAsText(file);
    }
});

// Update renderMenuAsImage to handle AI templates
async function renderMenuAsImageWithAI(data, template, width) {
    let renderFunction;
    
    if (template === 'elegant') {
        renderFunction = renderElegantTemplate;
    } else if (template === 'minimalist') {
        renderFunction = renderMinimalistTemplate;
    } else if (template.startsWith('ai-template-') && aiTemplates[template]) {
        // Load AI template dynamically - with debug output
        try {
            console.log('🔍 调试信息 - AI模版加载开始');
            console.log('模版ID:', template);
            console.log('模版数据:', aiTemplates[template]);
            console.log('期望的函数名:', aiTemplates[template].functionName);
            console.log('JS代码长度:', aiTemplates[template].jsCode?.length);
            
            // 检查执行前的函数
            const beforeFunctions = Object.keys(window).filter(key => 
                key.startsWith('renderAITemplate_') && typeof window[key] === 'function'
            );
            console.log('执行前的AI函数:', beforeFunctions);
            
            // 使用更安全的script标签加载方式
            const blob = new Blob([aiTemplates[template].jsCode], { type: 'application/javascript' });
            const scriptUrl = URL.createObjectURL(blob);
            
            console.log('🔧 创建script标签加载JS代码...');
            const script = document.createElement('script');
            script.src = scriptUrl;
            
            // 等待脚本加载完成
            await new Promise((resolve, reject) => {
                script.onload = () => {
                    console.log('✅ JS代码加载成功');
                    URL.revokeObjectURL(scriptUrl); // 清理blob URL
                    document.head.removeChild(script); // 移除script标签
                    resolve();
                };
                script.onerror = (error) => {
                    console.error('❌ JS代码加载失败:', error);
                    URL.revokeObjectURL(scriptUrl);
                    document.head.removeChild(script);
                    reject(new Error('JS代码加载失败'));
                };
                document.head.appendChild(script);
            });
            
            // 检查执行后的函数
            const afterFunctions = Object.keys(window).filter(key => 
                key.startsWith('renderAITemplate_') && typeof window[key] === 'function'
            );
            console.log('执行后的AI函数:', afterFunctions);
            
            renderFunction = window[aiTemplates[template].functionName];
            console.log('找到的函数:', renderFunction);
            console.log('函数类型:', typeof renderFunction);
            
            if (!renderFunction) {
                console.error('❌ 函数未找到，可能的原因:');
                console.error('1. functionName字段缺失:', !aiTemplates[template].functionName);
                console.error('2. JS代码加载失败');
                console.error('3. 函数名不匹配');
                throw new Error('AI模版函数未找到');
            }
            
            console.log('✅ AI模版加载成功');
        } catch (error) {
            console.error('❌ AI模版加载失败:', error);
            console.error('错误详情:', error.message);
            console.error('错误堆栈:', error.stack);
            alert(`AI模版加载失败: ${error.message}`);
            renderFunction = renderElegantTemplate;
        }
    } else {
        renderFunction = renderElegantTemplate;
    }
    
    const menuHtml = renderFunction(data);
    
    const captureContainer = document.createElement('div');
    captureContainer.style.position = 'absolute';
    captureContainer.style.left = '-9999px';
    captureContainer.style.top = '0';
    captureContainer.style.width = `${width}px`;
    
    document.body.appendChild(captureContainer);
    
    const iframe = document.createElement('iframe');
    iframe.style.width = `${width}px`;
    iframe.style.height = 'auto';
    iframe.style.border = 'none';
    captureContainer.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(menuHtml);
    doc.close();

    await new Promise(resolve => {
        iframe.onload = () => setTimeout(resolve, 500);
    });
    
    const canvas = await html2canvas(doc.body, {
        useCORS: true,
        scale: 2,
        width: width,
        windowWidth: width,
        backgroundColor: '#ffffff',
    });

    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));

    // Revoke previous blob URL if it exists to free memory
    const existingImage = document.getElementById('menu-image');
    if (existingImage && existingImage.src.startsWith('blob:')) {
        URL.revokeObjectURL(existingImage.src);
    }

    const imageUrl = URL.createObjectURL(blob);
    const menuImage = new Image();
    menuImage.id = 'menu-image';
    menuImage.src = imageUrl;
    menuImage.style.width = `${width}px`;
    menuImage.style.maxWidth = '100%';
    menuImage.style.cursor = 'pointer';

    menuImage.addEventListener('click', () => {
        window.open(imageUrl, '_blank');
    });
    
    // Clear placeholder and show image
    menuContainer.innerHTML = '';
    menuContainer.appendChild(menuImage);
    menuContainer.appendChild(saveHint);
    saveHint.style.display = 'block';

    document.body.removeChild(captureContainer);
}

// Replace the original renderMenuAsImage function
renderMenuAsImage = renderMenuAsImageWithAI;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeAITemplates();
});
