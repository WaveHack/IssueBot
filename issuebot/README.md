# IssueBot

A Discord bot for creating and searching GitHub issues.

## Install Instructions

**Note:** Due to [NPM package linking](https://docs.npmjs.com/cli/link) requiring root access on system-wide NPM installations, it's recommended to use [NVM](https://github.com/creationix/nvm). 

Clone the repository:

```bash
$ git clone --recursive https://github.com/LeagueSandbox/IssueBot.git
$ cd IssueBot/issuebot
```

Install dependencies:

```bash
$ npm install
```

Now create a Discord application and an associated bot. Write down the Bot token, since you will need it in a bit.

Next, create a personal access token on GitHub with the `public_repo` permission. Also write down this token.

Add the Discord bot to your Discord server you want to use this functionality on.

**Note:** How to do the above three steps is out of the scope of this project README. A quick Google to the right documentation should help you with this.

Go to your project and create the configuration file.

```bash
$ cp config.json.template config.json
```

Edit `config.json` and insert your Discord token, GitHub token and your GitHub user/organization. These three fields are mandatory.

Set default repository to either an empty string or a repository (in `user/repository` format). A default repository is useful if you have only one repo to manage issues for through Discord. Otherwise you need to leave the default repository config field blank, and add the repository name to every command invocation.

Roles is an array of Discord role string ids (tip: use `\@rolename` in Discord to get the id), where only users of those roles are allowed to invoke the bot. Everyone can use the bot if this array remains empty. The server owner can always invoke the bot regardless.

**Note:** The user/organization name needs to be from the same account of which you generated the personal access token for.  

Run the bot:

```bash
$ npm start
```

You should see the following output:

```
user@system:~/IssueBot/issuebot$ npm start

> issuebot@0.1.0 start /home/user/IssueBot/issuebot
> tsc -p . && node built/issuebot.js

Loading commands...
Mapped Function to !issue
Mapped Function to !searchissues
Bot ready
```

Your bot should now be online in your Discord.

## Usage

### Creating an issue

To create a new issue, type the following in Discord where the bot can read it:

```
!issue repo title [body]
```

Repo is optional if you have set your `defaultRepository` in your config file. Else replace it with the repository you have access to.

### Searching for issues

You can search for existing issues with:

```
!searchissues repo query
```

Same with creating an issue, repo is optional if you have set a default.
