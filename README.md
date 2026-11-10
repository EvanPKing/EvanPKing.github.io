# Shenghao Wang's Homepage

个人学术主页，基于 [Yixin0313/personal-homepage-template](https://github.com/Yixin0313/personal-homepage-template) 修改。

布局为「顶部导航 + 左侧固定个人资料栏 + 右侧内容区」，支持深色/浅色主题和中英文切换。

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
│   ├── config.en.yml / config.zh.yml   # 站点标题、侧栏姓名与身份、联系方式链接、版权
│   ├── home.en.md / home.zh.md         # 简介、教育背景、研究兴趣、最新动态
│   ├── awards.en.md / awards.zh.md     # 荣誉奖项
│   ├── experience.en.md / experience.zh.md  # 工作经历
│   ├── projects.en.md / projects.zh.md      # 项目经历
│   └── publications.en.md / publications.zh.md  # 论文发表
├── static
│   ├── assets
│   │   └── img
│   │       ├── photo.jpg               # 头像（原图即可，页面里按圆形裁剪显示）
│   │       └── background.jpeg         # 旧版顶部背景图，当前布局不再使用
│   ├── css
│   └── js
└── index.html
```

## 修改内容

- 英文内容改 `contents/*.en.md`，中文内容改 `contents/*.zh.md`，两者独立。
- 站点标题、侧栏姓名/身份/所在地/单位、各社交链接和版权在 `contents/config.en.yml` 和 `config.zh.yml` 中修改：
  - 普通键（如 `sidebar-name`、`sidebar-role`）写入页面文字；
  - 以 `-href` 结尾的键（如 `email-href`、`github-href`）设置链接地址。
- 替换头像时保持文件名不变即可：`static/assets/img/photo.jpg`。
- 新增内容板块时，需要同时修改三处：`index.html` 中的 `<section>`、`static/js/scripts.js` 中的 `section_names`、以及 `translations` 里的导航与标题文字。

## 语言与主题切换

导航栏右上角有两个按钮：

- 「中文 / EN」切换语言，选择保存在 `localStorage`（`homepage-lang`）中，下次访问自动沿用；
- 太阳/月亮图标切换深色（默认）/浅色主题，选择保存在 `homepage-theme` 中。

也可以用链接参数直接分享指定状态，例如 `https://EvanPKing.github.io/?lang=zh&theme=light`。手动点击切换后，参数会从地址栏中移除。

若某种语言的某个文件不存在，页面会自动回退到对应的英文文件。

## 部署

仓库需命名为 `<用户名>.github.io`。在 GitHub 仓库的 **Settings → Pages** 中，将 Source 设为 `main` 分支并保存，几分钟后即可通过 <https://EvanPKing.github.io/> 访问。

## Credit & License

模板来自 [Yixin0313/personal-homepage-template](https://github.com/Yixin0313/personal-homepage-template)，其基于 [Sen Li 的学术主页模板](https://github.com/senli1073/senli1073.github.io) 修改。本项目遵循 MIT 许可协议，详见 [LICENSE](LICENSE)。
