import React from "react";
import PropTypes from "prop-types";
import { HomeIcon } from '@heroicons/react/20/solid'
export default function Breadcrumbs({ title, children, breadcrumbs }) {
    const pages = [
        { name: title, href: '#', current: false }
    ]
    return (
        <div className='flex justify-between border-b border-gray-200'>
            <div>
                <nav className="flex bg-white" aria-label="Breadcrumb">
                    <ol role="list" className="mx-auto flex space-x-4 space-x-reverse">
                        <li className="flex">
                            <div className="flex items-center pl-4">
                                <a href="#" className="text-gray-400 hover:text-gray-500">
                                    <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                                    <span className="sr-only">Home</span>
                                </a>
                            </div>
                        </li>
                        {breadcrumbs.map((page) => (
                            <li key={page.name} className="flex">
                                <div className="flex items-center">
                                    <svg
                                        className="h-full w-6 flex-shrink-0 text-gray-200"
                                        viewBox="0 0 24 44"
                                        preserveAspectRatio="none"
                                        fill="currentColor"
                                        xmlns="http://www.w3.org/2000/svg"
                                        aria-hidden="true"
                                    >
                                        <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                                    </svg>
                                    <a
                                        href={page.href}
                                        className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                                        aria-current={page.current ? 'page' : undefined}
                                    >
                                        {page.name}
                                    </a>
                                </div>
                            </li>
                        ))}
                    </ol>
                </nav>
            </div>
            <div>{children}</div>
        </div>
    )
}
Breadcrumbs.propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.array, PropTypes.object]),
    title: PropTypes.string,
    breadcrumbs: PropTypes.array,
};