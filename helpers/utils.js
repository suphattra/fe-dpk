export function renderConfigOptions(options, blank) {
    var result = []
    if (options === undefined || options.length <= 0) {
        result.unshift({ value: '', name: 'Please Select' })
        return result
    } else {
        result = options.map(item => ({ value: item.configCode, name: item.configValue }));
        if (blank) return result
        result.unshift({ value: '', name: 'Please Select' })
        return result
    }
}

export function renderOptions(options, name, value, addOn) {
    var result = []

    if (options === undefined || options.length <= 0) {
        result.unshift({ value: '', name: 'Please Select' })
        return result
    } else {
        result = options.map(item => ({ value: item[value], name: addOn ? item[name] + " (" + item[addOn] + ")" : item[name] }));
        result.unshift({ value: '', name: 'Please Select' })
        return result
    }
}
export function isEmpty(value) {
    if (value === "" || value === undefined || value === null || value === {}) {
        return true;
    } else {
        return false;
    }
}
export function convertFilter(_filter) {
    if (_filter === undefined || _filter === null) {
        return "";
    }
    var param = {};
    for (var k in _filter) {
        var value = _filter[k] ? _filter[k] : "";
        var key = k;
        if (typeof value === "string") {
            value = value.toString().trim();
        }
        if (!isEmpty(value)) {
            if (key == 'page' || key == 'size') {
                param[key] = value

            } else {
                param[key] = value
            }
        }
    }
    return param;
}