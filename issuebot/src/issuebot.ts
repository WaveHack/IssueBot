import * as Harmony from 'discord-harmony'
import {GitHub} from './github'
import {IssueCommand, SearchissuesCommand} from './commands'

const config = require('../config.json');

export class IssueBot extends Harmony.Bot {

    gitHub: GitHub;

    constructor() {
        super();

        this.gitHub = new GitHub(config.githubToken)
    }

    loadCommands() {
        super.loadCommands();

        this.commandManager.addCommand('issue', IssueCommand);
        this.commandManager.addCommand('searchissues', SearchissuesCommand);
    }

}

const instance = new IssueBot();
instance.start(config.discordToken);

export default instance as IssueBot;
