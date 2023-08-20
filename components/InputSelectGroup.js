import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import Select, { StylesConfig } from 'react-select';
// const refInput = React.createRef();
export default function InputSelectGroup({ label, type, classes,placeholder ,id, name, onChange, value, options, disabled, readOnly, invalid, required, ref, msgError, isSearchable, isMulti }) {
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }
    const handleChangeDate = (e) => {
        console.log(e)
        if (isMulti) {
            onChange({ target: { name: name, value: e } })
        } else {
            onChange({ target: { name: name, value: e.value } })
        }

    };
    function getDefaultValue() {
        if (!value) return null;
        return options.find(option => option.value == value);
    }
    const colourStyles = {
        control: (baseStyles, { data, isDisabled, isFocused, isSelected }) => ({
            ...baseStyles,
            '&:hover': { border: "1px solid #6366f1" },
            backgroundColor: disabled ? '#f9fafb' : 'white',
            borderColor: invalid ? '#991b1b' : '#d1d5db',
            fontSize: "0.875rem",
        }),
        option: (styles, { data, isDisabled, isFocused, isSelected }) => {
            return {
                ...styles,
                fontSize: "0.875rem",
            };
        },
    };
    return (

        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label} {required ? <span className="text-red-800">*</span> : <></>}
            </label>
            <div className="mt-1">
                <Select
                    styles={colourStyles}
                    // classNamePrefix="select"
                    isSearchable={isSearchable}
                    isMulti={isMulti}
                    // className={classNames(invalid ? 'border-red-800 focus:border-red-300 focus:ring-red-300' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500', classes, "block w-full rounded-md shadow-sm sm:text-sm disabled:text-gray-800 disabled:bg-gray-50")}
                    onChange={handleChangeDate}
                    options={options}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.value}
                    value={getDefaultValue()}
                    defaultValue={getDefaultValue()}
                    isDisabled={disabled}
                    placeholder={placeholder}
                    id={id}
                    name={name}
                />
                {msgError && msgError[name] && <p>This is a required field</p>}
            </div>
            {invalid && <span className="text-sm font-medium tracking-tight text-red-800">This field is required</span>}
        </div>
    )
}
InputSelectGroup.propTypes = {
    classes: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    options: PropTypes.array,
    invalid: PropTypes.bool,
    placeholder:PropTypes.bool,
};
InputSelectGroup.defaultProps = {
    type: "select",
    placeholder: "",
    require: false,
    readOnly: false,
    value: "",
    invalid: false,
    isSearchable: false
};