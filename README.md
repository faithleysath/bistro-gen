# 🌿 Bistro 梗生成器

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fyour-repo-name)

这是一个充满乐趣的Web应用，可以根据用户输入的身份、职业或任何关键词，生成一份充满“伪精致”和“反讽”风格的Bistro菜单。灵感源自中文互联网对“Bistro文化”的精彩解构。

## ✨ 功能

- **身份定制菜单**：输入任何天马行空的身份，获得一份专属的Bistro菜单。
- **JSON驱动**：后端调用大语言模型（LLM）并强制返回JSON，确保数据稳定可靠。
- **一键保存**：将生成的精美菜单保存为PNG图片，方便分享。
- **轻松部署**：通过Vercel一键部署，无需复杂的服务器配置。
- **灵活的模型支持**：支持任何兼容OpenAI API格式的模型提供商，通过环境变量即可配置。

## 🚀 快速开始

### 部署

1.  点击上方的 "Deploy with Vercel" 按钮，或手动将此仓库Fork到您的GitHub账户，然后在Vercel上导入该项目。
2.  在Vercel项目的设置中，配置下文所述的三个环境变量。

### 环境变量配置

您需要在Vercel项目的 **Settings -> Environment Variables** 中配置以下三个变量。这适用于任何兼容OpenAI API的服务。

- `LLM_API_BASE_URL`: 您的LLM提供商的API端点。
- `LLM_API_KEY`: 您的API密钥。
- `LLM_MODEL_NAME`: 您希望使用的模型名称。

---

#### 示例：使用 OpenAI

```
LLM_API_BASE_URL=https://api.openai.com/v1/chat/completions
LLM_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
LLM_MODEL_NAME=gpt-4o
```

#### 示例：使用 Groq

```
LLM_API_BASE_URL=https://api.groq.com/openai/v1/chat/completions
LLM_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
LLM_MODEL_NAME=llama3-8b-8192
```

#### 示例：使用其他兼容服务 (如本地模型)

```
LLM_API_BASE_URL=http://your-local-service:8080/v1/chat/completions
LLM_API_KEY=any-string-will-do-for-some-local-models
LLM_MODEL_NAME=your-custom-model-name
```

---

## 🛠️ 本地开发

1.  克隆仓库到本地：
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  安装 Vercel CLI：
    ```bash
    npm install -g vercel
    ```

3.  创建 `.env` 文件，并根据上面的“环境变量配置”部分的示例填入您的API信息。
    ```.env
    # Example for OpenAI
    LLM_API_BASE_URL=https://api.openai.com/v1/chat/completions
    LLM_API_KEY=sk-xxxxxxxxxx
    LLM_MODEL_NAME=gpt-4o
    ```

4.  启动本地开发服务器：
    ```bash
    vercel dev
    ```

5.  在浏览器中打开 `http://localhost:3000` 即可访问。

## 📁 项目结构

```
.
├── api/
│   └── generate.js   # Vercel无服务器函数，处理API逻辑
├── .github/
│   └── workflows/
│       └── deploy.yml # GitHub Actions CI/CD 配置文件
├── index.html        # 应用主页面
└── README.md         # 就是你正在看的这个文件
```

## 🤝 贡献

欢迎提交Pull Request或提出Issue来改进这个项目！
