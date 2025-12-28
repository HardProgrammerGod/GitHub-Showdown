const APIURL = 'https://api.github.com/users/'
const main = document.getElementById('main')
const form = document.getElementById('form')
const themeToggle = document.getElementById('theme-toggle')
const langToggle = document.getElementById('lang-toggle')

let currentLang = 'en'

const translations = {
    en: {
        placeholder: "User",
        button: "Compare",
        dominant: "DOMINANT",
        repos: "Repositories",
        followers: "Followers",
        power: "Power Index",
        error: "USER NOT FOUND",
        noBio: "NO DESCRIPTION PROVIDED"
    },
    ua: {
        placeholder: "Користувач",
        button: "Порівняти",
        dominant: "ДОМІНУЄ",
        repos: "Репозиторії",
        followers: "Підписники",
        power: "Індекс сили",
        error: "КОРИСТУВАЧА НЕ ЗНАЙДЕНО",
        noBio: "ОПИС ВІДСУТНІЙ"
    }
}

// Смена темы
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme')
})

// Смена языка
langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'ua' : 'en'
    updateLanguage()
})

function updateLanguage() {
    document.getElementById('search1').placeholder = translations[currentLang].placeholder + ' 1'
    document.getElementById('search2').placeholder = translations[currentLang].placeholder + ' 2'
    document.getElementById('submit-btn').innerText = translations[currentLang].button
}

async function getUsers(u1, u2) {
    try {
        const [res1, res2] = await Promise.all([axios(APIURL + u1), axios(APIURL + u2)])
        renderBattle(res1.data, res2.data)
    } catch(err) {
        main.innerHTML = `<p style="letter-spacing: 5px">${translations[currentLang].error}</p>`
    }
}

function renderBattle(p1, p2) {
    const score1 = p1.followers + p1.public_repos
    const score2 = p2.followers + p2.public_repos

    main.innerHTML = `
        ${createCardHTML(p1, score1 >= score2)}
        ${createCardHTML(p2, score2 > score1)}
    `
}

function createCardHTML(user, isWinner) {
    const t = translations[currentLang]
    return `
        <div class="card ${isWinner ? 'winner' : ''}" data-winner-label="${t.dominant}">
            <img src="${user.avatar_url}" alt="${user.login}" class="avatar">
            <div class="user-info">
                <h2>${user.login}</h2>
                <p>${user.bio ? user.bio : t.noBio}</p>
                <ul class="stats">
                    <li><strong>${user.public_repos}</strong> ${t.repos}</li>
                    <li><strong>${user.followers}</strong> ${t.followers}</li>
                    <li><strong>${user.public_repos + user.followers}</strong> ${t.power}</li>
                </ul>
            </div>
        </div>
    `
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const u1 = document.getElementById('search1').value
    const u2 = document.getElementById('search2').value
    if(u1 && u2) getUsers(u1, u2)
})

updateLanguage()
