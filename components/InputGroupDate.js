import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment'
import { CalendarIcon } from "@heroicons/react/20/solid";

export default function InputGroupDate({ label, type, classes, id, name, onChange, value, placeholder, disabled, readOnly, invalid, required, format }) {
    const dateInput = React.createRef();
    const [select, setSelect] = useState(value ? new Date(value) : "")
    // const select = value ? new Date(value) : new Date()
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }
    const handleChangeDate = (date) => {
        if (date) {
            const dateCurrent = new Date(date);
            setSelect(date)
            onChange({ target: { name: name, value: moment(dateCurrent).format(format) } })
        } else {
            onChange({ target: { name: name, value: '' } })
        }

    };
    useEffect(() => {
        // console.log("value",value)
        setSelect(value ? new Date(value) : "")
    }, [value])
    const refInput = useRef();
    return (
        <div className="block w-full">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label} {required ? <span className="text-red-800">*</span> : <></>}
            </label>
            <div className="mt-1">
                <div className="relative">
                    <DatePicker
                        customInputRef={dateInput.current}
                        dateFormat="yyyy/MM/dd"
                        placeholderText={placeholder}
                        selected={select}
                        type={type}
                        name={name}
                        id={id}
                        // value={value}
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        // value={moment(new Date(defaultValue)).format('YYYY-MM-DD')}
                        onChange={(e) => { handleChangeDate(e) }}
                        placeholder={placeholder}
                        disabled={disabled}
                        readOnly={readOnly}
                        className={classNames(invalid ? 'border-red-800 focus:border-red-500 focus:ring-red-500 ' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ', classes, "block w-full rounded-md shadow-sm sm:text-sm disabled:text-gray-800 disabled:bg-gray-50 disabled:text-gray-500")}
                    />
                    <CalendarIcon
                        className={classNames(invalid ? 'pointer-events-none w-6 h-6 absolute top-1/2 transform -translate-y-1/2 right-3 text-red-800' : 'pointer-events-none w-6 h-6 absolute top-1/2 transform -translate-y-1/2 right-3 text-gray-400')} />
                </div>
            </div>
            {invalid && <span className="text-sm font-medium tracking-tight text-red-800">This field is required</span>}
        </div>
    )
}
InputGroupDate.propTypes = {
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
InputGroupDate.defaultProps = {
    disabled: false,
    type: "text",
    placeholder: "YYYY/MM/DD",
    require: false,
    readOnly: false,
    value: "",
    invalid: false,
    format: "YYYY-MM-DD hh:mm:ss"
};