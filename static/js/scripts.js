const content_dir = 'contents/'
const section_names = ['home', 'awards', 'experience', 'projects', 'publications']
const LANG_STORAGE_KEY = 'homepage-lang'
const THEME_STORAGE_KEY = 'homepage-theme'
const DEFAULT_LANG = 'en'
const DEFAULT_THEME = 'dark'

// Text that lives in index.html rather than in contents/*.md
const translations = {
    en: {
        nav: { home: 'Homepage', awards: 'Honors', experience: 'Experience', projects: 'Projects', publications: 'Publications' },
        section: { awards: 'Honors', experience: 'Experience', projects: 'Projects', publications: 'Publications' },
        switchLabel: '中文',
        switchTitle: '切换到中文',
        themeLight: 'Switch to light mode',
        themeDark: 'Switch to dark mode'
    },
    zh: {
        nav: { home: '首页', awards: '荣誉', experience: '经历', projects: '项目', publications: '论文' },
        section: { awards: '荣誉奖项', experience: '工作经历', projects: '项目经历', publications: '论文发表' },
        switchLabel: 'EN',
        switchTitle: 'Switch to English',
        themeLight: '切换到浅色模式',
        themeDark: '切换到深色模式'
    }
}

let currentLang = DEFAULT_LANG
let currentTheme = DEFAULT_THEME
let renderToken = 0

function readStoredLang() {
    try {
        // Allow sharing a link in a specific language: index.html?lang=zh
        const fromUrl = new URLSearchParams(window.location.search).get('lang')
        if (fromUrl === 'zh' || fromUrl === 'en') return fromUrl

        const stored = localStorage.getItem(LANG_STORAGE_KEY)
        return stored === 'zh' || stored === 'en' ? stored : DEFAULT_LANG
    } catch {
        return DEFAULT_LANG
    }
}

function storeLang(lang) {
    try {
        localStorage.setItem(LANG_STORAGE_KEY, lang)
    } catch {
        // Private browsing or blocked storage: language simply does not persist.
    }
}

function readTheme() {
    try {
        // Allow sharing a link in a specific theme: index.html?theme=light
        const fromUrl = new URLSearchParams(window.location.search).get('theme')
        if (fromUrl === 'light' || fromUrl === 'dark') return fromUrl

        const stored = localStorage.getItem(THEME_STORAGE_KEY)
        return stored === 'light' ? 'light' : DEFAULT_THEME
    } catch {
        return DEFAULT_THEME
    }
}

function storeTheme(theme) {
    try {
        localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
        // Private browsing or blocked storage: theme simply does not persist.
    }
}

function updateThemeButton() {
    const button = document.getElementById('theme-toggle')
    if (!button) return

    const dict = translations[currentLang] || translations[DEFAULT_LANG]
    const goingToLight = currentTheme === 'dark'
    button.innerHTML = goingToLight
        ? '<i class="bi bi-sun-fill"></i>'
        : '<i class="bi bi-moon-stars-fill"></i>'
    button.title = goingToLight ? dict.themeLight : dict.themeDark
    button.setAttribute('aria-label', button.title)
}

function applyTheme(theme) {
    currentTheme = theme === 'light' ? 'light' : 'dark'
    document.documentElement.dataset.theme = currentTheme
    updateThemeButton()
}

function applyStaticText(lang) {
    const dict = translations[lang] || translations[DEFAULT_LANG]
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const [group, name] = el.dataset.i18n.split('.')
        const value = dict[group] && dict[group][name]
        if (value) el.textContent = value
    })

    const toggle = document.getElementById('lang-toggle')
    if (toggle) {
        toggle.textContent = dict.switchLabel
        toggle.title = dict.switchTitle
        toggle.setAttribute('aria-label', dict.switchTitle)
    }

    updateThemeButton()
}

async function loadConfig(lang, token) {
    try {
        const response = await fetch(`${content_dir}config.${lang}.yml`, { cache: 'no-cache' })
        if (!response.ok) throw new Error(`config.${lang}.yml: ${response.status}`)
        const yml = jsyaml.load(await response.text())
        if (token !== renderToken) return
        Object.keys(yml).forEach(key => {
            const el = document.getElementById(key)
            if (!el) {
                console.log('Unknown id and value: ' + key + ',' + yml[key])
                return
            }
            // Keys such as email-href / github-href set a link target instead of text.
            if (key.endsWith('-href')) {
                el.setAttribute('href', yml[key])
            } else {
                el.innerHTML = yml[key]
            }
        })
    } catch (error) {
        console.log(error)
    }
}

async function fetchMarkdown(name, lang) {
    const primary = `${content_dir}${name}.${lang}.md`
    let response = await fetch(primary, { cache: 'no-cache' })
    if (!response.ok && lang !== 'en') {
        response = await fetch(`${content_dir}${name}.en.md`, { cache: 'no-cache' })
    }
    if (!response.ok) throw new Error(`${name}.${lang}.md: ${response.status}`)
    return response.text()
}

async function loadSection(name, lang, token) {
    try {
        const markdown = await fetchMarkdown(name, lang)
        if (token !== renderToken) return
        const target = document.getElementById(name + '-md')
        if (target) target.innerHTML = marked.parse(markdown)
    } catch (error) {
        console.log(error)
    }
}

function typesetMath() {
    if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
        window.MathJax.typesetPromise().catch(error => console.log(error))
    }
}

async function render(lang) {
    const token = ++renderToken
    applyStaticText(lang)
    await Promise.all([
        loadConfig(lang, token),
        ...section_names.map(name => loadSection(name, lang, token))
    ])
    if (token === renderToken) typesetMath()
}

window.addEventListener('DOMContentLoaded', () => {
    marked.use({ mangle: false, headerIds: false })

    // Highlight the section currently in view.
    const siteNav = document.getElementById('site-nav')
    if (siteNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#site-nav',
            offset: 90
        })
    }

    currentLang = readStoredLang()
    storeLang(currentLang)
    render(currentLang)

    currentTheme = readTheme()
    applyTheme(currentTheme)

    const langToggle = document.getElementById('lang-toggle')
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            currentLang = currentLang === 'en' ? 'zh' : 'en'
            storeLang(currentLang)

            // Drop ?lang=... so a reload keeps the language just chosen.
            const url = new URL(window.location.href)
            if (url.searchParams.has('lang')) {
                url.searchParams.delete('lang')
                window.history.replaceState({}, '', url)
            }

            render(currentLang)
        })
    }

    const themeToggle = document.getElementById('theme-toggle')
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const next = currentTheme === 'dark' ? 'light' : 'dark'
            storeTheme(next)

            // Drop ?theme=... so a reload keeps the theme just chosen.
            const url = new URL(window.location.href)
            if (url.searchParams.has('theme')) {
                url.searchParams.delete('theme')
                window.history.replaceState({}, '', url)
            }

            applyTheme(next)
        })
    }
})
