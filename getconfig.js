var fs = require('fs'),
    path = require('path'),
    env = process.env.NODE_ENV || 'dev',
    colors = require('colors'),
    usingDefault = false,
    useColor = true,
    silent = false,
    color,
    config,
    configPath;

// set our color based on environment
if (env === 'dev') {
    color = 'red';
} else if (env === 'test') {
    color = 'yellow';
} else if (env === 'production') {
    color = 'green';
} else {
    color = 'blue';
}

// color
function c(str, color) {
    return useColor ? str[color] : str;
}

// build a file path to the config
configPath = (require.main ? path.dirname(require.main.filename) : ".") + '/';

// try to read it
try {
    config = fs.readFileSync(configPath + env + '_config.json', 'utf-8');
} catch (e) {
    try {
        config = fs.readFileSync(configPath + 'config.json', 'utf-8');
        usingDefault = true;
    } catch (e) {
        console.error(c("No config file found for %s", 'red'), env);
        console.error(c("We couldn't find %s_config.json or config.json at: %s", 'grey'), env, configPath);
        throw e;
    }
}

try {
    config = JSON.parse(config);
} catch (e) {
    console.error(c("Invalid JSON file", 'red'));
    console.error(c("Check it at:", 'grey') + c(" http://jsonlint.com", 'blue'));
    throw e;
}

if (usingDefault) {
    if (!config.hasOwnProperty(env)) {
        console.error(c("The config.json file does not have key: '%s'", 'red'), env);
        throw new Error('Invalid configuration');
    }
    config = config[env];
}
if (config.getconfig) {
    if (config.getconfig.hasOwnProperty('colors')) useColor = config.getconfig.colors;
    if (config.getconfig.hasOwnProperty('silent')) silent = config.getconfig.silent;        
} else {
    config.getconfig = {};
}
config.getconfig.env = env;


// log out what we've got
if (!silent) console.log(c(c(env, color), 'bold') + c(' environment detected', 'grey'));

// export it
module.exports = config;
