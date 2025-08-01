export const config = {
    runtime: 'edge',
};

// --- Real LLM Function ---
async function callGoogleAI(identity, apiKey) {
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

    const prompt = `
 “bistro主理人”是2025年中文互联网上一个热门的反讽梗，用来调侃一种过度包装、小资化、空有格调却缺乏实质的餐饮创业现象。
✅ 梗的来源与含义

“bistro” 原指法式小酒馆，主打精致创意菜，曾是“小众高端”的代名词。
“主理人” 本是个中性词，但在当下语境中，成了“个体工商户”或“小老板”的装腔替代词，听起来比“老板”“店长”更洋气、更有“故事感”。
当这两个词组合在一起——“bistro主理人”，就成了一种讽刺标签，暗指那些：
把回锅肉叫“迷雾三重奏”
把土豆丝装进法式白盘
把预制菜卖出米其林价格的
自称“有态度”“有理念”的餐饮创业者
🔥 网络玩梗方式

网友开始模仿造句，用“bistro主理人”的方式反讽过度包装：
“我是东北铁锅炖bistro主理人，主打冰晶琥珀酱香慢煮五花三合一风味矩阵。”
“夜市烤冷面主理人，专注街头碳水情绪疗愈。”
📉 梗背后的情绪

这个梗的流行，其实反映了年轻人对**“精致空壳化消费”**的反感：
菜是预制的，价格是高端的
装修是ins的，服务是冷漠的
故事是编的，体验是翻车的
于是，“bistro主理人”就成了对这种伪精致生活方式的集体吐槽。
一句话总结：
“bistro主理人”= 用洋词包装土饭，用故事掩盖空壳，用身份感收割年轻人的消费幻觉。

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
3.  **菜单**：包含 **前菜、主菜、配菜、甜点** 等分类，共 10–12 道菜 / 饮品，每道菜包含
    -   中英名称（英文可混杂法语/伪外文）
    -   合理价格（符合bistro定位）
    -   ≤ 30 字"哲学说明"，暗扣用户身份梗
    
**菜品数量要求**：
- 前菜：2-3道
- 主菜：3-4道  
- 配菜：2-3道
- 甜点：3-4道（必须多样化）

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
        "Side Dishes": [
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
- **价格设定**：前菜 $15-28，主菜 $32-58，配菜 $12-22，甜点 $18-25，体现bistro档次
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
