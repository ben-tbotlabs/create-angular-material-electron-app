import chalk from 'chalk';
import * as child from 'child_process';

async function main() {
	try {
		execSync('nx --help', { stdio: 'ignore' });
	}
	catch (err) {
		if ((err as { status: number })?.status === 127) {
			console.log('');
			console.log(chalk.red('You must have the Nx CLI installed to use create-material-angular-workspace'));
			console.log('');
			console.log(`Run ${chalk.blue('npm install -g nx@latest')} to install the Nx CLI`);
			console.log('');
			process.exit(1);
		}
	}

	await setupNPX();

}

void (async () => {
	await main();
})();

let npxForceInstall = '--ignore-existing'

async function setupNPX() {
	const result = await execSyncCapture('npx --ignore-existing __');
	if (result.stdErr.includes('--ignore-existing argument has been removed')) {
		npxForceInstall = '--yes'
	}
}

function execSync(command: string, options?: child.ExecSyncOptions): Buffer {
	if (options?.stdio !== 'ignore') {
		console.log(chalk.gray(command));
	}
	return child.execSync(command, { stdio: options?.stdio ?? 'inherit', cwd: options?.cwd });
}

function execSyncCapture(command: string, options?: child.ExecSyncOptions): Promise<{ code: number | null, err: child.ExecException | null, stdOut: string, stdErr: string }> {
	if (options?.stdio !== 'ignore') {
		console.log(chalk.gray(command));
	}

	return new Promise((resolve) => {
		let stdOut = '';
		let stdErr = '';
		let e: child.ExecException | null = null;
		child.exec(command, (err, stdout, stderr) => {
			stdOut += stdout;
			stdErr += stderr;
			e = err;
		}).on('close', (code) => {
			resolve({ code, err: e, stdOut, stdErr })
		})
	});
}
