import { NextRequest, NextResponse } from 'next/server';
import { GitManager } from '@/lib/git';
import path from 'path';

const gitManager = new GitManager(process.cwd());

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'status':
        const status = await gitManager.status();
        return NextResponse.json(status);

      case 'log':
        const count = parseInt(searchParams.get('count') || '10');
        const log = await gitManager.log(count);
        return NextResponse.json(log);

      case 'branches':
        const branches = await gitManager.branches();
        return NextResponse.json(branches);

      case 'diff':
        const diff = await gitManager.diff();
        return NextResponse.json({ diff });

      case 'diffStaged':
        const diffStaged = await gitManager.diffStaged();
        return NextResponse.json({ diff: diffStaged });

      case 'isRepo':
        const isRepo = await gitManager.isRepo();
        return NextResponse.json({ isRepo });

      case 'remoteUrl':
        const remoteUrl = await gitManager.getRemoteUrl();
        return NextResponse.json({ remoteUrl });

      case 'stashList':
        const stashList = await gitManager.stashList();
        return NextResponse.json(stashList);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Git API error:', error);
    return NextResponse.json(
      { error: 'Failed to process git request' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, files, message, branch, destination, mode } = await request.json();

    switch (action) {
      case 'init':
        await gitManager.init();
        return NextResponse.json({ success: true });

      case 'add':
        await gitManager.add(files);
        return NextResponse.json({ success: true });

      case 'commit':
        await gitManager.commit(message);
        return NextResponse.json({ success: true });

      case 'push':
        await gitManager.push(branch);
        return NextResponse.json({ success: true });

      case 'pull':
        await gitManager.pull(branch);
        return NextResponse.json({ success: true });

      case 'fetch':
        await gitManager.fetch();
        return NextResponse.json({ success: true });

      case 'checkout':
        await gitManager.checkout(branch);
        return NextResponse.json({ success: true });

      case 'createBranch':
        await gitManager.createBranch(branch);
        return NextResponse.json({ success: true });

      case 'deleteBranch':
        await gitManager.deleteBranch(branch);
        return NextResponse.json({ success: true });

      case 'reset':
        await gitManager.reset(mode);
        return NextResponse.json({ success: true });

      case 'stash':
        await gitManager.stash(message);
        return NextResponse.json({ success: true });

      case 'stashPop':
        await gitManager.stashPop();
        return NextResponse.json({ success: true });

      case 'setRemoteUrl':
        await gitManager.setRemoteUrl(destination);
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Git API error:', error);
    return NextResponse.json(
      { error: 'Failed to process git request' },
      { status: 500 }
    );
  }
}
