import React, { useRef } from "react";
import PropTypes from "prop-types";
// const refInput = React.createRef();
export default function InputSelectGroup({ label, type, classes, id, name, onChange, value, options, disabled, readOnly, invalid, required, ref, msgError }) {

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }
    return (

        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label} {required ? <span className="text-red-800">*</span> : <></>}
            </label>
            <div className="mt-1">
                <select
                    id={id}
                    name={name}
                    autoComplete={name}
                    onChange={onChange}
                    disabled={disabled}
                    readOnly={readOnly}
                    value={value}
                    // ref={{ ...ref }}
                    // {...ref}
                    // defaultValue={value}
                    className={classNames(invalid ? 'border-red-800 focus:border-red-300 focus:ring-red-300' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500', classes, "block w-full rounded-md shadow-sm sm:text-sm disabled:text-gray-800 disabled:bg-gray-50  disabled:text-gray-500")}
                >
                    {options.map((opt, idx) => {
                        return (
                            <option value={opt.value} key={idx}>
                                {opt.name}
                            </option>
                        );
                    })}
                </select>
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
};
InputSelectGroup.defaultProps = {
    type: "select",
    placeholder: "",
    require: false,
    readOnly: false,
    value: "",
    invalid: false
};