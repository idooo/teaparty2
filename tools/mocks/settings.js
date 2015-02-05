module.exports = {

    mocks: [
        {
            url: '/api/settings',
            data: {
                "auth": false,
                "widgetTypes": ["highcharts", "list", "number", "rag", "status", "text"],
                "isDatabaseConnected": true,
                "status": "ok"
            }
        }
    ]
};