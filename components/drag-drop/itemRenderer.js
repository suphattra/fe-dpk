const itemRenderer = ({ item,
    itemContext,
    getItemProps,
    getResizeProps }) => {
    let bg_color;
    switch (item.status) {
        case "NEW":
            bg_color = "#AED6F1";//bg-blue-400 rgb(96 165 250)
            break;
        case "GOING_TO_PICKUP":
            bg_color = "#FCF3CF";//bg-yellow-400 rgb(250 204 21)
            break;
        case "DELIVERING":
            bg_color = "#E8DAEF";//bg-indigo-400 rgb(129 140 248)
            break;
        case "COMPLETE":
            bg_color = "#D5F5E3";//bg-green-400 rgb(74 222 128)
            break;
        case "HOLD":
            bg_color = "#FBDDFB";//bg-pink-400 rgb(244 114 182)
            break;
        case "CANCEL":
            bg_color = "rgb(156 163 175)";//bg-gray-400
            break;
        case "EMERGENCY":
            bg_color = "#F1948A";//bg-red-400 rgb(248 113 113)
            break;
        default:
            bg_color = "rgb(248 113 113)";
    }
    const { left: leftResizeProps, right: rightResizeProps } = getResizeProps()
    return (
        <div
            {...getItemProps({
                style: {
                    background: bg_color,
                    border: item.lockFlag !== "Y" ? '2px solid rgb(228 228 231)' : '2px solid red',//itemContext.selected ? '2px solid green' :
                    borderRadius: '8px',
                    color: 'black',
                    height: "75px",
                    // margin:"2px"
                    // boxShadow: `0 1px 5px 0 rgba(0, 0, 0, 0.2),
                    //          0 2px 2px 0 rgba(0, 0, 0, 0.14),
                    //          0 3px 1px -2px rgba(0, 0, 0, 0.12)`
                    // borderLeftWidth: itemContext.selected ? 1 : 2,
                    // borderRightWidth: itemContext.selected ? 1 : 2,
                },
                onDoubleClick: () => {
                    console.log('on ondblclick')
                    item.onSelect = true
                    setSelectItems(item)
                    setShowJobDetailForm(true)
                },
                onMouseLeave: () => {
                    console.log('on onMouseLeave')
                },
                onMouseDown: () => {
                    console.log('on item click', item, itemContext, getResizeProps)
                    item.onSelect = true
                    setSelectItems(item)
                },
                onItemMove: (itemId, dragTime, newGroupOrder) => {
                    console.log('on item onItemMove', itemId, dragTime, newGroupOrder)
                },
            })}
        >

            {itemContext.useResizeHandle ? <div {...leftResizeProps} /> : null}
            <div
                className="rounded-lg shadow-sm mr-1 pt-1 "
                style={{
                    height: "72px",
                    width: '100%',
                    borderRadius: '8px',
                    // height: itemContext.dimensions.height,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: '1rem',
                    border: itemContext.selected ? '2px solid black' : '',//itemContext.selected ?
                }}>

                <div className="flex items-between justify-between px-1 break-words"
                    style={{
                        textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        fontSize: '10px',
                        lineHeight: '10px'
                    }}
                >
                    <Tooltip message={item.jobTypeTxt} position="left-4 top-0">
                        {item.jobType === 'DOCUMENT' && <ClipboardDocumentIcon className="text-white-600 hover:text-white-900 h-3 w-3" />}
                        {item.jobType === 'FOOD' && <CakeIcon className="text-white-600 hover:text-white-900 h-3 w-3 " />}
                        {item.jobType === 'PARCEL' && <CubeIcon className="text-white-600 hover:text-white-900 h-3 w-3 " />}
                        {item.jobType === 'CHECK' && <TicketIcon className="text-white-600 hover:text-white-900 h-3 w-3 " />}
                        {item.jobType === 'BILL' && <FolderMinusIcon className="text-white-600 hover:text-white-900 h-3 w-3 " />}
                        {item.jobType === 'ATTORNEY' && <IdentificationIcon className="text-white-600 hover:text-white-900 h-3 w-3 " />}
                    </Tooltip>
                    {(item.lockFlag !== 'Y' && item.status !== "COMPLETE")
                        && <Tooltip message="Unassign" position="right-4 top-0">
                            <button className='h-3 w-3 inline-flex w-full justify-center bg-black justify-center rounded-md border border-transparent hover:bg-indigo-700 focus:outline-none text-white-600' type="button"
                                onClick={() => {
                                    if (item.lockFlag !== 'Y' && item.status !== "COMPLETE") {
                                        setModalUnassignJob(true)
                                        setSelectItemsUnassign(item)
                                    }
                                }} >
                                <ArrowUturnUpIcon className="text-white hover:text-white-900 h-2 w-2" />
                            </button>
                        </Tooltip>}
                </div>


                <div className="flex items-start justify-start px-2 pt-2" style={{ fontSize: '8px', lineHeight: '10px' }} >
                    <span>{item.customerName}</span>
                    {/* {item.customerName.length > 20 ? item.customerName.substring(0, 20) + "..." : item.customerName} */}
                </div>
                <div className="flex items-start justify-start px-2" style={{ fontSize: '8px', lineHeight: '10px' }} >
                    <span style={{ fontSize: '8px', lineHeight: '10px' }}> {item.paymentTxtEn}</span>
                </div>
                <div className="flex items-start justify-start px-2 bottom-0" style={{ fontSize: '8px', lineHeight: '10px' }}>
                    <span>{convertContactName(item.jobPoint).contactName}</span>
                </div>
                <div className="flex items-start justify-start px-2 bottom-0" style={{ fontSize: '8px', lineHeight: '10px' }}>
                    <span>{convertContactName(item.jobPoint).fullAddress}</span>
                    {/* <span>{convertContactName(item.jobPoint).fullAddress?.length > 20 ? convertContactName(item.jobPoint).fullAddress?.substring(0, 20) + "..." : convertContactName(item.jobPoint).fullAddress}</span> */}
                </div>
            </div>
            {itemContext.useResizeHandle ? (
                <div {...rightResizeProps} />
            ) : null}
            {/* {itemContext.useResizeHandle ? <div {...rightResizeProps} /> : null} */}
        </div>
    )
}