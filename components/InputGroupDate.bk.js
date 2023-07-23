import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment'
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

export default function InputGroupDate({ label, type, classes, id, name, onChange, value, placeholder, disabled, readOnly, invalid, required, format }) {
    const dateInput = React.createRef();
    const [years, setYears] = useState([])
    const [select, setSelect] = useState(value ? new Date(value) : new Date())
    // const select = value ? new Date(value) : new Date()
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }
    const monthss = [
        { name: "January", value: 'Jan' },
        { name: "February", value: 'Jan' },
        { name: "March", value: 'Jan' },
        { name: "April", value: 'Jan' },
        { name: "May", value: 'May' },
        { name: "June", value: 'Jan' },
        { name: "July", value: 'Jan' },
        { name: "August", value: 'Jan' },
        { name: "September", value: 'Jan' },
        { name: "October", value: 'Jan' },
        { name: "November", value: 'Jan' },
        { name: "December", value: 'Jan' },
    ];
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const handleChangeDate = (date) => {
        console.log(date)
        setSelect(date)
        const dateCurrent = new Date(date);
        onChange({ target: { name: name, value: moment(dateCurrent).format(format) } })
    };
    const yearRank = (date) => {
        var currentYear = new Date().getFullYear(), years = [];
        let startYear = new Date(new Date().setFullYear(new Date().getFullYear() - 5)).getFullYear();

        while (startYear <= currentYear) {
            years.push(startYear++);
        }
        // setYears(years)
        return years;
    }
    // const years = range(1990, getYear(new Date()) + 1, 1);
    const refInput = useRef();
    return (
        <div className="block w-full">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label} {required ? <span className="text-red-800">*</span> : <></>}
            </label>
            <div className="mt-1">
                <DatePicker
                    // dateFormat={format}
                    // dateFormat="yyyy-MM-DD"
                    className={classNames(invalid ? 'border-red-800 focus:border-red-500 focus:ring-red-500 ' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ', classes, "block w-full rounded-md shadow-sm sm:text-sm disabled:text-gray-800 disabled:bg-gray-50")}
                    renderCustomHeader={({
                        date,
                        changeYear,
                        changeMonth,
                        decreaseMonth,
                        increaseMonth,
                        prevMonthButtonDisabled,
                        nextMonthButtonDisabled,
                    }) => (
                        <div
                            style={{
                                margin: 10,
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}
                                style={{ backgroundColor: '#216ba5' }}
                                className="flex justify-center h-9 inline-flex items-center rounded-md border border-transparent bg-blue-600 px-2 py-1 pb-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none mr-2 disabled:opacity-50">
                                <ChevronLeftIcon className="text-white-600 hover:text-white-900 h-3 w-3 " />
                            </button>
                            <select
                                className={classNames('border-gray-300 focus:border-indigo-500', " rounded-md shadow-sm text-sm disabled:text-gray-800 disabled:bg-gray-50")}
                                value={new Date(select).getYear(date)}
                                onChange={({ target: { value } }) => changeYear(value)}
                            >
                                {yearRank().map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>

                            <select
                                className={classNames('border-gray-300 focus:border-indigo-500', "rounded-md shadow-sm text-sm disabled:text-gray-800 disabled:bg-gray-50")}
                                value={months[(new Date(select)).getMonth(select)]}
                                onChange={({ target: { value } }) => {
                                    console.log(months.indexOf(value))
                                    changeMonth(months.indexOf(value))
                                }}
                            >
                                {months.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                                {/* {months.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.name}
                                    </option>
                                ))} */}
                            </select>

                            <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}
                                style={{ backgroundColor: '#216ba5' }}
                                className="flex justify-center h-9 inline-flex items-center rounded-md border border-transparent bg-blue-600 px-2 py-1 pb-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none ml-2 disabled:opacity-50"
                            >
                                <ChevronRightIcon className="text-white-600 hover:text-white-900 h-3 w-3 " />
                            </button>
                        </div>
                    )}
                    selected={select}
                    onChange={(date) => setSelect(date)}
                // onChange={(e) => handleChangeDate(e)}
                // onChange={(date) => setStartDate(date)}
                />
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
    placeholder: "",
    require: false,
    readOnly: false,
    value: "",
    invalid: false,
    format: "YYYY-MM-DD hh:mm:ss"
};