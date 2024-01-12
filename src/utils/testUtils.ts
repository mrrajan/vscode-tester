import { objectRepo } from '../utils/objectRepo'
import { program } from 'commander';
import { Options, VSBrowser } from 'vscode-extension-tester';
import  * as fs from 'fs';

export class TestUtils{
    settings_keys: String[] = ["redHatDependencyAnalytics.redHatDependencyAnalyticsReportFilePath",
    "redHatDependencyAnalytics.exhortSnykToken",
    "redHatDependencyAnalytics.matchManifestVersions",
    "redHatDependencyAnalytics.go.executable.path",
    "redHatDependencyAnalytics.mvn.executable.path",
    "redHatDependencyAnalytics.npm.executable.path",
    "redHatDependencyAnalytics.pip.executable.path",
    "redHatDependencyAnalytics.pip3.executable.path",
    "redHatDependencyAnalytics.python.executable.path",
    "redHatDependencyAnalytics.python3.executable.path"];

    async sleep (milliseconds: number) {
        await VSBrowser.instance.driver.sleep(milliseconds);
    };
    
    async cli_parser(...args:any[]){
        const settings: any = {};
        for( let key in args[0]){
            this.settings_keys.forEach(setting => {
                if ((setting.toLowerCase().search(key.toLowerCase().replace(/_/g,""))>=0) && (args[0][key] !== ``) ){
                    settings[`${setting}`] = args[0][key];
                    return;
                }
            });
        }
        this.config_settings(settings);
    }

    async config_settings(settings: Record<string, any>){
        const extension_settings = process.cwd() + '/src/ui-test/resources/test/.vscode/settings.json';
        console.log(settings);
        const json_settings = JSON.stringify(settings,null,2);
        fs.writeFileSync(extension_settings,json_settings);
        console.log("Settings updated successfully");  
    }
}

program.command('config-run')
        .description("To configure Dependency analytics on Settings.json file")
        .option('-p, --report_file_path <type>', 'To update default report path',process.cwd() + "/report.html")
        .option('-st, --snyk_token <type>', 'To configure Snyk token for the execution','')
        .option('-mv, --match_manifest_versions','To match Manifest version with the installed version', false)
        .option('-m, --mvn <type>','To update Maven executable path','')
        .option('-n, --npm <type>','To update NPM executable path','')
        .option('-g, --go <type>','To update GO executable path','')
        .option('-p, --pip <type>','To update PIP executable path','')
        .option('-p3, --pip3 <type>','To update PIP3 executable path','')
        .option('-py, --python <type>','To update Python executable path','')
        .option('-py3, --python3 <type>','To update Python3 executable path','')
        .action(cmd => {
            const testutil = new TestUtils();
            testutil.cli_parser(cmd);
        });
program.parse();


