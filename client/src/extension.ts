import * as vscode from 'vscode';
import { CpointTaskProvider } from './tasks';

import * as path from 'path';

import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
    TransportKind,
    Executable
  } from 'vscode-languageclient/node';

let cpointTaskProvider: vscode.Disposable | undefined;

let client: LanguageClient;

export function activate(_context: vscode.ExtensionContext): void {
    //let serverModule = _context.asAbsolutePath(path.join('..', 'cpoint_lsp_server', 'main.py'));
    const home = process.env.HOME;
    const cargo_bin = home + "/.cargo/bin" 
    process.env.PATH += ":" + cargo_bin;
    const traceOutputChannel = vscode.window.createOutputChannel("Cpoint Language Server trace");
    const command = /*"/home/vincent/cpoint_lsp_server/target/debug/cpoint-lsp-server"  ||*/ process.env.SERVER_PATH || "cpoint-lsp-server";
    const run: Executable = {
        command,
        options: {
          env: {
            ...process.env,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            RUST_LOG: "debug",
          },
        },
      };
    let serverOptions: ServerOptions = {
        run,
        debug: run,
      };
    let clientOptions: LanguageClientOptions = {
    // Register the server for plain text documents
        documentSelector: [{ scheme: 'file', language: 'cpoint' }],
        synchronize: {
            // Notify the server about file changes to '.clientrc files contained in the workspace
            fileEvents: vscode.workspace.createFileSystemWatcher("**/.clientrc"),
        },
        traceOutputChannel,
    };
    client = new LanguageClient(
        'CpointLSP',
        'LSP for C. language',
        serverOptions,
        clientOptions
    );
    client.start();
    vscode.window.showWarningMessage("started cpoint extension").then(() => {}, console.error);
    const workspaceRoot = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
		? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;
    if (!workspaceRoot) {
        return;
    }
    cpointTaskProvider = vscode.tasks.registerTaskProvider(CpointTaskProvider.CpointType, new CpointTaskProvider(workspaceRoot))
}

export function deactivate(): Thenable<void> | undefined {
	if (cpointTaskProvider) {
		cpointTaskProvider.dispose();
	}
    if (!client) {
        return undefined;
    }
    return client.stop();
}