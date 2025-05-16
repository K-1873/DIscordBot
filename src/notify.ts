import axios from 'axios';
import fs from 'fs';

interface GitHubEvent {
  action: string;
  issue: { number: number; title: string; html_url: string };
  assignee: { login: string };
}

const discordWebhook = process.env.DISCORD_WEBHOOK!;
const eventPath = process.env.GITHUB_EVENT_PATH!;
const githubEvent: GitHubEvent = JSON.parse(fs.readFileSync(eventPath, 'utf-8'));

async function notifyDiscord() {
  if (githubEvent.action === 'assigned') {
    const message = `New assignee @${githubEvent.assignee.login} added to issue #${githubEvent.issue.number}: ${githubEvent.issue.title}\n${githubEvent.issue.html_url}`;
    await axios.post(discordWebhook, { content: message });
    console.log('Notification sent');
  } else {
    console.log(`Action was ${githubEvent.action}, skipping.`);
  }
}

notifyDiscord().catch(console.error);