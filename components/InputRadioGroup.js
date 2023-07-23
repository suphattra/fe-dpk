import React from "react";
import PropTypes from "prop-types";
export default function InputRadioGroup({ label, type, classes, id, name, onChange, value, disabled, checked }) {
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }
    return (
        <div className="flex items-center">
            <input
                id={id}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                disabled={disabled}
                checked={checked}
                className={classNames(classes, "border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:text-indigo-200 disabled:text-indigo-200")}
            />
            <label htmlFor={id} className="ml-3 block text-sm font-medium text-gray-700">
                {label}
            </label>
        </div>
    )
}
InputRadioGroup.propTypes = {
    classes: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};