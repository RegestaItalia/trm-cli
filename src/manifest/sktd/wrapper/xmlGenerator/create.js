module.exports = (args) => {
    return `<?xml version="1.0" encoding="UTF-8"?>
    <sktd:docu xmlns:adtcore="http://www.sap.com/adt/core" xmlns:sktd="http://www.sap.com/wbobj/texts/sktd" adtcore:language="${args.langu || 'EN'}" adtcore:name="${args.objName}" adtcore:type="SKTD/TYP" adtcore:masterLanguage="${args.langu || 'EN'}" adtcore:masterSystem="${args.sid}" adtcore:responsible="${args.user}">
      <adtcore:packageRef adtcore:name="${args.devclass.trim().toUpperCase()}"/>
      <sktd:refObject adtcore:name="${args.devclass.trim().toUpperCase()}" adtcore:type="DEVC/K" adtcore:uri="/sap/bc/adt/packages/${args.devclass.trim().toLowerCase()}"/>
    </sktd:docu>`;
}