import { githubUser } from './githubUsers.js'

export class Favorite { // trabalhar com dados
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
    }

    async addUser(userName) {
        try {
            this.entriesUsers.forEach(user => {

                if (user.login.toUpperCase() == userName.toUpperCase()) {
                    throw new Error('Usuário já favoritado')
                }

            })

            const user = await githubUser.search(userName)

            if (user.login === undefined) {
                throw new Error('Usuário inexistente')
            }

            this.entriesUsers = [user, ...this.entriesUsers]
            this.update()
            this.save()

        } catch (Error) {
            alert(Error)
        }
    }

    load() {
        this.entriesUsers = JSON.parse(localStorage.getItem('@github-users:')) || []
    }

    save() {
        localStorage.setItem('@github-users:', JSON.stringify(this.entriesUsers))
    }

    delete(entryUserRemove) {
        if (confirm('Deseja excluir este favorito?')) {
            const userRemoved = this.entriesUsers.filter(user => entryUserRemove.login != user.login)

            this.entriesUsers = userRemoved

            this.update()
            this.save()
        }

        return

    }

}

export class FavoriteView extends Favorite {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector('tbody')
        this.update()
        this.searchAddUser()
    }


    update() {
        this.removeAllTr()
        
        this.entriesUsers.forEach(user => this.addRow(user))

        if(this.entriesUsers.length == 0){
            this.createTrEmpty()
        }
    }

    addRow(user) {
        const row = this.createRow()
        const { login, name, public_repos, followers } = user

        row.querySelector('.user img').src = `https://github.com/${login}.png`
        row.querySelector('.user .name').textContent = `${name}`
        row.querySelector('.user .user-name').textContent = `/${login}`
        row.querySelector('.user .user-name').href = `https://github.com/${login}`
        row.querySelector('.public-repos').textContent = `${public_repos}`
        row.querySelector('.followers').textContent = `${followers}`
        row.querySelector('.remove-user').onclick = () => this.delete(user)

        this.tbody.append(row)

    }

    searchAddUser() {
        const buttonInput = document.querySelector('.search button')

        buttonInput.onclick = () => {
            const { value } = document.querySelector('.search input')
            this.addUser(value)
        }

    }

    createRow() {
        const tr = document.createElement('tr')

        tr.innerHTML = `
        <td class="user">
            <img src="" alt="Foto perfil Github">
            <div>
                <p class="name"></p>
                <a class="user-name" href=""></a>
            </div>
        </td>
        <td class="public-repos"></td>
        <td class="followers"></td>
        <td class="remove-user"><button>Remover</button></td>
        `

        return tr
    }

    removeAllTr() {
        const tr = this.tbody.querySelectorAll('tr')
        tr.forEach((element => {
            element.remove()
        }))
    }

    createTrEmpty() {

        const tr = document.createElement('tr')
        tr.classList.add('empty')

        tr.innerHTML = `
            <img src="assets/Estrela.svg" alt="">
            <h1>Nenhum favorito ainda</h1>
        `

        this.tbody.append(tr)
    
    }

}