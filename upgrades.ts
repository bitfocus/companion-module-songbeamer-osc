module.exports = function () {
    return [
        function (context, config, actions, feedbacks) {
            if (config) {
                // just an example, but cant be removed now it exists
                if (config.host !== undefined) {
                    config.old_host = config.host;
                }
            }
        }
    ]
}