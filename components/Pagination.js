import React, { useEffect, useState } from "react";

export default function Pagination({
    postsPerPage,
    totalPosts,
    currentPage,
    paginate,
    lengthList
}) {
    const [pageNumbers, setPageNumbers] = useState([])
    useEffect(() => {
        const _pageNumber = [];
        console.log('dddd', Math.ceil(totalPosts / postsPerPage))
        for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
            _pageNumber.push(i);
        }
        setPageNumbers(_pageNumber)
    }, [totalPosts])


    const paginateBack = (number) => {
        paginate(number - 1);
    }
    const paginateFront = (number) => {
        paginate(number + 1);
    }
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }
    return (
        <div className="flex items-between justify-between lg:pt-4">
            <div>
                <p className='text-sm text-gray-700'>
                    Showing
                    {/* + lengthList.length */}
                    {/* <span className='font-medium'> {currentPage * postsPerPage} </span> */}
                    <span className='font-medium'>  {currentPage === pageNumbers.length ? totalPosts : lengthList.length * currentPage} </span>
                    of
                    <span className='font-medium'> {totalPosts} </span>
                    results
                </p>
            </div>
            <nav className='block'></nav>
            <div>
                <nav className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px' >
                    <a onClick={() => { if (currentPage !== 1) paginateBack(currentPage); }}
                        href='#'
                        className={classNames(currentPage === 1 ? 'cursor-not-allowed' : '', 'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50')}
                    >
                        <span>Previous</span>
                    </a>
                    <a href='#' className={classNames('cursor-not-allowed relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50')} >
                        <span>...</span>
                    </a>
                    <nav className='block'>
                        <ul className='flex pl-0 rounded list-none flex-wrap'>
                            <li>
                                {pageNumbers.map((number, index) => {
                                    //  && (pageNumbers.length - index) < pageNumbers.length  && pageNumbers.length - index
                                    if ((number >= currentPage) && (number < (currentPage + 10))) {
                                        return <a
                                            onClick={() => {
                                                paginate(number);
                                            }}
                                            href='#'
                                            key={number}
                                            className={
                                                currentPage === number
                                                    ? "bg-blue-100 border-indigo-300 text-indigo-500 hover:bg-blue-200 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                                                    : "bg-white text-gray-500 hover:bg-blue-200 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                                            }
                                        >
                                            {number}
                                        </a>
                                    }
                                })}
                            </li>
                        </ul>
                    </nav>
                    <a href='#' className={classNames('cursor-not-allowed relative inline-flex items-center px-2 py-2  border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50')}>
                        <span>...</span>
                    </a>
                    <a onClick={() => { if (currentPage !== pageNumbers.length) paginateFront(currentPage) }}
                        href='#'
                        className={classNames(currentPage === pageNumbers.length ? 'cursor-not-allowed' : '', 'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50')}
                    >
                        <span>Next</span>
                    </a>
                </nav>
            </div>
        </div>
    );
}