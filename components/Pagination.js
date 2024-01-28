import React, { useEffect, useState } from "react";

export default function Pagination({
    postsPerPage,
    totalPosts,
    currentPages,
    paginate,
    lengthList,
    maxPage
}) {
    const pageNumberLimit = 10;
    const [maxPageLimit, setMaxPageLimit] = useState(maxPage);
    const [minPageLimit, setMinPageLimit] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [pages, setPages] = useState([])
    const [currentPage, setCurrentPage] = useState(currentPages);
    const [listData, setListData] = useState(lengthList);
    const [listDataShow, setListDataShow] = useState(0);
    useEffect(() => {
        const pageNumbers = [];
        if (lengthList && lengthList.length > 0) {
            for (let i = 1; i <= totalPosts; i++) {
                pageNumbers.push(i);
            }
        }
        setPages(pageNumbers)
        setListData(lengthList)
        setListDataShow(lengthList.length)
    }, [totalPosts, lengthList])

    useEffect(() => {
        setCurrentPage(currentPages)
        if (currentPages === 1) {
            setMinPageLimit(0)
            setMaxPageLimit(pageNumberLimit)
        }
    }, [currentPages])

    useEffect(() => {
        setTotalPage(maxPage)
    }, [maxPage])

    const paginateBack = (number) => {
        paginate(number - 1);
        if ((currentPage - 1) % pageNumberLimit === 0) {
            setMaxPageLimit(maxPageLimit - pageNumberLimit);
            setMinPageLimit(minPageLimit - pageNumberLimit);
        }
        setCurrentPage(prev => prev - 1);
    }
    const paginateFront = (number) => {
        paginate(number + 1);
        if (currentPage + 1 > maxPageLimit) {
            setMaxPageLimit(maxPageLimit + pageNumberLimit);
            setMinPageLimit(minPageLimit + pageNumberLimit);
        }
        setCurrentPage(prev => prev + 1);
    }
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }
    return (
        // lengthList.length > 0 ?

            <div className="flex items-between justify-between lg:pt-4">
                <div>
                    <p className='text-sm text-gray-700'>
                        Showing
                        <span className='font-medium'> {listDataShow + (currentPage - 1) * postsPerPage} </span>
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
                        {currentPage <= maxPageLimit && minPageLimit > 0 &&
                            <a href='#' className={classNames('cursor-not-allowed relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50')} >
                                <span>...</span>
                            </a>
                        }
                        <nav className='block'>
                            <ul className='flex pl-0 rounded list-none flex-wrap'>
                                <li>
                                    {pages.map((number, index) => {
                                        if (number <= maxPageLimit && number > minPageLimit && number <= totalPage) {
                                            return <a
                                                onClick={() => {
                                                    paginate(number);
                                                    setCurrentPage(number);
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
                                        } else {
                                            return null;
                                        }
                                    })}
                                </li>
                            </ul>
                        </nav>
                        {totalPage > maxPageLimit &&
                            <a href='#' className={classNames('cursor-not-allowed relative inline-flex items-center px-2 py-2  border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50')}>
                                <span>...</span>
                            </a>
                        }
                        <a onClick={() => { if (currentPage !== totalPage) paginateFront(currentPage) }}
                            href='#'
                            className={classNames(currentPage === totalPage ? 'cursor-not-allowed' : '', 'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50')}
                        >
                            <span>Next</span>
                        </a>
                    </nav>
                </div>
            </div>
            // :
            // <div></div>
    );
}