module.exports = (args) => {
    const content = Buffer.from(args.content).toString('base64');
    const timestamp = new Date().toISOString();
    return `<?xml version="1.0" encoding="UTF-8"?>
    <sktd:docu xmlns:adtcore="http://www.sap.com/adt/core" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:sktd="http://www.sap.com/wbobj/texts/sktd" adtcore:changedAt="${timestamp}" adtcore:changedBy="${args.user}" adtcore:createdAt="${args.tdevc.createdOn.toISOString()}" adtcore:createdBy="${args.tdevc.as4user}" adtcore:description="${args.tdevc.ctext}" adtcore:language="${args.langu || 'EN'}" adtcore:name="${args.objName}" adtcore:type="SKTD/TYP" adtcore:version="inactive" adtcore:abapLanguageVersion="0" adtcore:masterLanguage="${args.langu || 'EN'}" adtcore:masterSystem="${args.sid}" adtcore:responsible="${args.user}">
      <atom:link href="versions" rel="http://www.sap.com/adt/relations/versions" title="Historic versions"/>
      <atom:link href="/sap/bc/adt/repository/informationsystem/abaplanguageversions?uri=%2Fsap%2Fbc%2Fadt%2Fdocumentation%2Fktd%2Fdocuments%2F${args.objName.trim().toLowerCase()}" rel="http://www.sap.com/adt/relations/informationsystem/abaplanguageversions" title="Allowed ABAP language versions" type="application/vnd.sap.adt.nameditems.v1+xml"/>
      <atom:link href="./${args.objName.trim().toLowerCase()}/objectstructure" rel="http://www.sap.com/adt/relations/objectstructure" title="Object Structure"/>
      <adtcore:packageRef adtcore:description="${args.tdevc.ctext}" adtcore:name="${args.tdevc.devclass.trim().toUpperCase()}" adtcore:type="DEVC/K" adtcore:uri="/sap/bc/adt/packages/${args.tdevc.devclass.trim().toLowerCase()}"/>
      <sktd:refObject adtcore:description="${args.tdevc.ctext}" adtcore:name="${args.tdevc.devclass.trim().toUpperCase()}" adtcore:type="DEVC/K" adtcore:uri="/sap/bc/adt/packages/${args.tdevc.devclass.trim().toLowerCase()}"/>
      <sktd:element sktd:canHaveDocumentation="true" sktd:collapseNode="false" sktd:longTextObligation="optional" sktd:notAssigned="false" sktd:displayName="">
        <sktd:id>${args.tdevc.devclass.trim().toUpperCase()}</sktd:id>
        <sktd:text>${content}</sktd:text>
        <adtcore:objectReference adtcore:description="${args.tdevc.ctext}" adtcore:name="${args.tdevc.devclass.trim().toUpperCase()}" adtcore:type="DEVC/K" adtcore:uri="/sap/bc/adt/packages/${args.tdevc.devclass.trim().toLowerCase()}"/>
        <sktd:parent></sktd:parent>
        <sktd:shortText sktd:obligation="forbidden" sktd:text=""/>
        <atom:link href="/sap/bc/adt/repository/informationsystem/elementinfo?path=${args.tdevc.devclass.trim().toLowerCase()}&amp;type=devc/k" rel="http://www.sap.com/adt/relations/elementinfo" title="Show Element Information" type="application/vnd.sap.adt.elementinfo+xml"/>
      </sktd:element>
    </sktd:docu>`;
}