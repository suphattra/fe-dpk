
export const Tooltip = ({ message, position, children }) => {
    return (
        <div className="relative z-[2100] flex flex-col items-center group">
            {children}
            <div className={position + " absolute  flex flex-col items-center hidden mb-6 group-hover:flex"}>
                <span style={{ fontSize: '8px', }}
                    className="relative z-[2100] p-2 text-xs leading-none text-white whitespace-no-wrap bg-gray-600 shadow-lg rounded-md">
                    {message}
                </span>
            </div>
        </div>
    );
};