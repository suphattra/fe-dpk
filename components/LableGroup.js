import React, { useRef } from "react";
import PropTypes from "prop-types";

export default function LableGroup({ label, type, classes, id, name, onChange, value, placeholder, disabled, readOnly, invalid, required, ref, unit }) {
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }
    const refInput = useRef();
    return (
        <div className="block w-full">
            <label htmlFor={id} className="block text-sm text-gray-700">
                <b className="font-bold ">{label}</b> : {value}
            </label>
        </div>
    )
}
LableGroup.propTypes = {
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
LableGroup.defaultProps = {
    disabled: false,
    type: "text",
    placeholder: "",
    require: false,
    readOnly: false,
    value: "",
    invalid: false
};