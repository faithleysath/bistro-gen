# Bistro 主理人梗·菜单生成器

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ffaithleysath%2Fbistro-gen)

一个充满乐趣的 Web 应用，可以根据你输入的身份，自动生成一份充满“Bistro 梗”风格的浮夸菜单。灵感来源于中文互联网上对“网红 Bistro”现象的调侃。

**在线体验:** [https://bistro-gen.vercel.app/](https://bistro-gen.vercel.app/) (请替换为你的实际部署链接)

---

![Screenshot](https://user-images.githubusercontent.com/your-id/your-image.png) <!-- 建议替换为项目截图 -->

## ✨ 特性

- **智能生成**: 输入任何身份描述，即可获得一套完整的 Bistro 宣传文案，包括店铺名称、Slogan 和菜单。
- **多种风格**: 内置三套精美的主题模板，一键切换，满足不同“主理人”的审美需求：
    - 📜 **典雅羊皮纸**: 复古、经典，适合传统“老饕”。
    - 📄 **现代极简风**: 干净、利落，专为“冷淡风”爱好者设计。
    - 📟 **赛博故障风**: 像素、霓虹，献给来自未来的“数字游民”。
- **保存分享**: 轻松将生成的菜单保存为 PNG 图片，方便在社交媒体上分享你的“大作”。
- **轻量快速**: 基于 Vercel Edge Function，无需数据库，响应迅速。
- **轻松部署**: 通过 GitHub Actions 实现 CI/CD，推送到 `main` 分支即可自动部署。

## 🛠️ 技术栈

- **前端**: HTML, CSS, Vanilla JavaScript
- **后端**: Vercel Edge Function (Node.js)
- **图片生成**: `html2canvas` 库
- **部署**: Vercel & GitHub Actions

## 🚀 如何开始

### 本地开发

1.  **克隆仓库**:
    ```bash
    git clone https://github.com/your-username/bistro-gen.git
    cd bistro-gen
    ```

2.  **安装 Vercel CLI**:
    ```bash
    npm install -g vercel
    ```

3.  **启动本地开发服务器**:
    ```bash
    vercel dev
    ```
    现在，你可以在 `http://localhost:3000` 访问该应用。

### 部署到 Vercel

本项目已配置好通过 GitHub Actions 自动部署。

1.  **Fork 本仓库** 到你自己的 GitHub 账户。

2.  在 [Vercel](https://vercel.com/) 上创建一个新项目，并将其链接到你 Fork 的仓库。

3.  获取部署所需的 Secrets：
    - `VERCEL_TOKEN`: 在 Vercel 的 [Access Tokens](https://vercel.com/account/tokens) 页面创建一个新的 token。
    - `VERCEL_ORG_ID`: 在你的 Vercel 账户设置的 General 页面可以找到。
    - `VERCEL_PROJECT_ID`: 在你的 Vercel 项目设置的 General 页面可以找到。

4.  在你 Fork 的 GitHub 仓库中，进入 `Settings > Secrets and variables > Actions`，添加以上三个 `Repository secrets`。

5.  现在，每当你向 `main` 分支推送代码时，GitHub Actions 都会自动将项目部署到 Vercel 的生产环境。

## 🧠 替换为真实 LLM

`api/generate.js` 文件中的 `mockLLM` 函数是一个模拟实现。要使用真实的语言模型，请按以下步骤操作：

1.  选择一个 LLM 服务商（如 OpenAI, Google AI, Anthropic 等）。
2.  获取你的 API 密钥，并将其作为一个新的 Secret（例如 `LLM_API_KEY`）添加到你的 Vercel 项目环境变量中。
3.  修改 `api/generate.js` 文件：
    - 移除或注释掉 `mockLLM` 函数。
    - 在 `handler` 函数中，使用 `fetch` 调用你选择的 LLM API 端点。
    - 确保将用户的 `identity` 和项目要求的 `prompt` 作为请求体发送。
    - 从环境变量 `process.env.LLM_API_KEY` 中读取你的 API 密钥用于认证。

## 🤝 贡献

欢迎任何形式的贡献！无论是提交 Bug、提出新功能建议，还是创建新的菜单主题。

1.  Fork 仓库
2.  创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3.  提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4.  推送到分支 (`git push origin feature/AmazingFeature`)
5.  开启一个 Pull Request

## 📄 许可证

本项目采用 [MIT License](LICENSE) 授权。
