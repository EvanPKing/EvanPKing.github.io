const content_dir = 'contents/'
const section_names = ['home', 'awards', 'experience', 'publications']
const LANG_STORAGE_KEY = 'homepage-lang'
const DEFAULT_LANG = 'en'

// Text that lives in index.html rather than in contents/*.md
const translations = {
    en: {
        nav: { home: 'HOME', awards: 'AWARDS', experience: 'EXPERIENCE', publications: 'PUBLICATIONS' },
        section: { awards: 'AWARDS', experience: 'EXPERIENCE', publications: 'PUBLICATIONS' },
        switchLabel: '中文',
        switchTitle: '切换到中文'
    },
    zh: {
        nav: { home: '首页', awards: '荣誉', experience: '经历', publications: '论文' },
        section: { awards: '荣誉奖项', experience: '实习与项目', publications: '论文发表' },
        switchLabel: 'EN',
        switchTitle: 'Switch to English'
    }
}

let currentLang = DEFAULT_LANG
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
}

async function loadConfig(lang, token) {
    try {
        const response = await fetch(`${content_dir}config.${lang}.yml`)
        if (!response.ok) throw new Error(`config.${lang}.yml: ${response.status}`)
        const yml = jsyaml.load(await response.text())
        if (token !== renderToken) return
        Object.keys(yml).forEach(key => {
            const el = document.getElementById(key)
            if (el) {
                el.innerHTML = yml[key]
            } else {
                console.log('Unknown id and value: ' + key + ',' + yml[key])
            }
        })
    } catch (error) {
        console.log(error)
    }
}

async function fetchMarkdown(name, lang) {
    const primary = `${content_dir}${name}.${lang}.md`
    let response = await fetch(primary)
    if (!response.ok && lang !== 'en') {
        response = await fetch(`${content_dir}${name}.en.md`)
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
    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav')
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        })
    }

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler')
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    )
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click()
            }
        })
    })

    marked.use({ mangle: false, headerIds: false })

    currentLang = readStoredLang()
    storeLang(currentLang)
    render(currentLang)

    const toggle = document.getElementById('lang-toggle')
    if (toggle) {
        toggle.addEventListener('click', () => {
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
})
