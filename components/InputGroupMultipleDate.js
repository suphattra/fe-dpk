import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment'
import { CalendarIcon } from "@heroicons/react/20/solid";

export default function InputGroupMultipleDate({ label, type, classes, id, name, onChange, value, startDate, endDate, placeholder, disabled, readOnly, invalid, required, format }) {
    const dateInput = React.createRef();

    const [select, setSelect] = useState(["",""])

    const [selectedStartDate, setSelectedStartDate] = useState(startDate ? new Date(startDate) : "")
    const [selectedEndDate, setSelectedEndDate] = useState(endDate ? new Date(endDate) : "")
    
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    const handleChangeDate = (dates) => {
        const [start, end] = dates;
        let startDateValue = "";
        let endDateValue = "";

        if(start){
            setSelectedStartDate(start);
            startDateValue = new Date(start);
        }
        if(end){
            setSelectedEndDate(end);
            endDateValue = new Date(end);
        }
        
        onChange({ 
            target: { 
                name: name, 
                value: {
                    startDate: startDateValue?moment(startDateValue).format(format):"",
                    endDate: endDateValue?moment(endDateValue).format(format):""
                }
            }
        })

    };

    useEffect(() => {
        const [start, end] = value
        setSelect([start ? new Date(start) : "", end ? new Date(end) : ""])
    }, [value])

    useEffect(() => {
        setSelectedStartDate(startDate ? new Date(startDate) : "")
        setSelectedEndDate(endDate ? new Date(endDate) : "")
    }, [startDate, endDate])

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
                        autoComplete={"off"}
                        selected={""}
                        startDate={selectedStartDate}
                        endDate={selectedEndDate}
                        selectsRange
                        type={type}
                        name={name}
                        id={id}
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
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
InputGroupMultipleDate.propTypes = {
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
    invalid: PropTypes.bool,
    startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
InputGroupMultipleDate.defaultProps = {
    disabled: false,
    type: "text",
    placeholder: "YYYY/MM/DD - YYYY/MM/DD",
    require: false,
    readOnly: false,
    value: "",
    invalid: false,
    format: "YYYY-MM-DD hh:mm:ss",
};