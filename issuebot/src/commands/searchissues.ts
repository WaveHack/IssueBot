import Bot from '../issuebot'
import {Command} from 'discord-harmony'

const config = require('../../config.json');

export class SearchissuesCommand extends Command {

    protected maxResults: number = 10;

    execute(): void {
        if (config.allowedRoles.length > 0) {
            // Server owner can always use this command
            if (this.message.author.id !== this.message.member.guild.ownerID) {
                let hasRole: boolean = false;

                this.message.member.roles.forEach(role => {
                    if (config.allowedRoles.includes(role.id)) {
                        hasRole = true;
                        return false; //break
                    }
                });

                if (!hasRole) {
                    return;
                }
            }
        }

        if (!this.args.length) {
            const reply: string = USAGE_TEMPLATE
                .replace('{REPOSITORY}', (config.defaultRepository ? '' : ' repository'));

            this.message.reply(reply);

            return
        }

        const repository: string = (
            config.defaultRepository
                ? config.defaultRepository
                : this.args.shift()
        );

        const query: string = this.args.join(' ');

        if (!repository || !query) {
            return;
        }

        Bot.gitHub.api.search.issues({
            q: `${query} repo:${repository}`,
        }, (error, response) => this.handleResponse(error, response, query));
    }

    handleResponse(error, response, query) {
        if (error) {
            const reply = ERROR_TEMPLATE
                .replace('{CODE}', error.code.toString())
                .replace('{STATUS}', error.status)
                .replace('{MESSAGE}', JSON.stringify(JSON.parse(error.message), null, 2));

            this.message.reply(reply);

            return;
        }

        let reply: string;
        const numResults: number = response.total_count;

        if (numResults > 0) {
            let resultData: string = '';

            for (let i: number = 0; i < Math.min(numResults, this.maxResults); i++) {
                const item = response.items[i];

                resultData += `- [${item.state.toUpperCase()}] ${item.title}: <${item.html_url}> (${item.score.toFixed(2)})\n`;
            }

            reply = SUCCESS_TEMPLATE
                .replace('{SHOWING_N_RESULTS}', ((numResults > this.maxResults) ? ` Showing the first ${this.maxResults} results.` : ''))
                .replace('{NUM_RESULTS}', numResults.toString())
                .replace('{ISSUE_OR_ISSUES}', ((numResults === 1) ? 'issue' : 'issues'))
                .replace('{QUERY}', query)
                .replace('{RESULT_DATA}', resultData);

        } else {
            reply = NO_RESULTS_TEMPLATE
                .replace('{QUERY}', query);
        }

        this.message.reply(reply);
    }

}

const USAGE_TEMPLATE: string = `
Searches for issues on GitHub.

Usage: !issue{REPOSITORY} query

**Note:** For additional query filter parameters, see: <https://help.github.com/articles/searching-issues-and-pull-requests/>
`;

const ERROR_TEMPLATE: string = `
An error has occurred: **{CODE}: {STATUS}**.

Message:
\`\`\`json
{MESSAGE}
\`\`\`
`;

const NO_RESULTS_TEMPLATE: string = `
No results for \`{QUERY}\`.
`;

const SUCCESS_TEMPLATE: string = `
{NUM_RESULTS} {ISSUE_OR_ISSUES} found matching the term \`{QUERY}\`.{SHOWING_N_RESULTS}

{RESULT_DATA}
`;
