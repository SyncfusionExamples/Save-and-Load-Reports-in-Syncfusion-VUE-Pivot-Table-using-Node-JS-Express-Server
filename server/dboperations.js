
const sql = require('mssql/msnodesqlv8');
var dbConfig = {
    server: 'localhost',
    database: 'Reports',
    driver: "msnodesqlv8",
    options: {
        trustedConnection: true,
    }
}

async function SaveReportToDB(args) {
    try {
        let pool = await sql.connect(dbConfig);
        let isDuplicate = true;
        const request = pool.request();
        request.input('reportName', sql.VarChar, args.reportName)
        request.input('report', sql.VarChar, args.report)
        var reports = await getReports(pool);
        for (let i = 0; i < reports.length; i++) {
            if (reports[i]["ReportName"] === args.reportName) {
                isDuplicate = false;
                request.query('update ReportTable set Report=@report where ReportName=@reportName');
            }
        }
        if (isDuplicate) {
            request.query('insert into ReportTable (ReportName, Report) values (@reportName, @report)');
        }
    }
    catch (err) {
        console.log(err);
    }
}

async function RemoveReportFromDB(args) {
    try {
        let pool = await sql.connect(dbConfig);
        const request = pool.request();
        request.input('reportName', sql.VarChar, args.reportName);
        request.query('delete from ReportTable where ReportName=@reportName');
    }
    catch (err) {
        console.log(err);
    }
}
async function RenameReportInDB(args) {
    try {
        let pool = await sql.connect(dbConfig);
        const request = pool.request();
        request.input('reportName', sql.VarChar, args.reportName);
        request.input('renameReport', sql.VarChar, args.renameReport);
        if (args.isReportExists) {
            var reports = await getReports(pool);
            for (let i = 0; i < reports.length; i++) {
                if (reports[i]["ReportName"] === args.renameReport) {
                    request.query('delete from ReportTable where ReportName=@renameReport');
                }
            }
        }
        var reports = await getReports(pool);
        for (let j = 0; j < reports.length; j++) {
            if (reports[j]["ReportName"] === args.reportName) {
                isDuplicate = false;
                request.query('update ReportTable set ReportName=@renameReport where ReportName=@reportName');
            }
        }
    }
    catch (err) {
        console.log(err);
    }
}

async function FetchReportListFromDB() {
    try {
        let pool = await sql.connect(dbConfig);
        var reports = await getReports(pool);
        var reportNames = [];
        for (let j = 0; j < reports.length; j++) {
            reportNames.push(reports[j]["ReportName"]);
        }
        return reportNames;
    }
    catch (err) {
        console.log(err);
    }
}

async function LoadReportFromDB(args) {
    try {
        let pool = await sql.connect(dbConfig);
        var report = '';
        const request = pool.request();
        request.input('reportName', sql.VarChar, args.reportName)
        var reports = await getReports(pool);
        for (let i = 0; i < reports.length; i++) {
            if (reports[i]["ReportName"] === args.reportName) {
                report = reports[i]["Report"];
                break;
            }
        }
        return report;
    }
    catch (err) {
        console.log(err);
    }
}

async function getReports(pool) {
    try {
        let reports = await pool.query("select * from ReportTable");
        return reports.recordset;
    }
    catch (err) {
        console.log(err);
    }
}
module.exports = {
    SaveReportToDB: SaveReportToDB,
    RemoveReportFromDB: RemoveReportFromDB,
    RenameReportInDB: RenameReportInDB,
    FetchReportListFromDB: FetchReportListFromDB,
    LoadReportFromDB: LoadReportFromDB
}