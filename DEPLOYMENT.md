# 部署配置指南

## 环境变量配置

本项目需要配置以下环境变量才能正常运行：

### 必需的环境变量

- `GOOGLE_AI_API_KEY`: Google AI API 密钥

### 获取 Google AI API 密钥

1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 登录你的 Google 账户
3. 点击 "Create API Key" 创建新的 API 密钥
4. 复制生成的 API 密钥

### 在 Vercel 中配置环境变量

#### 方法一：通过 Vercel Dashboard

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 进入 "Settings" 标签页
4. 点击左侧菜单中的 "Environment Variables"
5. 添加新的环境变量：
   - **Name**: `GOOGLE_AI_API_KEY`
   - **Value**: 你的 Google AI API 密钥
   - **Environment**: 选择 `Production`, `Preview`, 和 `Development`
6. 点击 "Save" 保存

#### 方法二：通过 Vercel CLI

```bash
# 安装 Vercel CLI（如果还没有安装）
npm i -g vercel

# 登录 Vercel
vercel login

# 在项目根目录下添加环境变量
vercel env add GOOGLE_AI_API_KEY

# 按提示输入 API 密钥值和选择环境
```

### 本地开发配置

1. 复制 `.env.example` 文件为 `.env`：
   ```bash
   cp .env.example .env
   ```

2. 编辑 `.env` 文件，填入你的 API 密钥：
   ```
   GOOGLE_AI_API_KEY=your_actual_api_key_here
   ```

3. 确保 `.env` 文件已被 `.gitignore` 忽略（已配置）

### 验证配置

部署完成后，你可以通过以下方式验证环境变量是否正确配置：

1. 访问你的应用
2. 尝试生成菜单功能
3. 如果出现 "Google AI API key is not configured" 错误，说明环境变量未正确设置

### 安全注意事项

- ⚠️ **永远不要**将 API 密钥直接写在代码中
- ⚠️ **永远不要**将 `.env` 文件提交到 Git 仓库
- ✅ 只在 `.env.example` 中提供示例格式
- ✅ 使用 Vercel 的环境变量功能安全存储敏感信息

### 故障排除

如果遇到 API 相关错误：

1. 检查 API 密钥是否正确设置
2. 确认 API 密钥是否有效且未过期
3. 检查 Google AI API 的使用配额
4. 查看 Vercel 函数日志获取详细错误信息
