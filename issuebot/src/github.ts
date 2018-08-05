import GitHubApi = require('github');

export class GitHub {

    public api: GitHubApi;

    constructor(token: string) {
        this.api = new GitHubApi();
        this.api.authenticate({
            type: 'oauth',
            token: token
        });
    }

}
