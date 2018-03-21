const mylib = {
    monitor: label => val => {
        console.log(label + ' : \n', val)
        return val;
    },
    juice: (obj, keys) => {
        return keys.reduce( (result, key) => {
            result[key] = obj[key];
            return result;
        }, {});
    },
    spawn: function (context) {
        context['monitor'] = this.monitor;
        context['juice'] = this.juice;
    }
}

module.exports = mylib;
