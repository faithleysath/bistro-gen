export const config = {
    runtime: 'edge',
};

// --- Mock LLM Function ---
// In a real-world scenario, you would replace this with a call to an actual LLM API (e.g., OpenAI, Google AI).
// This mock function simulates the API call and returns data in the expected format.
async function mockLLM(identity) {
    // A simple delay to simulate network latency
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Pre-defined responses for specific keywords to make the mock more fun
    if (identity.includes("程序员") || identity.includes("码农")) {
        return {
            "店铺名称": "二进制Bistro",
            "Slogan（中）": "在代码的喧嚣中，寻味字节间的片刻宁静。",
            "Slogan (EN)": "Where Bytes meet Bites.",
            "菜单": {
                "前菜 (Appetizers)": [
                    { "菜品（中）": "空指针沙拉", "Dish (EN/FR)": "Null Pointer Salade", "身份梗·哲学说明": "一份虚无主义的终极体验。盘中空无一物，正如你试图访问的那个不存在的内存地址。" },
                    { "菜品（中）": "调试风暴", "Dish (EN/FR)": "Le Débogage de Minuit", "身份梗·哲学说明": "精选红、黄、绿三色甜椒，象征着你与Bug的深夜搏斗。每一次咀嚼，都是一次断点的胜利。" }
                ],
                "主菜 (Main Courses)": [
                    { "菜品（中）": "祖传秘制意大利面", "Dish (EN/FR)": "Spaghetti Legacy", "身份梗·哲学说明": "面条缠绕，酱汁粘稠，一如你接手的那个屎山代码。每一口，都是对前人的“致敬”。" },
                    { "菜品（中）": "重构之梦", "Dish (EN/FR)": "Rêve de Refactoring", "身份梗·哲学说明": "将昨日的剩菜解构，以全新的分子料理形式呈现。入口即化，仿佛那段优雅重构后的代码。" }
                ],
                "甜点 (Desserts)": [
                    { "菜品（中）": "并发焦糖布丁", "Dish (EN/FR)": "Crème Brûlée Concurrente", "身份梗·哲学说明": "上层是滚烫的焦糖，下层是冰凉的布丁。感受这冰火两重天，如同处理多线程时的竞态条件。" }
                ]
            }
        };
    }

    // A generic, but still "pretentious", default response
    return {
        "店铺名称": `${identity.substring(0, 5)} Bistro`,
        "Slogan（中）": "我们不提供食物，只提供一种可以咀嚼的叙事。",
        "Slogan (EN)": "We don't serve food; we serve chewable narratives.",
        "菜单": {
            "前菜 (Appetizers)": [
                { "菜品（中）": "解构主义土豆泥", "Dish (EN/FR)": "Purée Déconstruite", "身份梗·哲学说明": "土豆不再是土豆，而是对“块茎”这一概念的重新审视。每一口都是对存在主义的叩问。" },
                { "菜品（中）": "情绪价值气泡水", "Dish (EN/FR)": "Eau Pétillante d'Émotion", "身份梗·哲学说明": "这杯水里没有矿物质，只有从阿尔卑斯山顶收集的，价值800块的情绪价值。" }
            ],
            "主菜 (Main Courses)": [
                { "菜品（中）": "意识流挞", "Dish (EN/FR)": "Tarte du Flux de Conscience", "身份梗·哲学说明": "味道的随机组合，象征着你混乱的思绪。你永远不知道下一口是什么，正如你不知道人生的意义。" }
            ],
            "配菜 (Sides)": [
                { "菜品（中）": "留白", "Dish (EN/FR)": "L'Espace Vide", "身份梗·哲学说明": "一只空盘。旨在提醒您，在过度消费的时代，真正的奢侈是“无”。盛惠，288。" }
            ],
            "甜点 (Desserts)": [
                { "菜品（中）": "雾化鸡尾酒", "Dish (EN/FR)": "Le Cocktail Nébulisé", "身份梗·哲学说明": "将酒精化为可吸入的灵感。我们认为，饮酒不应是吞咽，而应是呼吸。" }
            ]
        }
    };
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

        if (!identity || typeof identity !== 'string') {
            return new Response(JSON.stringify({ error: 'Identity is required and must be a string.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        
        // --- Here you would call the actual LLM API ---
        // For now, we use our mock function
        const menuData = await mockLLM(identity);
        
        return new Response(JSON.stringify(menuData), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Error in generate function:', error);
        return new Response(JSON.stringify({ error: 'An internal server error occurred.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
