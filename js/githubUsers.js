export class githubUser {
    static async search(userName) {
        const endPoint = `https://api.github.com/users/${userName}`

        const data = await fetch(endPoint)

        const { login, name, public_repos, followers } = await data.json()

        return ({
            login, name, public_repos, followers
        })

    }
}