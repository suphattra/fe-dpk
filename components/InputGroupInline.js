import React, { useRef } from "react";
import PropTypes from "prop-types";

export default function InputGroupInline({ label, type, classes, id, name, onChange, value, placeholder, disabled, readOnly, invalid, required, ref, unit }) {
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }
    const refInput = useRef();
    return (
        <div className="md:flex md:items-center mb">
            <div className="md:w-1/3 text-right mr-2">
                <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                    {label} {required ? <span className="text-red-800">*</span> : <></>}
                </label>
            </div>
            <div class="md:w-2/3">
                <div className="mt-1">
                    <div className={classNames(unit ? "relative mt-2 rounded-md shadow-sm" : "")}>
                        <input
                            type={type}
                            name={name}
                            id={id}
                            value={value}
                            onChange={onChange}
                            placeholder={placeholder}
                            disabled={disabled}
                            readOnly={readOnly}
                            defaultValue={value}
                            // {...ref}
                            // ref={{ ...ref }}
                            className={classNames(invalid ? 'border-red-800 focus:border-red-500 focus:ring-red-500 ' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ', classes, "block w-full rounded-md shadow-sm sm:text-sm disabled:text-gray-800 disabled:bg-gray-50 disabled:text-gray-500")}
                        />
                        {unit && <div class="absolute inset-y-2 right-0 flex items-center">
                            <label for="currency" className="h-full border-l border-gray-300 bg-transparent py-1 pl-4 pr-4 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-xs" >
                                {unit}</label>
                        </div>}
                    </div>
                </div>
            </div>
            {invalid && <span className="text-sm font-medium tracking-tight text-red-800">This field is required</span>}
        </div>
    )
}
InputGroupInline.propTypes = {
    classes: PropTypes.string,
    ref: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    invalid: PropTypes.bool
};
InputGroupInline.defaultProps = {
    disabled: false,
    type: "text",
    placeholder: "",
    require: false,
    readOnly: false,
    value: "",
    invalid: false
};