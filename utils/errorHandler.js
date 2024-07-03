const fs = require('fs');
const path = require('path');
const errorLogPath = path.join(__dirname, 'error_log.json');

module.exports = {
    handleError: function (error, context) {
        console.error('An error occurred:', error);

        // Log error to file
        const logEntry = {
            error: error.message,
            stack: error.stack,
            time: new Date().toISOString()
        };

        const errorLog = fs.existsSync(errorLogPath) ? JSON.parse(fs.readFileSync(errorLogPath, 'utf-8')) : [];
        errorLog.push(logEntry);
        fs.writeFileSync(errorLogPath, JSON.stringify(errorLog, null, 2));

        // Notify user
        if (context) {
            context.reply('There was an error processing your request. The issue has been logged.');
        }
    }
};
