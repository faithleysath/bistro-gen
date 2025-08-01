export const config = {
    runtime: 'edge',
};

// 硬编码的模版示例
const TEMPLATE_EXAMPLES = {
    elegantTemplate: `function renderElegantTemplate(data) {
    const shopName = data['店铺名称'] || 'MERPORT BISTRO';
    const slogan = data['Slogan（中）'] || 'BREAKFAST : 7:30 AM - 10:30 AM || LUNCH : 11:00 AM - 3:30 PM';

    let menuHtml = '';
    // 确保按照固定顺序渲染菜单分类：前菜、主菜、副菜、甜点
    const orderedCategories = ['Appetizers', 'Main Courses', 'Side Dishes', 'Desserts'];
    const categories = orderedCategories.filter(cat => data['菜单'][cat] && data['菜单'][cat].length > 0);
    
    // Split categories into two columns
    const midpoint = Math.ceil(categories.length / 2);
    const leftColumnCategories = categories.slice(0, midpoint);
    const rightColumnCategories = categories.slice(midpoint);

    const generateCategoryHtml = (categoryName) => {
        const items = data['菜单'][categoryName];
        let categoryHtml = \`<h2 class="font-serif-display text-4xl mt-6 mb-6 border-b-2 border-gray-200 pb-2">\${categoryName}</h2><div class="space-y-6">\`;
        items.forEach(item => {
            categoryHtml += \`
                <div>
                    <div class="flex justify-between items-baseline">
                        <h3 class="text-lg font-bold uppercase tracking-wider">\${item['菜品（中）']}</h3>
                        <p class="text-lg font-bold">\${item['价格'] || '$' + (Math.floor(Math.random() * 20) + 10)}</p>
                    </div>
                    <p class="text-gray-600 mt-1">\${item['身份梗·哲学说明']}</p>
                </div>
            \`;
        });
        categoryHtml += '</div>';
        return categoryHtml;
    };

    let leftColumnHtml = '<section>';
    leftColumnCategories.forEach(cat => leftColumnHtml += generateCategoryHtml(cat));
    leftColumnHtml += '</section>';

    let rightColumnHtml = '<section class="space-y-10">';
    rightColumnCategories.forEach(cat => rightColumnHtml += \`<div>\${generateCategoryHtml(cat)}</div>\`);
    rightColumnHtml += '</section>';

    return \`
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
            <meta charset="UTF-8">
            <title>Elegant Menu</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                @import url('https://fonts.loli.net/css2?family=Playfair+Display:wght@700&family=Lato:wght@400;700&display=swap');

                body.elegant-template {
                    font-family: 'Lato', sans-serif;
                    background-color: #ffffff;
                }

                .elegant-template .font-serif-display {
                    font-family: 'Playfair Display', serif;
                }

                .elegant-background {
                    position: relative;
                    z-index: 1;
                }

                .elegant-background::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-image: url('/assets/elegant-background.png');
                    background-size: cover;
                    background-position: center;
                    opacity: 0.1;
                    z-index: -1;
                }
            </style>
        </head>
        <body class="elegant-template">
            <div class="elegant-background">
                <div class="max-w-4xl mx-auto p-8">
                    <div class="w-full mb-8">
                    <img src="assets/elegant-poster.jpg" alt="头部图片" class="w-full h-auto object-cover rounded-lg shadow-md">
                </div>
                <header class="text-center mb-10">
                    <h1 class="font-serif-display text-5xl md:text-6xl tracking-widest text-gray-900">\${shopName.toUpperCase()}</h1>
                    <div class="mt-4 text-sm font-semibold tracking-wider text-gray-600">
                        <span>\${slogan}</span>
                    </div>
                </header>
                <main class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                    \${leftColumnHtml}
                    \${rightColumnHtml}
                    </main>
                </div>
            </div>
        </body>
        </html>
    \`;
}`,
    minimalistTemplate: `function renderMinimalistTemplate(data) {
    const shopName = data['店铺名称'] ? data['店铺名称'].split('').join('. ') + '.' : 'house. wine. bistro.';
    const slogan = data['Slogan（中）'] || 'A place for fine food and wine.';

    const generateCategoryHtml = (categoryName) => {
        const items = data['菜单'][categoryName];
        let categoryHtml = \`<section><h2 class="menu-section-title"><span>\${categoryName}</span></h2><div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">\`;
        items.forEach(item => {
            categoryHtml += \`
                <div>
                    <div class="flex justify-between item-name">
                        <span>\${item['菜品（中）']}</span>
                        <span>\${item['价格'] || Math.floor(Math.random() * 20) + 10}</span>
                    </div>
                    <p class="item-description">\${item['身份梗·哲学说明']}</p>
                </div>
            \`;
        });
        categoryHtml += '</div></section>';
        return categoryHtml;
    };

    let menuHtml = '';
    // 确保按照固定顺序渲染菜单分类：前菜、主菜、副菜、甜点
    const orderedCategories = ['Appetizers', 'Main Courses', 'Side Dishes', 'Desserts'];
    const categories = orderedCategories.filter(cat => data['菜单'][cat] && data['菜单'][cat].length > 0);
    
    categories.forEach(category => {
        menuHtml += generateCategoryHtml(category);
    });

    return \`
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
            <meta charset="UTF-8">
            <title>Minimalist Menu</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                @import url('https://fonts.loli.net/css2?family=Tinos:ital,wght@0,400;0,700;1,400&display=swap');

                body.minimalist-template {
                    font-family: 'Tinos', serif;
                    color: #333;
                    background-color: #ffffff;
                }

                .minimalist-template .menu-section-title {
                    font-size: 2.5rem;
                    font-weight: 400;
                    letter-spacing: 0.5rem;
                    text-transform: uppercase;
                    text-align: center;
                    margin-top: 3rem;
                    margin-bottom: 3rem;
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }

                .minimalist-template .menu-section-title::before,
                .minimalist-template .menu-section-title::after {
                    content: '';
                    flex-grow: 1;
                    height: 1px;
                    background-color: #ccc;
                }

                .minimalist-template .item-name {
                    font-weight: 700;
                    text-transform: uppercase;
                }

                .minimalist-template .item-description {
                    font-style: italic;
                    color: #666;
                }

                .minimalist-template .header-icons {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 1.5rem;
                    margin: 1.5rem 0;
                }

                .minimalist-template .header-icons svg {
                    width: 2rem;
                    height: 2rem;
                    stroke: #333;
                    stroke-width: 1.5;
                    fill: none;
                }

                .minimalist-template .main-title {
                    text-align: center;
                    font-weight: 400;
                    font-size: 1.5rem;
                    letter-spacing: 0.2rem;
                    text-transform: uppercase;
                }

                .minimalist-template .footer-text {
                    font-size: 0.8rem;
                    text-align: center;
                    margin-top: 3rem;
                    padding: 1rem;
                    color: #666;
                    font-style: italic;
                }
            </style>
        </head>
        <body class="minimalist-template bg-white max-w-4xl mx-auto p-8">
            <header>
                <div class="header-icons">
                    <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 10.5L12 3.5L19.5 10.5V20.5H4.5V10.5Z"></path><path d="M9.5 20.5V14.5H14.5V20.5"></path></svg>
                    <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3L18 3L12 12L6 3Z"></path><path d="M12 12V21"></path><path d="M8 21H16"></path></svg>
                    <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3v8c0 1.65 1.35 3 3 3s3-1.35 3-3V3"></path><path d="M10 3v18"></path><path d="M17 3v18"></path></svg>
                </div>
                <h1 class="main-title">\${shopName}</h1>
            </header>
            <main>
                \${menuHtml}
            </main>
            <footer>
                <p class="footer-text">\${slogan}</p>
            </footer>
        </body>
        </html>
    \`;
}`
};

