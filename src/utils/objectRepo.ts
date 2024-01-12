export class  objectRepo{
    static readonly lnkPomXml = "//a/span[.='pom.xml']";
    static readonly tabPomXmlEditor = "//div[contains(@role,'tablist')]//a[.='pom.xml']";
    static readonly titleDepAnalytics = "//h3[contains(.,'Red Hat Overview of security Issues')]";
    static readonly txtTotalVuln = "//title[.='Dependency Analysis']";
    static readonly txtVulnRowCount = "//tbody//tr[@data-toggle='collapse']/td[<<index>>]";
    static readonly txtBxSettingsSearch = "//div[contains(.,'Search settings') and (@class='search-container')]//div[contains(@class,'monaco-editor')]";
    static readonly txtBxReportPath = "//input[contains(@aria-label,'redHatDependencyAnalytics.redHatDependencyAnalyticsReportFilePath')]";
}