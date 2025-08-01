let generatedData = null; // Store the generated data globally
let aiTemplates = {}; // Store AI generated templates
let templatePreviews = {}; // Store template preview images

// Sample menu data for generating template previews
const sampleMenuData = {
    "店铺名称": "示例 Bistro",
    "Slogan（中）": "在这里，每一次debug都是灵魂的重启",
    "Slogan (EN)": "Where every debug is a soul reboot, savoring the intoxication beyond code.",
    "菜单": {
        "Appetizers": [
            {
                "菜品（中）": "代码诗人的灵感沙拉",
                "Dish (EN/FR)": "Poet's Inspiration Salade",
                "价格": "¥28",
                "身份梗·哲学说明": "每一片生菜都承载着程序员对完美逻辑的追求"
            }
        ],
        "Main Courses": [
            {
                "菜品（中）": "重构人生的意式烩饭",
                "Dish (EN/FR)": "Life Refactoring Risotto",
                "价格": "¥48",
                "身份梗·哲学说明": "如同重构代码般，每一粒米都经过精心优化"
            },
            {
                "菜品（中）": "异步处理的慢炖牛肉",
                "Dish (EN/FR)": "Async Braised Beef",
                "价格": "¥52",
                "身份梗·哲学说明": "在时间的异步流转中，等待最完美的那一刻"
            }
        ],
        "Desserts": [
            {
                "菜品（中）": "递归梦境提拉米苏",
                "Dish (EN/FR)": "Recursive Dream Tiramisu",
                "价格": "¥22",
                "身份梗·哲学说明": "层层叠叠的甜蜜，如同递归函数的无限深度"
            }
        ]
    }
};

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
        // Use fetch with streaming response
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identity: identity })
        });

        if (!response.ok) {
            throw new Error(`服务器出错了: ${response.statusText}`);
        }

        // Check if response is streaming (text/event-stream)
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/event-stream')) {
            // Handle streaming response
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop(); // Keep incomplete line in buffer

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const data = JSON.parse(line.slice(6));
                                
                                switch (data.type) {
                                    case 'connected':
                                        menuContainer.innerHTML = `<p>${data.message}</p>`;
                                        break;
                                        
                                    case 'progress':
                                        menuContainer.innerHTML = `
                                            <div class="progress-container">
                                                <p>${data.message}</p>
                                                <div class="progress-bar">
                                                    <div class="progress-fill" style="width: ${data.progress}%"></div>
                                                </div>
                                                <p class="progress-text">${data.progress}%</p>
                                            </div>
                                        `;
                                        break;
                                        
                                    case 'complete':
                                        generatedData = data.data; // Save data globally
                                        await renderMenuAsImage(data.data, selectedTemplate, imageWidth);
                                        return; // Exit the function
                                        
                                    case 'error':
                                        throw new Error(data.details || data.error);
                                }
                            } catch (parseError) {
                                console.error('解析流式数据失败:', parseError);
                            }
                        }
                    }
                }
            } finally {
                reader.releaseLock();
            }
        } else {
            // Handle regular JSON response (fallback)
            const data = await response.json();
            generatedData = data;
            await renderMenuAsImage(data, selectedTemplate, imageWidth);
        }

    } catch (error) {
        console.error('生成失败:', error);
        menuContainer.innerHTML = `<div class="error"><p>糟糕，灵感枯竭了... 请稍后再试。</p><p class="error-details">${error.message}</p></div>`;
    } finally {
        btnSpan.textContent = '生成我的 Bistro';
        generateBtn.disabled = false;
    }
});

