export const config = {
    runtime: 'edge',
};

// --- Streaming LLM Function ---
async function callGoogleAIStreaming(identity, apiKey, sendUpdate) {
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`;

    const prompt = `
 "bistro主理人"是2025年中文互联网上一个热门的反讽梗，用来调侃一种过度包装、小资化、空有格调却缺乏实质的餐饮创业现象。
✅ 梗的来源与含义

"bistro" 原指法式小酒馆，主打精致创意菜，曾是"小众高端"的代名词。
"主理人" 本是个中性词，但在当下语境中，成了"个体工商户"或"小老板"的装腔替代词，听起来比"老板""店长"更洋气、更有"故事感"。
当这两个词组合在一起——"bistro主理人"，就成了一种讽刺标签，暗指那些：
把回锅肉叫"迷雾三重奏"
把土豆丝装进法式白盘
把预制菜卖出米其林价格的
自称"有态度""有理念"的餐饮创业者
🔥 网络玩梗方式

网友开始模仿造句，用"bistro主理人"的方式反讽过度包装：
"我是东北铁锅炖bistro主理人，主打冰晶琥珀酱香慢煮五花三合一风味矩阵。"
"夜市烤冷面主理人，专注街头碳水情绪疗愈。"
📉 梗背后的情绪

这个梗的流行，其实反映了年轻人对**"精致空壳化消费"**的反感：
菜是预制的，价格是高端的
装修是ins的，服务是冷漠的
故事是编的，体验是翻车的
于是，"bistro主理人"就成了对这种伪精致生活方式的集体吐槽。
一句话总结：
"bistro主理人"= 用洋词包装土饭，用故事掩盖空壳，用身份感收割年轻人的消费幻觉。

## 🎯 Few Shot 示例参考

### 示例1：社会学专业bistro主理人
**店名**：田野炊烟 | Fieldwork Bistro
**标语**：在流动的现代性里炖煮思想 | Simmering Ideas in Liquid Modernity

**前菜 | Appetizers**
1. 韦伯的理性牢笼小食拼盘 ￥98/份
   • 帕尔马火腿（科层制切片）
   • 蜂蜜烤布里奶酪（新教伦理涂层）
   • 分子芒果鱼子酱（祛魅的爆裂）
   互动：用钥匙形饼干打开铁艺鸟笼取食

2. 福柯的权力沙拉 ￥88/份
   "规训的滋味，反抗的脆爽"
   • 全景敞视罗马生菜
   • 毛细血管酱汁（权力微观物理学）
   • 可食用银箔（自我技术装饰）

**主菜 | Mains**
1. 马克思的异化汉堡 ￥128/份
   "劳动异化的美味解构"
   • 全麦面包（经济基础）
   • 安格斯牛肉饼（剩余价值）
   • 融化解构芝士（虚假意识）
   • 酸黄瓜（阶级矛盾）
   配菜：薯条（无产阶级团结）

2. 布迪厄的品味牛排 ￥188/200g
   "用刀叉切割阶级区隔"
   • M9和牛（精英资本）
   • 黑松露酱（文化资本）
   • 普罗旺斯炖菜（惯习沉淀）

**甜点 | Desserts**
1. 福柯的圆形监狱提拉米苏 ￥138/份
   "每一勺都在监视之下"
   • 咖啡酒浸润（规训渗透）
   • 巧克力粉监狱平面图

2. 鲍曼的流动现代性熔岩蛋糕 ￥148/份
   "坚固的壳，流动的心"
   • 黑巧克力外壳（制度固化）
   • 树莓岩浆（个体化流动）
   • 可食用金箔（消费社会幻象）

**饮品 | Drinks**
1. 齐美尔的都市忧郁冰饮 ￥68/杯
   "陌生人的距离，冰与糖的辩证"
   • 蝶豆花冰沙（社交距离蓝）
   • 咖啡冻（陌生人焦虑）
   • 跳跳糖奶盖（神经官能症）

2. 结构功能主义鸡尾酒 ￥75/杯
   "社会系统的平衡与失衡"
   • 显功能（果汁）/ 潜功能（酒精）
   • 正功能（甜型）/ 反功能（苦型）
   顾客自选社会变量（家庭/教育/宗教）调整配比

**社会学实验 | Social Experiments**
1. 餐桌上的民族志
   • 每桌配发录音笔黄油刀，记录用餐对话
   • 餐后生成《互动权力结构分析报告》
2. 月度《Bistro社会观察白皮书》

### 示例2：新传专业bistro主理人
**店名**：媒介方舟 | Media Ark Bistro
**标语**：在信息洪流中停泊理性的锚点 | Anchor Your Reason in the Information Deluge

**前菜 | Appetizers | 真相的舢板**
《议程设置牡蛎塔 | Agenda-Setting Oyster Trio》
描述："谁决定了你的关注焦点" (Who Sets Your Focus?)
构成：
吉拉多生蚝（头条事件）| 青柠雪芭（时效性）| 苹果木烟熏（舆论惯性）｜酥炸生蚝（爆点话题）| 辣椒跳跳糖（情绪传染）
呈现：盛于旋转镜面托盘（反射媒体多棱角）
¥88

**主菜 | Main Courses | 深海的真相**
菜品1：《舆论漩涡烤剑鱼 | Public Opinion Swordfish》
描述："在风暴中心保持垂直" (Staying Upright in the Storm)
构成：
炭烤剑鱼排（独立媒体）
墨鱼汁螺旋面（信息黑箱）| 发酵黑蒜泥（阴谋论）
可食用碳粉脆网（数据迷雾）
体验：淋热白葡萄酒触发干冰"舆论风暴"
¥268

菜品2:《后真相熔岩阵 | Post-Truth Lava Field》
描述："当情感成为武器" (When Emotion Becomes Arsenal)
构成：
滚石辣味巧克力（愤怒岩块）
液氮覆盆子冰沙（群体冷暴力）
姜黄泡沫（虚假共识）
交互：顾客用"事实探针"戳破糖壳释放真相酱汁
¥128

**饮品 | Beverages | 思想的压舱石**
《鲍德里亚的拟象漩涡 | Baudrillard's Simulacra Swirl》
构成：百香果泥+伏特加+液氮芒果云（超真实）+ 全息投影杯垫（实时生成社交媒体碎片）
警示：饮尽后杯底显现"你消费的只是符号"
¥78

**沉浸式剧场 | Media Ark Immersion**
每晚20:00全店灯光转暗，投影墙播放"历史上的今日谣言"
顾客用激光笔标记漏洞，集满解锁"真相特饮"
"当所有船都在随波逐流，方舟是唯一逆流的容器"

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

**菜名创意要求**：
- **长度要求**：菜名必须8-15个字，越长越抽象越好
- **多样化格式混合使用**：避免全部使用"XX的XX"格式，必须混合以下多种命名模式：
  * **直接概念堆叠**：如"量子纠缠风味矩阵""后现代主义解构实验室""存在主义危机重建工程"
  * **诗意"的"字结构**：如"午夜三点钟的液体建筑学""平行宇宙中的情感考古学""虚无缥缈的碳水化合物哲学"
  * **动词+抽象名词**：如"消解时空维度体验""重构童年记忆碎片""解码情感频率调制器"
  * **学科融合式**：如"数字人类学感官重建项目""印象派光影社交恐惧症疗愈""量子物理学情绪治疗系统"
  * **时空+情感组合**：如"凌晨四点存在主义咖啡因依赖症""跨越三时区的断层地质学实验""第四维度青春迷失综合征"
  * **科技+艺术混搭**：如"算法重新定义的古典主义美学""云端计算中漂浮的记忆碎片""数字化焦虑症模拟治疗方案"
- 每道菜名必须采用不同的语言结构，绝对避免重复同一种命名模式
- 在一份菜单中，各种格式要均匀分布，不能偏重某一种模式
    
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
- **价格设定**：前菜 ¥68-98，主菜 ¥128-268，配菜 ¥58-88，甜点 ¥78-148，体现bistro档次
- **专业术语巧妙运用**：
  * 将专业理论家姓名直接融入菜名（如"韦伯的理性牢笼""福柯的权力沙拉"）
  * 用专业概念重新定义食材（如"科层制切片""权力微观物理学""剩余价值"）
  * 将抽象理论具象化为可感知的味觉体验
- **互动体验设计**：
  * 为菜品设计符合专业特色的互动环节（如"用钥匙形饼干打开铁艺鸟笼取食"）
  * 创造沉浸式用餐体验（如"淋热白葡萄酒触发干冰舆论风暴"）
  * 设计专业相关的餐厅活动（如"餐桌上的民族志""月度白皮书"）
- **菜品构成详细化**：
  * 为每道菜提供详细的食材构成说明
  * 用专业术语重新命名普通食材
  * 在括号中标注食材的"理论意义"
- **菜名多样化要求**：
  * 严格要求菜名长度在8-15个字之间，越长越抽象越好
  * 必须混合使用多种命名格式，避免单一"XX的XX"模式
  * 在一份菜单中均匀分布：直接概念堆叠、诗意"的"字结构、动词+抽象名词、学科融合式、时空+情感组合、科技+艺术混搭等
  * 融合多个学科概念：哲学+心理学+物理学+艺术+科技
  * 每道菜名都要有独特的语言结构，绝对避免重复同一种命名模式
  * 优先使用令人完全困惑但听起来极其高级的超长抽象词汇组合
  * 示例多样化标准：既有"第四维度空间寻找失落青春味觉考古学实验"（直接堆叠），也有"午夜三点钟的液体建筑学"（诗意结构）
- **情感渲染与氛围营造**：
  * 为每道菜配上富有诗意的描述语句（如"规训的滋味，反抗的脆爽"）
  * 用引号突出关键理念表达
  * 营造专业领域特有的思辨氛围
- **学习示例精神**：
  * 参考提供的社会学和新传专业示例的创意手法
  * 保持同等水准的专业深度和创意表达
  * 确保每个专业都有其独特的表达方式和专业特色
- 禁用 "XX-XX-XX" 码状标记
`;

    // Send initial progress update
    await sendUpdate({
        type: 'progress',
        stage: 'analyzing_identity',
        message: '正在分析身份特征...',
        progress: 10
    });

    const body = {
        contents: [{
            parts: [{ text: prompt }]
        }],
        generationConfig: {
            response_mime_type: "application/json",
            response_schema: {
                type: "object",
                properties: {
                    "店铺名称": { 
                        type: "string",
                        description: "餐厅名称"
                    },
                    "Slogan（中）": { 
                        type: "string",
                        description: "中文标语"
                    },
                    "Slogan (EN)": { 
                        type: "string",
                        description: "英文标语"
                    },
                    "菜单": {
                        type: "object",
                        properties: {
                            "Appetizers": {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        "菜品（中）": { 
                                            type: "string",
                                            description: "中文菜品名称"
                                        },
                                        "Dish (EN/FR)": { 
                                            type: "string",
                                            description: "英文或法文菜品名称"
                                        },
                                        "价格": { 
                                            type: "string",
                                            description: "菜品价格，格式如¥88"
                                        },
                                        "身份梗·哲学说明": { 
                                            type: "string",
                                            description: "菜品的哲学说明或身份梗描述"
                                        }
                                    },
                                    required: ["菜品（中）", "Dish (EN/FR)", "价格", "身份梗·哲学说明"],
                                    additionalProperties: false
                                },
                                minItems: 2,
                                maxItems: 3
                            },
                            "Main Courses": {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        "菜品（中）": { 
                                            type: "string",
                                            description: "中文菜品名称"
                                        },
                                        "Dish (EN/FR)": { 
                                            type: "string",
                                            description: "英文或法文菜品名称"
                                        },
                                        "价格": { 
                                            type: "string",
                                            description: "菜品价格，格式如¥128"
                                        },
                                        "身份梗·哲学说明": { 
                                            type: "string",
                                            description: "菜品的哲学说明或身份梗描述"
                                        }
                                    },
                                    required: ["菜品（中）", "Dish (EN/FR)", "价格", "身份梗·哲学说明"],
                                    additionalProperties: false
                                },
                                minItems: 3,
                                maxItems: 4
                            },
                            "Side Dishes": {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        "菜品（中）": { 
                                            type: "string",
                                            description: "中文菜品名称"
                                        },
                                        "Dish (EN/FR)": { 
                                            type: "string",
                                            description: "英文或法文菜品名称"
                                        },
                                        "价格": { 
                                            type: "string",
                                            description: "菜品价格，格式如¥68"
                                        },
                                        "身份梗·哲学说明": { 
                                            type: "string",
                                            description: "菜品的哲学说明或身份梗描述"
                                        }
                                    },
                                    required: ["菜品（中）", "Dish (EN/FR)", "价格", "身份梗·哲学说明"],
                                    additionalProperties: false
                                },
                                minItems: 2,
                                maxItems: 3
                            },
                            "Desserts": {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        "菜品（中）": { 
                                            type: "string",
                                            description: "中文菜品名称"
                                        },
                                        "Dish (EN/FR)": { 
                                            type: "string",
                                            description: "英文或法文菜品名称"
                                        },
                                        "价格": { 
                                            type: "string",
                                            description: "菜品价格，格式如¥88"
                                        },
                                        "身份梗·哲学说明": { 
                                            type: "string",
                                            description: "菜品的哲学说明或身份梗描述"
                                        }
                                    },
                                    required: ["菜品（中）", "Dish (EN/FR)", "价格", "身份梗·哲学说明"],
                                    additionalProperties: false
                                },
                                minItems: 3,
                                maxItems: 4
                            }
                        },
                        required: ["Appetizers", "Main Courses", "Side Dishes", "Desserts"],
                        additionalProperties: false
                    }
                },
                required: ["店铺名称", "Slogan（中）", "Slogan (EN)", "菜单"],
                additionalProperties: false
            }
        }
    };

    await sendUpdate({
        type: 'progress',
        stage: 'calling_ai',
        message: '正在调用AI生成菜单...',
        progress: 30
    });

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

    await sendUpdate({
        type: 'progress',
        stage: 'processing_response',
        message: '正在处理AI响应...',
        progress: 70
    });

    const data = await response.json();
    
    // With JSON Schema, Gemini returns structured data directly
    // Check if the response contains structured data or text that needs parsing
    const responseContent = data.candidates[0].content.parts[0];
    
    let menuData;
    if (responseContent.text) {
        // If it's text, try to parse as JSON
        try {
            menuData = JSON.parse(responseContent.text);
        } catch (parseError) {
            console.error('Failed to parse JSON text:', parseError);
            console.error('Raw text:', responseContent.text);
            throw new Error('Invalid JSON response from AI');
        }
    } else if (responseContent.structuredData) {
        // If it's structured data, use it directly
        menuData = responseContent.structuredData;
    } else {
        // Fallback: assume the entire response content is the data
        menuData = responseContent;
    }

    await sendUpdate({
        type: 'progress',
        stage: 'finalizing',
        message: '正在完成菜单生成...',
        progress: 90
    });

    return menuData;
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
        const apiKey = process.env.GOOGLE_AI_API_KEY;

        if (!apiKey) {
            return new Response(JSON.stringify({ error: 'Google AI API key is not configured.' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (!identity || typeof identity !== 'string') {
            return new Response(JSON.stringify({ error: 'Identity is required and must be a string.' }), {
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
                        message: '连接已建立，开始生成菜单...',
                        progress: 0
                    });

                    // Call the streaming AI function
                    const menuData = await callGoogleAIStreaming(identity, apiKey, sendUpdate);
                    
                    // Send final result
                    await sendUpdate({
                        type: 'complete',
                        data: menuData,
                        message: '菜单生成完成！',
                        progress: 100
                    });

                } catch (error) {
                    console.error('Error in streaming generate function:', error);
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    
                    await sendUpdate({
                        type: 'error',
                        error: 'An internal server error occurred.',
                        details: errorMessage,
                        message: '生成过程中出现错误'
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
        console.error('Error in generate function:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return new Response(JSON.stringify({ error: 'An internal server error occurred.', details: errorMessage }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
