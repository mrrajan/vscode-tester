import { expect } from 'chai';
import * as path from 'path';
import { ActivityBar, before, VSBrowser, ExtensionsViewItem, ExtensionsViewSection, EditorView, SideBarView, ViewItem, WebView} from 'vscode-extension-tester';
import { By } from 'selenium-webdriver';
import { objectRepo } from '../utils/objectRepo';
import { Workbench } from 'vscode-extension-tester'
import { TestUtils } from '../utils/testUtils';
import * as fs from 'fs';

const pjson = require('../../package.json');

describe('Red Hat Depedency Analytics Report VSCode Extension Validation', () => {
    let dependencyExt: ExtensionsViewItem;
    let vsbinstance= VSBrowser.instance;
    const testUtils = new TestUtils();
   
    const open_manifest_file_maven = async() => {
        await vsbinstance.openResources(path.join(`src`, `ui-test`, `resources`, `test`));
        const display = await vsbinstance.driver.findElement(By.xpath(objectRepo.lnkPomXml)).isDisplayed();
        expect(display).equals(true);
        await vsbinstance.driver.findElement(By.xpath(objectRepo.lnkPomXml)).click();
        const pom = await vsbinstance.driver.findElement(By.xpath(objectRepo.tabPomXmlEditor)).isDisplayed();
        expect(pom).equals(true);
    };

    const get_report_path = () =>{
        const file = fs.readFileSync(process.cwd() + `/.vscode/settings.json`, `utf-8`);
        const content: Record<string, any> = JSON.parse(file);
        console.log(content[`redHatDependencyAnalytics.redHatDependencyAnalyticsReportFilePath`]);
        return content[`redHatDependencyAnalytics.redHatDependencyAnalyticsReportFilePath`];
    }

    const generate_report_editor_view = async() =>{
        await open_manifest_file_maven();
        const ev = await new EditorView();
        const editor = await ev.openEditor(`pom.xml`);
        await (await editor.openContextMenu()).select(`Red Hat Dependency Analytics Report...`);
        let i=0;
        while(i<5){
            await (await ev.openEditor(`Red Hat Dependency Analytics Report`)).isDisplayed();
            const path = get_report_path();
            if (!fs.existsSync(path)){
                await testUtils.sleep(10000);
            }else{
                i++;
                break;
            }            
        }
        if(i===5){
            expect.fail(`Dependency Analytics report not generated`);
        }
        return ev;
    }

    before(async function() {
        const report = get_report_path();
        const view = await(await new ActivityBar().getViewControl(`Extensions`))?.openView();
        const installed = await view?.getContent().getSection(`Installed`) as ExtensionsViewSection;
        await installed.findItem(`@installed ${pjson.displayName}`) as ExtensionsViewItem;
        
    });

    it('Open Report',async()=>{
        const editor:EditorView = await generate_report_editor_view();
        const driv = editor.getDriver();
        const wv = new WebView();
        wv.switchToFrame();
        const path = get_report_path();
        driv.get(path);
        console.log("Get the title of the page");
        driv.switchTo().defaultContent();
        const iframe = driv.findElement(By.xpath("//iframe[@class='webview ready']"));
        await iframe.isDisplayed();
        console.log("first");
        vsbinstance.driver.switchTo().frame(iframe);
        console.log("switched to first");
        vsbinstance.driver.switchTo()
        const iframe1 = driv.findElement(By.xpath("//iframe[(@id='active-frame') and @title]"));
        console.log("second");
        await iframe1.isDisplayed();
        vsbinstance.driver.switchTo().frame(iframe1);
        console.log("switched to second");
        console.log(await iframe1.findElement(By.xpath("//title")).getText());
        console.log(await driv.getTitle());
        await testUtils.sleep(10000);
    });

    it('Generate Dependency Analytics Report From Editor View', async() => {
        await generate_report_editor_view();
        await (new EditorView).closeAllEditors();   
    });

    it('Generate Dependency Analytics Report On Sidebar view',async() => {
        await open_manifest_file_maven();
        const item = await (await new SideBarView().getContent().getSection(`test`)).findItem(`pom.xml`) as ViewItem;
        const menu = await item.openContextMenu();
        await menu.select(`Red Hat Dependency Analytics Report...`);
        const ev = await new EditorView();
        let i=0;
        while(i<5){
            await (await ev.openEditor(`Red Hat Dependency Analytics Report`)).isDisplayed();
            const path = get_report_path();
            if (!fs.existsSync(path)){
                await testUtils.sleep(10000);
            }else{
                i++;
                break;
            }                   
        }
        if(i===5){
            expect.fail(`Dependency Analytics report not generated`);
        } 
    });

    
});