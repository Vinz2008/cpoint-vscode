import * as vscode from 'vscode';

interface CpointTaskDefinition extends vscode.TaskDefinition {
	/**
	 * The task name
	 */
	task: string;
}


export class CpointTaskProvider implements vscode.TaskProvider {
    static CpointType = 'cpoint';
    private sharedState: string | undefined;
    private tasks: vscode.Task[] | undefined;
    constructor(private workspaceRoot: string) {}
    public async provideTasks(): Promise<vscode.Task[]> {
        return this.getTasks();
    }
    public resolveTask(_task: vscode.Task): vscode.Task | undefined {
        const task = _task.definition.task;
        if (task){
            const definition: CpointTaskDefinition = <any>_task.definition;
            return this.getTask(definition.task, definition);
        }
        return undefined;
    }
    private getTasks(): vscode.Task[] {
        if (this.tasks !== undefined) {
			return this.tasks;
		}
        this.tasks = [];
        const tasksNames: string[] = ['build', 'clean'];
        tasksNames.forEach(taskName => {
            this.tasks!.push(this.getTask(taskName));
        });
        return this.tasks;
    }
    private getTask(taskName: string,definition?: CpointTaskDefinition): vscode.Task {
        if (definition === undefined) {
			definition = {
				type: CpointTaskProvider.CpointType,
				task : taskName
			};
		}
        return new vscode.Task(definition, vscode.TaskScope.Workspace, `${taskName}`, 'cpoint', new vscode.ShellExecution(`cpoint-build`));
    }
}




