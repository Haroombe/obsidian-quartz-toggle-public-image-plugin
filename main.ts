import { App, Editor, MarkdownView, TAbstractFile, TFile, Modal, Menu, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	prefix: string;
}
const DEFAULT_SETTINGS: MyPluginSettings = {
	prefix: "public"
};

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new ToggleAttachmentPublicSettingsTab(this.app, this));
		// on attachment open (!**.md) -> add status bar text below to show private or public image


		this.registerEvent(this.app.workspace.on("file-menu", (menu, file, source) => {
			const prefixWithDash = this.settings.prefix + "-";
			// ONLY FOR ATTACHMENTS
			if (!(file instanceof TFile)) return;
			if (file.name.toLowerCase().endsWith(".md")) { return }

			const isPublicFile: boolean = this.isPublicFile(file);
			if (isPublicFile) {
				menu.addItem((item) => {
					item.setTitle('Toggle private')
						.onClick(async () => {
							try {

								await this.app.fileManager.renameFile(
									file,
									`${file.parent?.path ?? ''}/${file.name.replace(new RegExp('^' + prefixWithDash), '')}`
								);
							} catch (e) {
								new Notice(`Failed to rename ${file.name}: ${(e as Error).message}`);
							} 
							new Notice(`${file.path} changed to ${isPublicFile ? 'Public' : 'Private'}`);

						})
						


				})
			}
			else {

				menu.addItem((item) => {
					item.setTitle('Toggle Public')
						.onClick(async () => {
							try {
								await this.app.fileManager.renameFile(
									file,
									`${file.parent?.path ?? ''}/${prefixWithDash}${file.name}`
								);
							} catch (e) {
								new Notice(`Failed to rename ${file.name}: ${(e as Error).message}`);
							}
							new Notice(`${file.path} changed to ${isPublicFile ? 'Public' : 'Private'}`);

						});
				})

			}

		}))


		this.registerEvent(this.app.workspace.on("files-menu", (menu, fileOrFiles, source) => {
			const prefixWithDash = this.settings.prefix + "-";

			let files: TAbstractFile[] = [];

			if (Array.isArray(fileOrFiles)) {
				files = fileOrFiles;
			} else if (fileOrFiles) {
				files = [fileOrFiles];
			} else {
				return;
			}

			// Filter attachments only (non-md files)
			const attachmentFiles = files.filter(f => f instanceof TFile && !f.name.toLowerCase().endsWith(".md"));

			if (attachmentFiles.length === 0) return;

			// Separate public and private files
			const publicFiles = attachmentFiles.filter(f => this.isPublicFile(f));
			const privateFiles = attachmentFiles.filter(f => !this.isPublicFile(f));

			// If no public and no private, no menu
			if (publicFiles.length === 0 && privateFiles.length === 0) return;

			// Add "Make Private" if one or more public files
			if (publicFiles.length > 0) {
				menu.addItem(item => {
					item.setTitle(`Make Private (${publicFiles.length} file${publicFiles.length > 1 ? 's' : ''})`)
						.onClick(async () => {
							for (const file of publicFiles) {
								try {
									await this.app.fileManager.renameFile(
										file,
										`${file.parent?.path ?? ''}/${file.name.replace(new RegExp('^' + prefixWithDash), '')}`
									);
								} catch (e) {
									new Notice(`Failed to rename ${file.name}: ${(e as Error).message}`);
								}
							}
							new Notice(`Made ${publicFiles.length} file${publicFiles.length > 1 ? 's' : ''} private`);
						});
				});
			}

			// Add "Make Public" if one or more private files
			if (privateFiles.length > 0) {
				menu.addItem(item => {
					item.setTitle(`Make Public (${privateFiles.length} file${privateFiles.length > 1 ? 's' : ''})`)
						.onClick(async () => {
							for (const file of privateFiles) {
								try {
									await this.app.fileManager.renameFile(
										file,
										`${file.parent?.path ?? ''}/${prefixWithDash}${file.name}`
									);
								} catch (e) {
									new Notice(`Failed to rename ${file.name}: ${(e as Error).message}`);
								}
							}
							new Notice(`Made ${privateFiles.length} file${privateFiles.length > 1 ? 's' : ''} public`);
						});
				});
			}
		}));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
	isPublicFile(file: TAbstractFile): boolean {
		const prefix = this.settings.prefix + "-";
		return file.name.startsWith(prefix);
	}

}


class ToggleAttachmentPublicSettingsTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Public prefix")
			.setDesc("The prefix used to mark a file as public")
			.addText(text => text
				.setPlaceholder("public")
				.setValue(this.plugin.settings.prefix)
				.onChange(async (value) => {
					this.plugin.settings.prefix = value;
					if (this.plugin.settings.prefix.trim().length === 0) { // empty string
						this.plugin.settings.prefix = DEFAULT_SETTINGS.prefix;

					}
					console.log(this.plugin.settings.prefix)
					await this.plugin.saveSettings();
				}));
	}
}