async function callGoogleAIStreaming(input, type, apiKey, sendUpdate) {
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`;

    // 使用硬编码的模版示例
    const { elegantTemplate, minimalistTemplate } = TEMPLATE_EXAMPLES;

    // 生成唯一的时间戳，确保一致性
    const timestamp = Date.now();
    const functionName = `renderAITemplate_${timestamp}`;

    let prompt = '';
    let requestBody = {};

    if (type === 'image') {
        // 处理图片分析
        prompt = `
# 菜单模版代码生成器 - 图片分析版

## 任务
分析上传的菜单图片，提取设计风格特征，生成一个完整的JavaScript模版函数。

## 分析要点
1. **色彩方案**：主色调、辅助色、背景色
2. **字体风格**：标题字体、正文字体、字号大小
3. **布局结构**：单列、双列、网格布局
4. **装饰元素**：边框、阴影、图标、分割线
5. **整体风格**：现代、复古、优雅、简约等

## 参考示例

### 示例1：优雅风格模版
\`\`\`javascript
${elegantTemplate}
\`\`\`

### 示例2：极简风格模版
\`\`\`javascript
${minimalistTemplate}
\`\`\`

## 重要要求
1. **函数命名**：必须使用 ${functionName} 格式（注意：这是为此模版生成的唯一函数名）
2. **完整结构**：返回完整的HTML文档，包含DOCTYPE、head、body
3. **内嵌样式**：使用 <style> 标签内嵌所有CSS，包含Google Fonts导入
4. **Tailwind CSS**：必须引入 https://cdn.tailwindcss.com
5. **数据处理**：正确处理菜单数据结构，包含合理的默认值
6. **响应式设计**：使用Tailwind类实现移动端适配
7. **风格体现**：充分体现图片分析得出的设计风格和特征
8. **错误处理**：对缺失数据提供默认值，确保代码健壮性
9. **纯函数**：只生成function声明，不要包含任何其他语句、导入或class定义
10. **语法正确**：确保生成的JavaScript代码语法完全正确
11. **菜单顺序**：必须按照固定顺序渲染菜单分类：Appetizers（前菜）→ Main Courses（主菜）→ Side Dishes（副菜）→ Desserts（甜点），不能使用for...in循环遍历菜单对象

## 菜单数据格式
data = {
    "店铺名称": "店名",
    "Slogan（中）": "中文标语", 
    "Slogan (EN)": "英文标语",
    "菜单": {
        "Appetizers": [{"菜品（中）": "菜名", "Dish (EN/FR)": "英文名", "身份梗·哲学说明": "描述"}],
        "Main Courses": [...],
        "Desserts": [...]
    }
}

## 代码质量标准
- 必须能直接运行，无语法错误
- 样式完整，视觉效果良好
- 数据绑定正确，支持动态内容
- 代码结构清晰，易于维护
- 充分体现图片分析得出的设计需求

## 特别注意事项
- 不要生成任何class定义或export语句
- 不要包含import语句或require语句
- 确保所有字符串正确转义，特别是模板字符串中的反引号
- 确保所有括号、大括号、方括号正确匹配
- 函数必须以function关键字开头，以}结尾
- 检查所有变量名拼写正确，避免typo
- 函数名必须是 ${functionName}，不要使用其他名称

请基于图片分析和以上示例，生成一个高质量、可直接使用的模版函数。直接输出JavaScript代码，不要包含markdown标记。
`;

        // 将base64图片数据转换为适合API的格式
        const mimeTypeMatch = input.match(/^data:image\/([a-z]+);base64,/);
        const mimeType = mimeTypeMatch ? `image/${mimeTypeMatch[1]}` : 'image/jpeg';
        const imageData = input.replace(/^data:image\/[a-z]+;base64,/, '');
        
        requestBody = {
            contents: [{
                parts: [
                    { text: prompt },
                    {
                        inline_data: {
                            mime_type: mimeType,
                            data: imageData
                        }
                    }
                ]
            }],
            generationConfig: {
                response_mime_type: "text/plain"
            }
        };
    } else {
        // 处理文字描述
        prompt = `
# 菜单模版代码生成器 - 文字描述版

## 任务
根据用户的文字描述，生成一个符合要求的菜单模版JavaScript函数。

## 用户描述
${input}

## 参考示例

### 示例1：优雅风格模版
\`\`\`javascript
${elegantTemplate}
\`\`\`

### 示例2：极简风格模版
\`\`\`javascript
${minimalistTemplate}
\`\`\`

## 重要要求
1. **函数命名**：必须使用 ${functionName} 格式（注意：这是为此模版生成的唯一函数名）
2. **完整结构**：返回完整的HTML文档，包含DOCTYPE、head、body
3. **内嵌样式**：使用 <style> 标签内嵌所有CSS，包含Google Fonts导入
4. **Tailwind CSS**：必须引入 https://cdn.tailwindcss.com
5. **数据处理**：正确处理菜单数据结构，包含合理的默认值
6. **响应式设计**：使用Tailwind类实现移动端适配
7. **风格体现**：充分体现用户描述的设计风格和要求
8. **错误处理**：对缺失数据提供默认值，确保代码健壮性
9. **纯函数**：只生成function声明，不要包含任何其他语句、导入或class定义
10. **语法正确**：确保生成的JavaScript代码语法完全正确
11. **菜单顺序**：必须按照固定顺序渲染菜单分类：Appetizers（前菜）→ Main Courses（主菜）→ Side Dishes（副菜）→ Desserts（甜点），不能使用for...in循环遍历菜单对象

## 菜单数据格式
data = {
    "店铺名称": "店名",
    "Slogan（中）": "中文标语",
    "Slogan (EN)": "英文标语", 
    "菜单": {
        "Appetizers": [{"菜品（中）": "菜名", "Dish (EN/FR)": "英文名", "身份梗·哲学说明": "描述"}],
        "Main Courses": [...],
        "Desserts": [...]
    }
}

## 代码质量标准
- 必须能直接运行，无语法错误
- 样式完整，视觉效果良好
- 数据绑定正确，支持动态内容
- 代码结构清晰，易于维护
- 充分体现用户描述的设计需求

## 特别注意事项
- 不要生成任何class定义或export语句
- 不要包含import语句或require语句
- 确保所有字符串正确转义，特别是模板字符串中的反引号
- 确保所有括号、大括号、方括号正确匹配
- 函数必须以function关键字开头，以}结尾
- 检查所有变量名拼写正确，避免typo
- 函数名必须是 ${functionName}，不要使用其他名称

请基于用户描述和以上示例，生成一个高质量、可直接使用的模版函数。直接输出JavaScript代码，不要包含markdown标记。
`;

        requestBody = {
            contents: [{
                parts: [{ text: prompt }]
            }],
            generationConfig: {
                response_mime_type: "text/plain"
            }
        };
    }

    // Send progress updates
    await sendUpdate({
        type: 'progress',
        stage: 'analyzing_input',
        message: type === 'image' ? '正在分析图片内容...' : '正在分析文字描述...',
        progress: 20
    });

    await sendUpdate({
        type: 'progress',
        stage: 'calling_ai',
        message: '正在调用AI生成模板代码...',
        progress: 40
    });

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("API Error Response:", errorBody);
        throw new Error(`API request failed with status ${response.status}`);
    }

    await sendUpdate({
        type: 'progress',
        stage: 'processing_code',
        message: '正在处理生成的代码...',
        progress: 80
    });

    const data = await response.json();
    return { jsCode: data.candidates[0].content.parts[0].text, functionName };
}

