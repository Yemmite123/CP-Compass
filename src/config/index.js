const CONFIG = {};

Object.keys(process.env).forEach(key => {
    const matches = /(REACT_APP)_(.*)/.exec(key);

    if(matches) {
        const configKey = matches[2];

        CONFIG[configKey] = process.env[key];
    }
});

export default CONFIG;