const mylib = {
    functions: ['monitor', 'juice', 'elapsed'],
    monitor: label => val => {
        console.log(label + ' : \n', val)
        return val;
    },
    juice: (obj, keys) => {
        return keys.reduce( (result, key) => {
            if ( obj[key] ) {
                result[key] = obj[key];
            }
            return result;
        }, {});
    },
    elapsed: stamp => {
        if ( typeof stamp !== 'number' ) {
            stamp = Date.parse(stamp);
        }
        const millis = Date.now() - stamp;
        if ( millis < 60e3 ) {
            return '' + Math.floor(millis/1000) + 'sec';
        } else if ( millis < 60 * 60e3 ) {
            return '' + Math.floor(millis/60e3) + 'min';
        } else if ( millis < 24 * 60 * 60e3 ) {
            return '' + Math.floor(millis/(60 * 60e3)) + 'h';
        } else {
            return '' + Math.floor(millis/(24 * 60 * 60e3)) + 'd';
        }
    },
    spawn: function spawn(context) {
        this.functions.forEach( fn => context[fn] = this[fn] )
    }
}

module.exports = mylib;

// arrayToObject ?

// spawn every function ?