async function renderMenuAsImage(data, template, width) {
    let renderFunction;
    if (template === 'elegant') {
        renderFunction = renderElegantTemplate;
    } else if (template === 'minimalist') {
        renderFunction = renderMinimalistTemplate;
    } else if (template === 'yunguichuan') {
        renderFunction = renderYunguichuanTemplate;
    } else {
        renderFunction = renderElegantTemplate; // fallback
    }
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

// Generate template preview image
async function generateTemplatePreview(templateId) {
    if (templatePreviews[templateId]) {
        return templatePreviews[templateId];
    }

    let renderFunction;
    
    if (templateId === 'elegant') {
        renderFunction = renderElegantTemplate;
    } else if (templateId === 'minimalist') {
        renderFunction = renderMinimalistTemplate;
    } else if (templateId === 'yunguichuan') {
        renderFunction = renderYunguichuanTemplate;
    } else if (templateId.startsWith('ai-template-') && aiTemplates[templateId]) {
        // Load AI template dynamically
        try {
            const blob = new Blob([aiTemplates[templateId].jsCode], { type: 'application/javascript' });
            const scriptUrl = URL.createObjectURL(blob);
            
            const script = document.createElement('script');
            script.src = scriptUrl;
            
            await new Promise((resolve, reject) => {
                script.onload = () => {
                    URL.revokeObjectURL(scriptUrl);
                    document.head.removeChild(script);
                    resolve();
                };
                script.onerror = (error) => {
                    URL.revokeObjectURL(scriptUrl);
                    document.head.removeChild(script);
                    reject(new Error('JS代码加载失败'));
                };
                document.head.appendChild(script);
            });
            
            renderFunction = window[aiTemplates[templateId].functionName];
            if (!renderFunction) {
                throw new Error('AI模版函数未找到');
            }
        } catch (error) {
            console.error('AI模版预览生成失败:', error);
            renderFunction = renderElegantTemplate;
        }
    } else {
        renderFunction = renderElegantTemplate;
    }
    
    const menuHtml = renderFunction(sampleMenuData);
    const width = 800;
    
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
    const imageUrl = URL.createObjectURL(blob);
    
    document.body.removeChild(captureContainer);
    
    // Cache the preview
    templatePreviews[templateId] = imageUrl;
    return imageUrl;
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
    
    // Create progress indicator in modal
    const modalContent = document.querySelector('#ai-template-modal .modal-content');
    const progressContainer = document.createElement('div');
    progressContainer.className = 'ai-template-progress';
    progressContainer.innerHTML = `
        <div class="progress-container">
            <p>正在生成AI模板...</p>
            <div class="progress-bar">
                <div class="progress-fill" style="width: 0%"></div>
            </div>
            <p class="progress-text">0%</p>
        </div>
    `;
    modalContent.appendChild(progressContainer);
    
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
        
        // Check if response is streaming
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/event-stream')) {
            // Handle streaming response
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop(); // Keep incomplete line in buffer

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const data = JSON.parse(line.slice(6));
                                
                                switch (data.type) {
                                    case 'connected':
                                        progressContainer.querySelector('p').textContent = data.message;
                                        break;
                                        
                                    case 'progress':
                                        progressContainer.querySelector('p').textContent = data.message;
                                        progressContainer.querySelector('.progress-fill').style.width = `${data.progress}%`;
                                        progressContainer.querySelector('.progress-text').textContent = `${data.progress}%`;
                                        break;
                                        
                                    case 'complete':
                                        const result = data.data;
                                        
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
                                        return;
                                        
                                    case 'error':
                                        throw new Error(data.details || data.error);
                                }
                            } catch (parseError) {
                                console.error('解析流式数据失败:', parseError);
                            }
                        }
                    }
                }
            } finally {
                reader.releaseLock();
            }
        } else {
            // Handle regular JSON response (fallback)
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
        }
        
    } catch (error) {
        console.error('AI模版生成失败:', error);
        alert(`模版生成失败: ${error.message}`);
    } finally {
        generateBtn.textContent = originalText;
        generateBtn.disabled = false;
        // Remove progress container
        if (progressContainer && progressContainer.parentNode) {
            progressContainer.parentNode.removeChild(progressContainer);
        }
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
async function updateTemplateList() {
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
    
    for (const templateId of Object.keys(aiTemplates)) {
        const template = aiTemplates[templateId];
        const templateItem = document.createElement('div');
        templateItem.className = 'template-item';
        
        // Create thumbnail placeholder
        const thumbnailPlaceholder = `
            <div class="template-thumbnail-container">
                <div class="template-thumbnail-loading">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>生成预览中...</span>
                </div>
            </div>
        `;
        
        templateItem.innerHTML = `
            ${thumbnailPlaceholder}
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
        
        // Generate thumbnail asynchronously
        try {
            const previewUrl = await generateTemplatePreview(templateId);
            const thumbnailContainer = templateItem.querySelector('.template-thumbnail-container');
            thumbnailContainer.innerHTML = `
                <img src="${previewUrl}" class="template-thumbnail" onclick="showTemplatePreview('${templateId}', '${previewUrl}')" alt="${template.name} 预览">
            `;
        } catch (error) {
            console.error(`Failed to generate preview for ${templateId}:`, error);
            const thumbnailContainer = templateItem.querySelector('.template-thumbnail-container');
            thumbnailContainer.innerHTML = `
                <div class="template-thumbnail-error">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>预览失败</span>
                </div>
            `;
        }
    }
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
    // 确保文件名安全且包含正确的后缀名
    const safeName = template.name.replace(/[^a-zA-Z0-9\u4e00-\u9fa5_-]/g, '_');
    a.download = `${safeName}.json`;
    // 设置 download 属性确保浏览器识别为下载
    a.setAttribute('download', `${safeName}.json`);
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
        
        // 检查文件扩展名
        if (!file.name.endsWith('.json')) {
            alert('请选择 .json 格式的模版文件！');
            e.target.value = ''; // 清空文件选择
            return;
        }
        
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
                console.error('Import error:', error);
                alert('模版文件解析失败！请确保文件格式正确。');
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
    } else if (template === 'yunguichuan') {
        renderFunction = renderYunguichuanTemplate;
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

// Show template preview in modal
window.showTemplatePreview = function(templateId, previewUrl) {
    const template = aiTemplates[templateId];
    
    // Create preview modal
    const previewModal = document.createElement('div');
    previewModal.className = 'template-preview-modal';
    previewModal.innerHTML = `
        <div class="template-preview-content">
            <div class="template-preview-header">
                <h3>${template.name} - 预览</h3>
                <button class="modal-close" onclick="closeTemplatePreview()">&times;</button>
            </div>
            <div class="template-preview-body">
                <img src="${previewUrl}" alt="${template.name} 预览" class="template-preview-image">
            </div>
        </div>
    `;
    
    // Add click outside to close
    previewModal.addEventListener('click', (e) => {
        if (e.target === previewModal) {
            closeTemplatePreview();
        }
    });
    
    document.body.appendChild(previewModal);
    previewModal.style.display = 'flex';
};

window.closeTemplatePreview = function() {
    const previewModal = document.querySelector('.template-preview-modal');
    if (previewModal) {
        document.body.removeChild(previewModal);
    }
};

// Replace the original renderMenuAsImage function
renderMenuAsImage = renderMenuAsImageWithAI;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeAITemplates();
});
