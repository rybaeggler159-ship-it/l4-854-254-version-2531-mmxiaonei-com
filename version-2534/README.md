# 高分欧美视频 静态电影网站

- 首页：`index.html`
- 全部影片：`movies.html`
- 分类总览：`categories.html`
- 排行榜：`rankings.html`
- 全站内链：`site-index.html`

## 图片放置

请将 `1.jpg` 到 `150.jpg` 放在网站顶级目录，与 `index.html` 同级。页面会按影片顺序循环引用这些图片，不需要修改 HTML。

## 播放器

详情页播放器使用上传素材中的 HLS 逻辑文件 `assets/hls-dru42stk.js`。建议部署到普通 HTTP/HTTPS 静态服务器后访问，浏览器才能稳定加载 ES Module 与 m3u8 流。
