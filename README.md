# Shenghao Wang's Homepage

个人学术主页，基于 [Yixin0313/personal-homepage-template](https://github.com/Yixin0313/personal-homepage-template) 修改，支持中英文切换。

网址：<https://EvanPKing.github.io/>

## 本地预览

在仓库根目录运行：

```bash
python -m http.server 8000
```

然后打开 <http://localhost:8000>。

> 必须通过本地服务器打开。直接双击 `index.html` 时，浏览器会因安全策略拒绝读取 `contents/` 下的文件，页面会是空白。

## 目录结构

```
.
├── contents
│   ├── config.en.yml / config.zh.yml   # 标题、左上角名字、首页大标语、副标题、版权
│   ├── home.en.md / home.zh.md         # 简介、邮箱、教育背景、研究兴趣、最新动态
│   ├── awards.en.md / awards.zh.md     # 荣誉奖项
│   ├── experience.en.md / experience.zh.md  # 实习与项目经历
│   └── publications.en.md / publications.zh.md  # 论文发表
├── static
│   ├── assets
│   │   └── img
│   │       ├── background.jpeg         # 顶部背景图（建议 1920×400 以上）
│   │       └── photo.jpg               # 头像（原图比例即可）
│   ├── css
│   └── js
└── index.html
```

## 修改内容

- 英文内容改 `contents/*.en.md`，中文内容改 `contents/*.zh.md`，两者独立。
- 站点标题、标语、版权在 `contents/config.en.yml` 和 `config.zh.yml` 中修改。
- 替换图片时保持文件名不变即可：`static/assets/img/background.jpeg`、`photo.jpg`。
- 新增内容板块时，需要同时修改三处：`index.html` 中的 `<section>`、`static/js/scripts.js` 中的 `section_names`、以及 `translations` 里的导航与标题文字。

## 语言切换

导航栏右上角的「中文 / EN」按钮用于切换语言，选择会保存在浏览器 `localStorage` 中，下次访问自动沿用。

若某种语言的某个文件不存在，页面会自动回退到对应的英文文件。

## 部署

仓库需命名为 `<用户名>.github.io`。在 GitHub 仓库的 **Settings → Pages** 中，将 Source 设为 `main` 分支并保存，几分钟后即可通过 <https://EvanPKing.github.io/> 访问。

## Credit & License

模板来自 [Yixin0313/personal-homepage-template](https://github.com/Yixin0313/personal-homepage-template)，其基于 [Sen Li 的学术主页模板](https://github.com/senli1073/senli1073.github.io) 修改。本项目遵循 MIT 许可协议，详见 [LICENSE](LICENSE)。
