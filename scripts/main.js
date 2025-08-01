let generatedData = null; // Store the generated data globally

const generateBtn = document.getElementById('generate-btn');
const identityInput = document.getElementById('identity-input');
const menuContainer = document.getElementById('menu-container');
const saveHint = document.querySelector('.save-hint');

const widthSlider = document.getElementById('width-slider');
const widthValue = document.getElementById('width-value');
const templateSelectorGroup = document.getElementById('template-selector-group');

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
