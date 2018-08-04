import Bot from '../issuebot'
import {Command} from 'discord-harmony'

const config = require('../../config.json');

export class IssueCommand extends Command {

    execute(): void {
        if (!this.args) {
            return
        }

        const repository: string = (
            config.defaultRepository
                ? config.defaultRepository.split('/')[1]
                : this.args.shift()
        );

        const title: string = this.args.shift();
        const body: string = this.args.shift();

        if (!repository || !title) {
            return;
        }

        let issueBody = ISSUE_TEMPLATE
            .replace("{ISSUE_BODY}", (body || '_No content_'))
            .replace("{CHANNEL}", this.message.channel.name)
            .replace("{USER}", this.message.author.username);

        Bot.gitHub.api.issues.create({
            owner: config.name,
            repo: repository,
            title: title,
            body: <any>issueBody // Typings for the `github` package are incorrect, so we have to cast to any here.
        }, (error, response) => this.handleGithubResponse(error, response));
    }

    handleGithubResponse(error, response) {
        if (error) {
            const reply = ERROR_TEMPLATE
                .replace('{CODE}', error.code.toString())
                .replace('{STATUS}', error.status)
                .replace('{MESSAGE}', JSON.stringify(JSON.parse(error.message), null, 2));

            this.message.reply(reply);

            return;
        }

        const reply = SUCCESS_TEMPLATE
            .replace('{URL}', response.html_url);

        this.message.reply(reply)
    }

}

const ISSUE_TEMPLATE = `
{ISSUE_BODY}

---
Beep, boop, I'm [a bot](https://github.com/LeagueSandbox/IssueBot)! This issue was created by \`@{USER}\` in \`#{CHANNEL}\`.
`;

const ERROR_TEMPLATE = `
An error has occurred while creating the issue: **{CODE}: {STATUS}**.

Message:
\`\`\`json
{MESSAGE}
\`\`\`
`;

const SUCCESS_TEMPLATE = `
Issue created successfully! {URL}
`;
