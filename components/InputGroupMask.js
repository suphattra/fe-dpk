import React, { useRef } from "react";
import PropTypes from "prop-types";
import MaskedInput from "react-text-mask";
export default function InputGroupMask({ label, type, classes, id, name, onChange, value, placeholder, disabled, readOnly, invalid, required, ref, mask, pattern, unit }) {
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    const handleKeyPress = event => {
        const charCode = event.which || event.keyCode;
        // Allow numeric characters, backspace, and decimal point
        if (charCode < 48 || charCode > 57) {
            if (charCode !== 46 && charCode !== 8) {
                event.preventDefault();
            }
        }
    };
    if (type == "number") {
        return (
            <div className="block w-full">
                <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                    {label} {required ? <span className="text-red-800">*</span> : <></>}
                </label>
                <div className="mt-1">
                    <div className={classNames(unit ? "relative mt-1 rounded-md shadow-sm" : "")}>
                        <input
                            type={type}
                            name={name}
                            id={id}
                            value={value}
                            onChange={onChange}
                            onKeyPress={handleKeyPress}
                            disabled={disabled}
                            readOnly={readOnly}
                            defaultValue={value}
                            pattern="/^-?[0-9]+$/"
                            className={classNames(invalid ? 'border-red-800 focus:border-red-500 focus:ring-red-500 ' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ', classes, "block w-full rounded-md shadow-sm sm:text-sm disabled:text-gray-800 disabled:bg-gray-50 disabled:text-gray-500")}

                        />
                        {unit && <div class="absolute inset-y-2 right-0 flex items-center">
                            <label for="currency" className="h-full border-l border-gray-300 bg-transparent py-1 pl-4 pr-4 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-xs" >
                                {unit}</label>
                        </div>}
                    </div>
                </div>
                {invalid && <span className="text-sm font-medium tracking-tight text-red-800">This field is required</span>}
            </div>
        )
    } else {
        return (
            <div className="block w-full">
                <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                    {label} {required ? <span className="text-red-800">*</span> : <></>}
                </label>
                <div className="mt-1">
                    <div className={classNames(unit ? "relative mt-1 rounded-md shadow-sm" : "")}>
                        <MaskedInput
                            type={type}
                            name={name}
                            id={id}
                            value={value}
                            onChange={onChange}
                            className={classNames(invalid ? 'border-red-800 focus:border-red-500 focus:ring-red-500 ' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ', classes, "block w-full rounded-md shadow-sm sm:text-sm disabled:text-gray-800 disabled:bg-gray-50 disabled:text-gray-500")}
                            placeholder=""
                            guide={false}
                            keepCharPositions={false}
                            showMask
                            mask={mask}
                            disabled={disabled}
                            readOnly={readOnly}
                            pattern={pattern}
                        />
                        {unit && <div class="absolute inset-y-2 right-0 flex items-center">
                            <label for="currency" className="h-full border-l border-gray-300 bg-transparent py-1 pl-4 pr-4 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-xs" >
                                {unit}</label>
                        </div>}
                    </div>
                </div>
                {invalid && <span className="text-sm font-medium tracking-tight text-red-800">This field is required</span>}
            </div>
        )
    }
}
InputGroupMask.propTypes = {
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
InputGroupMask.defaultProps = {
    disabled: false,
    type: "text",
    placeholder: "",
    require: false,
    readOnly: false,
    value: "",
    invalid: false,
    mask: []
};