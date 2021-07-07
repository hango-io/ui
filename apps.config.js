'use strict';
/* eslint-disable camelcase */
module.exports = {
    apps: [{
        name: 'hango-ui',
        max_memory_restart: '300M',
        script: 'npm',
        // exec_mode: 'cluster',
        args: [
            'start',
        ],
        error_file: './logs/app/stderr.log',
        out_file: './logs/app/stdout.log',
        pid_file: './pids/app.pid',
        merge_logs: true,
        log_date_format: 'YYYY-MM-DD HH:mm:ss:SSS Z',
        time: true,
    }],
};
