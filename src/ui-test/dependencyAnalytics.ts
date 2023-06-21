import { expect } from 'chai';
import * as path from 'path';
import { ActivityBar, VSBrowser, By, ExtensionsViewItem, ExtensionsViewSection } from 'vscode-extension-tester';
const pjson = require('../../package.json');


describe('Depedency Analytics', () => {
    let dependencyExt: ExtensionsViewItem;
    
    before(async function() {
     this.timeout(150000);
     const view = await(await new ActivityBar().getViewControl('Extensions'))?.openView();
     const installed = await view?.getContent().getSection('Installed') as ExtensionsViewSection;
     dependencyExt = await installed.findItem(`@installed ${pjson.displayName}`) as ExtensionsViewItem;
    });

    it('Check the extension info', async () => {
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
        await VSBrowser.instance.openResources(path.join('src', 'ui-test', 'resources', 'test'));
        // make sure the view is open
        //const explorer = await (await new ActivityBar().getViewControl('Explorer'))?.openView();
        
    });



});