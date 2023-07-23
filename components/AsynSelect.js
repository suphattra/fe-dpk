import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import AsyncSelect from 'react-select/async'

function AsynSelectCustom({
    id,
    name,
    classes,
    style,
    label,
    value,
    options,
    onChange,
    require,
    readOnly,
    disabled,
    isClearable,
    defaultValue,
    useValue,
    optionValue,
    optionDisplay,
    required
}) {

    const customStyles = {
        control: base => ({
            ...base,
            minHeight: 30,
            fontSize: '12px'
        }),
        dropdownIndicator: base => ({
            ...base,
            padding: 4
        }),
        clearIndicator: base => ({
            ...base,
            padding: 4,
            fontSize: '12px'
        }),
        multiValue: base => ({
            ...base,
            fontSize: '12px'
        }),
        valueContainer: base => ({
            ...base,
            padding: '0px 6px',
            fontSize: '12px'
        }),
        input: base => ({
            ...base,
            margin: 0,
            padding: 0,
            fontSize: '12px'
        }),
        menuList: base => ({
            ...base,
            minHeight: 'fit-content',
            fontSize: '12px'
        }),
    };
    const [selected, setSelected] = useState(value)
    const onChangeSelect = (event) => {
        if (!event) {
            event = {
                value: '',
            };
        }
        onChange({ target: { name: name, value: optionValue ? event[optionValue] : event.id } })
    }

    const setValue = (newValue) => {
        return options.filter(option =>
            option.id == value)
    }


    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label} {required ? <span className="text-red-800">*</span> : <></>}
            </label>
            <div className="mt-1">
                <AsyncSelect
                    cacheOptions
                    // className='react-select'
                    classNamePrefix='select'
                    defaultOptions={options}
                    // styles={customStyles}
                    onChange={e => { onChangeSelect(e); }}
                    value={setValue(selected)}
                    getOptionValue={(option) => option.id}
                    getOptionLabel={(option) => optionDisplay ? option[optionDisplay] : option.value}
                />
            </div>
        </div>
    )
}

AsynSelectCustom.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    classes: PropTypes.string,
    style: PropTypes.object,
    label: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    options: PropTypes.array,
    onChange: PropTypes.func,
    require: PropTypes.bool,
    readOnly: PropTypes.bool,
    setValue: PropTypes.bool
};

AsynSelectCustom.defaultProps = {
    optionValue: 'id',
    optionDisplay: 'value',
};
export default AsynSelectCustom;