export default async function handler(req) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const { type, content, templateName } = await req.json();
        const apiKey = process.env.GOOGLE_AI_API_KEY;

        if (!apiKey) {
            return new Response(JSON.stringify({ error: 'Google AI API key is not configured.' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (!type || !content) {
            return new Response(JSON.stringify({ error: 'Type and content are required.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (type !== 'image' && type !== 'text') {
            return new Response(JSON.stringify({ error: 'Type must be either "image" or "text".' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Create a streaming response
        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                
                // Helper function to send updates
                const sendUpdate = async (data) => {
                    const message = `data: ${JSON.stringify(data)}\n\n`;
                    controller.enqueue(encoder.encode(message));
                };

                try {
                    // Send initial connection confirmation
                    await sendUpdate({
                        type: 'connected',
                        message: '连接已建立，开始生成AI模板...',
                        progress: 0
                    });

                    // Call the streaming AI function
                    const result = await callGoogleAIStreaming(content, type, apiKey, sendUpdate);
                    let jsCode = result.jsCode;
                    const functionName = result.functionName;
                    
                    // Clean up potential markdown markers
                    jsCode = jsCode.replace(/^```javascript\s*\n?/i, '').replace(/\n?```\s*$/i, '');
                    jsCode = jsCode.replace(/^```js\s*\n?/i, '').replace(/\n?```\s*$/i, '');
                    jsCode = jsCode.replace(/^```\s*\n?/i, '').replace(/\n?```\s*$/i, '');
                    
                    // Generate unique template ID
                    const timestamp = Date.now();
                    const templateId = `ai-template-${timestamp}`;
                    
                    // Send final result
                    await sendUpdate({
                        type: 'complete',
                        data: {
                            templateId,
                            templateName: templateName || 'AI生成模版',
                            jsCode: jsCode.trim(),
                            functionName: functionName,
                            createdAt: new Date().toISOString()
                        },
                        message: 'AI模板生成完成！',
                        progress: 100
                    });

                } catch (error) {
                    console.error('Error in streaming generate-ai-template function:', error);
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    
                    await sendUpdate({
                        type: 'error',
                        error: 'An internal server error occurred.',
                        details: errorMessage,
                        message: '模板生成过程中出现错误'
                    });
                } finally {
                    controller.close();
                }
            }
        });

        return new Response(stream, {
            status: 200,
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });

    } catch (error) {
        console.error('Error in generate-ai-template function:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return new Response(JSON.stringify({ 
            error: 'An internal server error occurred.', 
            details: errorMessage 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
