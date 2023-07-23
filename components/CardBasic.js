import React from "react";
import PropTypes from "prop-types";
export default function CardBasic({ title, children }) {
    return (
        <div className="mt-4 flex flex-col">
            {title && <div className="py-2 px-4  border-gray-100 bg-gray-100 rounded-t-md">
                <h3 className="text-lg font-bold leading-6 text-gray-900 py-2">{title}</h3>
            </div>}
            <div className="rounded-md p-4 shadow-md border-gray-100">
                {children}
            </div>
        </div>
    )
}
CardBasic.propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.array, PropTypes.object]),
    title: PropTypes.string
}