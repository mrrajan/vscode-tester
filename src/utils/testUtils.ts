export class  TestUtils{
    static readonly lnkPomXml = "//a/span[.='pom.xml']";
    static readonly tabPomXmlEditor = "//div[contains(@class,'tabs-breadcrumbs')]//a[.='pom.xml']";
    static readonly titleDepAnalytics = "//title[.='Dependency Analysis']";
    static readonly txtTotalVuln = "//div[@class='card-body']//p[contains(.,'Total Vulnerabilities')]";
    static readonly txtVulnRowCount = "//tbody//tr[@data-toggle='collapse']/td[<<index>>]";
}