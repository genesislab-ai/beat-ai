# Sailor Moon Theme - 美少女战士主题

## 当前状态

已经创建了 Sailor Moon 主题的基础架构，目前使用的是占位 SVG 图片。

## 如何替换为真实的美少女战士图片

### 方法 1: 使用本地图片

1. 准备一张美少女战士的高质量图片（推荐分辨率：1920x1080 或更高）
2. 将图片命名为 `sailor-moon-bg.jpg` 或 `sailor-moon-bg.png`
3. 替换文件：
   ```bash
   # 备份当前占位SVG
   mv /Users/sunfei/development/test1/public/images/themes/sailor-moon-bg.svg /Users/sunfei/development/test1/public/images/themes/sailor-moon-bg.svg.backup

   # 复制你的图片
   cp /path/to/your/sailor-moon-image.jpg /Users/sunfei/development/test1/public/images/themes/sailor-moon-bg.jpg
   ```

4. 更新 `src/styles/Background.css` 中的图片路径（如果使用 .jpg）：
   ```css
   --theme-bg-image: url(/images/themes/sailor-moon-bg.jpg);
   ```

5. 更新 `src/components/ThemeSelector.js` 中的图片路径：
   ```javascript
   backgroundImage: '/images/themes/sailor-moon-bg.jpg',
   ```

### 方法 2: 使用在线图片（推荐用于测试）

如果你有在线的美少女战士图片链接，可以直接在代码中使用：

1. 编辑 `src/components/ThemeSelector.js`：
   ```javascript
   {
     id: 'sailor-moon',
     name: 'Sailor Moon',
     gradient: 'linear-gradient(135deg, #ff69b4 0%, #ffd700 50%, #87ceeb 100%)',
     gradientDark: 'linear-gradient(135deg, #ff69b4 0%, #ffd700 50%, #87ceeb 100%)',
     colors: ['#ff69b4', '#ffd700', '#87ceeb'],
     backgroundImage: 'https://your-image-url.com/sailor-moon.jpg',
     isImageTheme: true
   }
   ```

2. 编辑 `src/styles/Background.css`：
   ```css
   --theme-bg-image: url(https://your-image-url.com/sailor-moon.jpg);
   ```

### 推荐的图片风格

- **尺寸**: 1920x1080 或 2560x1440（高分辨率）
- **格式**: JPG（压缩后体积小）或 PNG（支持透明度）
- **内容**: 美少女战士经典场景，如：
  - 月亮背景下的变身场景
  - 五位战士集合画面
  - 粉色/金色为主的梦幻风格
  - 避免过于暗沉的图片（影响文字阅读）
- **优化**: 建议压缩到 500KB 以内，保证加载速度

### 图片来源建议

1. **官方授权素材**（推荐）
   - Toei Animation 官方网站
   - 正版周边商品图片

2. **粉丝艺术作品**（需注明来源）
   - Pixiv、DeviantArt 等平台的授权作品
   - 注意版权和使用许可

3. **免费素材网站**
   - Unsplash（搜索 anime/manga style）
   - Pexels（搜索相关风格）

## 主题特性

### 颜色方案
- **主色调**: 粉红色 (#ff69b4) - 代表月野兔的标志色
- **次要色**: 金色 (#ffd700) - 代表月亮和变身魔法
- **点缀色**: 天蓝色 (#87ceeb) - 代表梦幻和希望

### 视觉效果
- 背景图片透明度：25%（浅色模式）/ 15%（深色模式）
- 渐变覆盖层：确保内容可读性
- 光晕效果：粉色、金色、蓝色交替
- 月亮徽章：主题选择器中显示 🌙 图标

### 响应式设计
- 桌面端：完整背景图片展示
- 移动端：自适应缩放，保持视觉效果
- 深色模式：自动降低亮度，保护眼睛

## 测试主题

1. 启动开发服务器：
   ```bash
   cd /Users/sunfei/development/test1
   npm start
   ```

2. 访问 http://localhost:3000

3. 点击右上角的主题按钮（彩色方块）

4. 在 "Color Theme" 部分找到 "Sailor Moon" 主题（带有 🌙 图标）

5. 点击切换，查看效果

## 文件位置

- 主题配置: `/Users/sunfei/development/test1/src/components/ThemeSelector.js` (line 81-87)
- 主题样式: `/Users/sunfei/development/test1/src/styles/Background.css` (line 288-373)
- 图片位置: `/Users/sunfei/development/test1/public/images/themes/sailor-moon-bg.svg`（待替换）
- 选择器样式: `/Users/sunfei/development/test1/src/components/ThemeSelector.css` (line 538-572)

## 版权声明

美少女战士（Sailor Moon）是东映动画和武内直子的版权作品。本主题仅供个人学习和非商业用途使用。如需商业使用，请获取官方授权。

---

**提示**: 当前使用的是 SVG 占位图片，包含月亮、星星和装饰元素。建议尽快替换为真实的美少女战士图片以获得最佳视觉效果！
