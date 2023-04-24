import * as vscode from 'vscode';
import { CpointTaskProvider } from './tasks';

let cpointTaskProvider: vscode.Disposable | undefined;

export function activate(_context: vscode.ExtensionContext): void {
    const workspaceRoot = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
		? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;
    if (!workspaceRoot) {
        return;
    }
    cpointTaskProvider = vscode.tasks.registerTaskProvider(CpointTaskProvider.CpointType, new CpointTaskProvider(workspaceRoot))
}

export function deactivate(): void {
	if (cpointTaskProvider) {
		cpointTaskProvider.dispose();
	}
}