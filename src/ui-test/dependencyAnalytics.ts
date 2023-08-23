import { expect } from 'chai';
import * as path from 'path';
import { ActivityBar, before, VSBrowser, ExtensionsViewItem, ExtensionsViewSection, EditorView, SideBarView, ViewItem, WebView} from 'vscode-extension-tester';
import { By } from 'selenium-webdriver';
import { TestUtils } from '../utils/testUtils';

const pjson = require('../../package.json');


describe('Depedency Analytics', () => {
    let dependencyExt: ExtensionsViewItem;
    let vsbinstance= VSBrowser.instance;
    before(async function() {
     const view = await(await new ActivityBar().getViewControl('Extensions'))?.openView();
     const installed = await view?.getContent().getSection('Installed') as ExtensionsViewSection;
     dependencyExt = await installed.findItem(`@installed ${pjson.displayName}`) as ExtensionsViewItem;
    });

    it('Open quarkus dependency file on Editor', async() => {
        vsbinstance.openResources(path.join('src', 'ui-test', 'resources', 'test'));
        await vsbinstance.driver.sleep(2000);
        const display = await vsbinstance.driver.findElement(By.xpath(TestUtils.lnkPomXml)).isDisplayed();
        expect(display).equals(true);
        await vsbinstance.driver.findElement(By.xpath(TestUtils.lnkPomXml)).click();
        await vsbinstance.driver.sleep(2000);
        const pom = await vsbinstance.driver.findElement(By.xpath(TestUtils.tabPomXmlEditor)).isDisplayed();
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
    });

    it('Check Vulnerable Dependencies Count', async() => {
        const dareport = await new EditorView().openEditor(`Dependency Analytics Report`);
        const wv = new WebView();
        let i=0;
        while(i<=5){
            try{
                await wv.switchToFrame();
                const element = await wv.findWebElement(By.xpath(TestUtils.titleDepAnalytics));
                break;
            }
            catch( error ){
                await vsbinstance.driver.sleep(5000);
                i++;
            }
            if(i===5){
                expect.fail(`Dependency Analytics report not generated`);
            }
        }
        const count_elem = await wv.findWebElement(By.xpath(TestUtils.txtTotalVuln));
        const textContent = await count_elem.getText();
        const splitText = textContent.split(": ");
        const tot_count_header: number = +splitText[1];
        let tot_row_count:number = 0;
        for (let i=4;i<=5;i++){
            const direct_elem = await wv.findWebElements(By.xpath(TestUtils.txtVulnRowCount.replace("<<index>>",i.toString())));
            await Promise.all(direct_elem.map(async value => {
                const temp: number = +await value.getText();
                tot_row_count += temp;
            }));   
        }      
          
        if (tot_count_header != tot_row_count){
            expect.fail("Total Vulnerabilities count mismatches between header and sum of individual rows");
        }
    });
});