export const config = {
    runtime: 'edge',
};

async function callGoogleAI(input, type, apiKey) {
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    let prompt = '';
    let requestBody = {};

    if (type === 'image') {
        // 处理图片分析
        prompt = `
# 菜单模版代码生成器

## 任务
分析上传的菜单图片，提取设计风格特征，生成一个完整的JavaScript模版函数。

## 分析要点
1. **色彩方案**：主色调、辅助色、背景色
2. **字体风格**：标题字体、正文字体、字号大小
3. **布局结构**：单列、双列、网格布局
4. **装饰元素**：边框、阴影、图标、分割线
5. **整体风格**：现代、复古、优雅、简约等

## 输出要求
生成一个完整的JavaScript函数，函数名为 renderAITemplate_001，包含：
1. 嵌入式CSS样式（使用模板字符串）
2. 完整的HTML结构
3. 适配菜单数据格式的动态内容生成

## 代码格式示例
\`\`\`javascript
function renderAITemplate_001(data) {
    const styles = \`
        <style>
        .ai-template-001 {
            /* 基于图片分析的样式 */
        }
        </style>
    \`;
    
    const shopName = data['店铺名称'] || 'AI Bistro';
    // ... 其他代码
    
    return \`完整的HTML文档\`;
}
\`\`\`

请直接输出JavaScript代码，不要包含markdown标记。
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
            }]
        };
    } else {
        // 处理文字描述
        prompt = `
# 菜单模版代码生成器

## 任务
根据用户的文字描述，生成一个符合要求的菜单模版JavaScript函数。

## 用户描述
${input}

## 输出要求
生成一个完整的JavaScript函数，函数名为 renderAITemplate_001，包含：
1. 嵌入式CSS样式（使用模板字符串）
2. 完整的HTML结构
3. 适配菜单数据格式的动态内容生成
4. 体现用户描述的设计风格

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

## 代码格式示例
\`\`\`javascript
function renderAITemplate_001(data) {
    const styles = \`
        <style>
        .ai-template-001 {
            /* 基于描述的样式 */
        }
        </style>
    \`;
    
    const shopName = data['店铺名称'] || 'AI Bistro';
    // ... 其他代码
    
    return \`完整的HTML文档\`;
}
\`\`\`

请直接输出JavaScript代码，不要包含markdown标记。
`;

        requestBody = {
            contents: [{
                parts: [{ text: prompt }]
            }]
        };
    }

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

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
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
        const apiKey = "AIzaSyA6DTysB4oaayFjG-8hEPohuDzsJ2OL590";

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
        
        const jsCode = await callGoogleAI(content, type, apiKey);
        
        // 生成唯一的模版ID
        const templateId = `ai-template-${Date.now()}`;
        
        return new Response(JSON.stringify({
            templateId,
            templateName: templateName || 'AI生成模版',
            jsCode: jsCode.trim(),
            createdAt: new Date().toISOString()
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
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
