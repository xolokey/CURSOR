import { simpleGit, SimpleGit, SimpleGitOptions } from 'simple-git';
import { promises as fs } from 'fs';
import path from 'path';

export interface GitStatus {
  current: string;
  tracking: string | null;
  ahead: number;
  behind: number;
  files: Array<{
    path: string;
    index: string;
    working_dir: string;
  }>;
  staged: string[];
  not_added: string[];
  conflicted: string[];
  created: string[];
  deleted: string[];
  modified: string[];
  renamed: Array<{ from: string; to: string }>;
}

export interface GitCommit {
  hash: string;
  date: string;
  message: string;
  author_name: string;
  author_email: string;
  refs: string;
}

export class GitManager {
  private git: SimpleGit;
  private repoPath: string;

  constructor(repoPath: string) {
    this.repoPath = repoPath;
    const options: Partial<SimpleGitOptions> = {
      baseDir: repoPath,
      binary: 'git',
      maxConcurrentProcesses: 6,
      trimmed: false,
    };
    this.git = simpleGit(options);
  }

  async init(): Promise<void> {
    try {
      await this.git.init();
    } catch (error) {
      console.error('Failed to initialize git repository:', error);
      throw error;
    }
  }

  async status(): Promise<GitStatus> {
    try {
      const status = await this.git.status();
      return {
        current: status.current || '',
        tracking: status.tracking || null,
        ahead: status.ahead,
        behind: status.behind,
        files: status.files,
        staged: status.staged,
        not_added: status.not_added,
        conflicted: status.conflicted,
        created: status.created,
        deleted: status.deleted,
        modified: status.modified,
        renamed: status.renamed,
      };
    } catch (error) {
      console.error('Failed to get git status:', error);
      throw error;
    }
  }

  async add(files: string[]): Promise<void> {
    try {
      await this.git.add(files);
    } catch (error) {
      console.error('Failed to add files to git:', error);
      throw error;
    }
  }

  async commit(message: string): Promise<void> {
    try {
      await this.git.commit(message);
    } catch (error) {
      console.error('Failed to commit changes:', error);
      throw error;
    }
  }

  async push(branch?: string): Promise<void> {
    try {
      await this.git.push('origin', branch || 'main');
    } catch (error) {
      console.error('Failed to push changes:', error);
      throw error;
    }
  }

  async pull(branch?: string): Promise<void> {
    try {
      await this.git.pull('origin', branch || 'main');
    } catch (error) {
      console.error('Failed to pull changes:', error);
      throw error;
    }
  }

  async fetch(): Promise<void> {
    try {
      await this.git.fetch();
    } catch (error) {
      console.error('Failed to fetch changes:', error);
      throw error;
    }
  }

  async log(count: number = 10): Promise<GitCommit[]> {
    try {
      const log = await this.git.log({ maxCount: count });
      return log.all.map(commit => ({
        hash: commit.hash,
        date: commit.date,
        message: commit.message,
        author_name: commit.author_name,
        author_email: commit.author_email,
        refs: commit.refs,
      }));
    } catch (error) {
      console.error('Failed to get git log:', error);
      throw error;
    }
  }

  async branches(): Promise<string[]> {
    try {
      const branches = await this.git.branch();
      return branches.all;
    } catch (error) {
      console.error('Failed to get branches:', error);
      throw error;
    }
  }

  async checkout(branch: string): Promise<void> {
    try {
      await this.git.checkout(branch);
    } catch (error) {
      console.error('Failed to checkout branch:', error);
      throw error;
    }
  }

  async createBranch(branch: string): Promise<void> {
    try {
      await this.git.checkoutLocalBranch(branch);
    } catch (error) {
      console.error('Failed to create branch:', error);
      throw error;
    }
  }

  async deleteBranch(branch: string): Promise<void> {
    try {
      await this.git.deleteLocalBranch(branch);
    } catch (error) {
      console.error('Failed to delete branch:', error);
      throw error;
    }
  }

  async diff(): Promise<string> {
    try {
      return await this.git.diff();
    } catch (error) {
      console.error('Failed to get diff:', error);
      throw error;
    }
  }

  async diffStaged(): Promise<string> {
    try {
      return await this.git.diff(['--cached']);
    } catch (error) {
      console.error('Failed to get staged diff:', error);
      throw error;
    }
  }

  async reset(mode: 'soft' | 'mixed' | 'hard' = 'mixed', commit?: string): Promise<void> {
    try {
      await this.git.reset([`--${mode}`, commit || 'HEAD']);
    } catch (error) {
      console.error('Failed to reset:', error);
      throw error;
    }
  }

  async stash(message?: string): Promise<void> {
    try {
      await this.git.stash(['push', ...(message ? ['-m', message] : [])]);
    } catch (error) {
      console.error('Failed to stash changes:', error);
      throw error;
    }
  }

  async stashPop(): Promise<void> {
    try {
      await this.git.stash(['pop']);
    } catch (error) {
      console.error('Failed to pop stash:', error);
      throw error;
    }
  }

  async stashList(): Promise<Array<{ stash: string; date: string; message: string }>> {
    try {
      const stashes = await this.git.stashList();
      return stashes.all.map(stash => ({
        stash: stash.hash,
        date: stash.date,
        message: stash.message,
      }));
    } catch (error) {
      console.error('Failed to get stash list:', error);
      throw error;
    }
  }

  async isRepo(): Promise<boolean> {
    try {
      await this.git.checkIsRepo();
      return true;
    } catch {
      return false;
    }
  }

  async getRemoteUrl(): Promise<string | null> {
    try {
      const remotes = await this.git.getRemotes(true);
      return remotes.find(r => r.name === 'origin')?.refs?.fetch || null;
    } catch (error) {
      console.error('Failed to get remote URL:', error);
      return null;
    }
  }

  async setRemoteUrl(url: string): Promise<void> {
    try {
      await this.git.remote(['set-url', 'origin', url]);
    } catch (error) {
      console.error('Failed to set remote URL:', error);
      throw error;
    }
  }
}
