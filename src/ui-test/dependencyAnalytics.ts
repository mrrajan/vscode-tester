import { expect } from 'chai';
import * as path from 'path';
import { ActivityBar, before, VSBrowser, ExtensionsViewItem, ExtensionsViewSection, ContextMenu, EditorView, SideBarView, DefaultTreeSection, ViewItem, StatusBar, Workbench, NotificationType } from 'vscode-extension-tester';
import { By } from 'selenium-webdriver';

const pjson = require('../../package.json');


describe('Depedency Analytics', () => {
    let dependencyExt: ExtensionsViewItem;
    let vsbinstance= VSBrowser.instance;
    before(async function() {
     const view = await(await new ActivityBar().getViewControl('Extensions'))?.openView();
     const installed = await view?.getContent().getSection('Installed') as ExtensionsViewSection;
     dependencyExt = await installed.findItem(`@installed ${pjson.displayName}`) as ExtensionsViewItem;
    });

    it('Check the extension info', async () => {
        await vsbinstance.driver.sleep(2000);
        const author = await dependencyExt.getAuthor();
        const desc = await dependencyExt.getDescription();
        const version = await dependencyExt.getVersion();
        const installed = await dependencyExt.isInstalled();
        expect(author).equals(pjson.publisher);
        expect(desc).equals(pjson.description);
        expect(version).equals(pjson.version);
        expect(installed).equals(pjson.installed);
    });

    it('Open quarkus dependency file on Editor', async() => {
        vsbinstance.openResources(path.join('src', 'ui-test', 'resources', 'test'));
        await vsbinstance.driver.sleep(2000);
        const display = await vsbinstance.driver.findElement(By.xpath(`//a/span[.='pom.xml']`)).isDisplayed();
        expect(display).equals(true);
        await vsbinstance.driver.findElement(By.xpath(`//a/span[.='pom.xml']`)).click();
        await vsbinstance.driver.sleep(2000);
        const pom = await vsbinstance.driver.findElement(By.xpath(`//div[contains(@class,"tabs-breadcrumbs")]//a[.="pom.xml"]`)).isDisplayed();
        expect(pom).equals(true);
    });

    it('Generate Dependency Analytics Report From Editor View', async() => {
        await vsbinstance.driver.sleep(2000);
        const ev = await new EditorView();
        const editor = await ev.openEditor(`pom.xml`);
        await (await editor.openContextMenu()).select(`Dependency Analytics Report...`);

        let i=0;
        while(i<=5){
            try{
                const dareport = await (await ev.openEditor(`Dependency Analytics Report`)).isDisplayed();
                break;
            }
            catch( error ){
                await vsbinstance.driver.sleep(2000);
                i++;
            }
            if(i===5){
                expect.fail(`Dependency Analytics report not generated`);
            }            
        }
        await ev.closeAllEditors();       
    });

    it('Generate Dependency Analytics Report On Sidebar view',async() => {
        await vsbinstance.driver.sleep(2000);
        const item = await (await new SideBarView().getContent().getSection('test')).findItem('pom.xml') as ViewItem;
        const menu = await item.openContextMenu();
        await menu.select('Dependency Analytics Report...');
        const ev = await new EditorView();

        let i=0;
        while(i<=5){
            try{
                const dareport = await (await ev.openEditor(`Dependency Analytics Report`)).isDisplayed();
                break;
            }
            catch( error ){
                await vsbinstance.driver.sleep(2000);
                i++;
            }
            if(i===5){
                expect.fail(`Dependency Analytics report not generated`);
            }            
        }
        await ev.closeAllEditors();
    });
});