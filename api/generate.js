// Vercel Serverless Function
export const config = {
    runtime: 'edge',
};

// The prompt template remains the same
const getPrompt = (identity) => `
# 角色
你是「反讽系 Pretentious Bistro 文案机」。你掌握 2025 年中文互联网对“bistro主理人”的调侃精髓：把寻常食材吹成宇宙命题，用英文/法语/Emoji点缀“高端氛围”，每一道菜都自带过度包装的 back-story。

# 任务
根据用户的身份描述，输出一份「xx Bistro」的完整宣传套件。

# 输入
身份描述: "${identity}"

# 输出格式 (严格遵守以下的JSON结构，不要添加任何Markdown标记)
{
  "shop_name": "<身份关键词> Bistro",
  "slogan": {
    "cn": "一句话中文Slogan，夸张宣称理念与情绪疗愈",
    "en": "An English slogan, exaggerating concepts and emotional healing"
  },
  "menu": [
    {
      "id": 1,
      "name_cn": "菜品中文名",
      "name_en": "Dish English/French Name",
      "description": "不超过30字的哲学说明，暗扣用户身份梗"
    },
    {
      "id": 2,
      "name_cn": "菜品中文名",
      "name_en": "Dish English/French Name",
      "description": "不超过30字的哲学说明，暗扣用户身份梗"
    },
    {
      "id": 3,
      "name_cn": "菜品中文名",
      "name_en": "Dish English/French Name",
      "description": "不超过30字的哲学说明，暗扣用户身份梗"
    },
    {
      "id": 4,
      "name_cn": "菜品中文名",
      "name_en": "Dish English/French Name",
      "description": "不超过30字的哲学说明，暗扣用户身份梗"
    },
    {
      "id": 5,
      "name_cn": "饮品中文名",
      "name_en": "Drink English/French Name",
      "description": "不超过30字的哲学说明，暗扣用户身份梗"
    }
  ]
}
`;

// --- Main Handler ---

export default async function handler(request) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        // --- 1. Get Environment Variables ---
        const apiBaseUrl = process.env.LLM_API_BASE_URL;
        const apiKey = process.env.LLM_API_KEY;
        const modelName = process.env.LLM_MODEL_NAME;

        // --- 2. Validate Configuration ---
        if (!apiBaseUrl || !apiKey || !modelName) {
            const missing = [
                !apiBaseUrl && "LLM_API_BASE_URL",
                !apiKey && "LLM_API_KEY",
                !modelName && "LLM_MODEL_NAME"
            ].filter(Boolean).join(', ');

            return new Response(JSON.stringify({ error: `Server configuration error. Missing environment variables: ${missing}` }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // --- 3. Get User Input ---
        const { identity } = await request.json();
        if (!identity) {
            return new Response(JSON.stringify({ error: 'Identity is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // --- 4. Call LLM API ---
        const prompt = getPrompt(identity);
        const payload = {
            model: modelName,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            response_format: { "type": "json_object" },
        };

        const llmResponse = await fetch(apiBaseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify(payload),
        });

        if (!llmResponse.ok) {
            const errorBody = await llmResponse.text();
            console.error(`LLM API error from ${apiBaseUrl}:`, errorBody);
            return new Response(JSON.stringify({ error: `Failed to get a response from the chef.` }), {
                status: llmResponse.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const data = await llmResponse.json();
        const content = data.choices[0].message.content;
        
        const jsonContent = JSON.parse(content);

        // --- 5. Return Response ---
        return new Response(JSON.stringify(jsonContent), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Error in generate function:', error);
        if (error instanceof SyntaxError) {
             return new Response(JSON.stringify({ error: 'The chef had a moment of confusion and returned an invalid menu format. Please try again.' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        return new Response(JSON.stringify({ error: 'An unexpected error occurred.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
