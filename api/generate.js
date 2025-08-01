export const config = {
    runtime: 'edge',
};

// --- Real LLM Function ---
async function callGoogleAI(identity, apiKey) {
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

    const prompt = `
# 🌿 Bistro主理人梗·菜单生成提示词

## 角色
你是 **「反讽系 Pretentious Bistro 文案机」**
掌握 2025 年中文互联网对"bistro主理人" 的调侃精髓：
- 把寻常食材吹成宇宙命题
- 用英文 / 法语 / Emoji 点缀"高端氛围"
- 每一道菜都自带过度包装的 back-story

## 目标
根据 **用户的身份描述**，输出一份「xx Bistro」完整宣传套件：
1.  **店铺名称**：\`<身份关键词> Bistro\`，自带小资浪漫
2.  **一句话 Slogan**：中英双语，夸张宣称"理念"与"情绪疗愈"
3.  **菜单**：包含 **前菜、主菜、甜点** 等分类，共 5–7 道菜 / 饮品，每道菜包含
    -   中英名称（英文可混杂法语/伪外文）
    -   合理价格（符合bistro定位）
    -   ≤ 30 字"哲学说明"，暗扣用户身份梗

## 输入格式
    身份描述：${identity}

## **输出格式（严格遵守JSON格式，不要包含任何markdown标记）**
{
    "店铺名称": "<店铺名称>",
    "Slogan（中）": "<Slogan（中）>",
    "Slogan (EN)": "<Slogan (EN)>",
    "菜单": {
        "Appetizers": [
            {
                "菜品（中）": "<菜品（中）>",
                "Dish (EN/FR)": "<Dish (EN/FR)>",
                "价格": "<价格>",
                "身份梗·哲学说明": "<身份梗·哲学说明>"
            }
        ],
        "Main Courses": [
            {
                "菜品（中）": "<菜品（中）>",
                "Dish (EN/FR)": "<Dish (EN/FR)>",
                "价格": "<价格>",
                "身份梗·哲学说明": "<身份梗·哲学说明>"
            }
        ],
        "Desserts": [
            {
                "菜品（中）": "<菜品（中）>",
                "Dish (EN/FR)": "<Dish (EN/FR)>",
                "价格": "<价格>",
                "身份梗·哲学说明": "<身份梗·哲学说明>"
            }
        ]
    }
}

## 书写原则
- **高度抽象 + 反讽**：一眼看出"伪精致"气息
- **身份融合**：每道菜都暗藏身份元素的梗
- **华而不实**：用"微醺""雾化""灵感注入"等感性词汇
- **中英夹杂**：保持语义一致，杜绝机翻
- **价格设定**：前菜 $15-28，主菜 $32-58，甜点 $18-25，体现bistro档次
- 禁用 "XX-XX-XX" 码状标记
`;

    const body = {
        contents: [{
            parts: [{ text: prompt }]
        }],
        generationConfig: {
            response_mime_type: "application/json",
        }
    };

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("API Error Response:", errorBody);
        throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    // The response is nested, we need to extract the actual text content which is a JSON string.
    const jsonText = data.candidates[0].content.parts[0].text;
    return JSON.parse(jsonText);
}


export default async function handler(req) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const { identity } = await req.json();
        const apiKey = "AIzaSyA6DTysB4oaayFjG-8hEPohuDzsJ2OL590";

        if (!identity || typeof identity !== 'string') {
            return new Response(JSON.stringify({ error: 'Identity is required and must be a string.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        
        const menuData = await callGoogleAI(identity, apiKey);
        
        return new Response(JSON.stringify(menuData), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Error in generate function:', error);
        // Check if the error is a string and include it, otherwise provide a generic message.
        const errorMessage = error instanceof Error ? error.message : String(error);
        return new Response(JSON.stringify({ error: 'An internal server error occurred.', details: errorMessage }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
