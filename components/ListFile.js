import { CloudArrowDownIcon, XCircleIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { DriverService } from "../pages/api/driver.service";
import { JobService } from "../pages/api/job.service";

const ListFile = (props) => {
    const { data, onDelete, disabled, type } = props;
    const [files, setFiles] = useState([]);
    useEffect(() => {
        if (data && data.length > 0) {
            setFiles(data)
            // dispatch(fileActions.listFile(`file_id=${String(data)}`)).then((response) => {
            //     if (response.success) {
            //         setFiles(response.datas);
            //     }
            // })
        } else {
            setFiles([]);
        }
    }, [data]);

    const handleDownloadFile = async (attachId) => {
        if (type === "job") {
            JobService.getAttachfile(attachId).then(res => {
                console.log(res)
                var file = new Blob([res.data], { type: res.headers['content-type'] });
                const fileURL = window.URL.createObjectURL(file);
                let alink = document.createElement('a');
                alink.href = fileURL;
                var filename = res.headers.get("content-disposition");
                if (filename && filename.indexOf('attachment') !== -1) {
                    var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    var matches = filenameRegex.exec(filename);
                    if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
                }
                alink.download = filename;
                alink.click();
            }).catch(err => {
                console.log(err)
            })
        } else {
            DriverService.getDownloadFile(attachId).then(res => {
                console.log(res)
                var file = new Blob([res.data], { type: res.headers['content-type'] });
                const fileURL = window.URL.createObjectURL(file);
                let alink = document.createElement('a');
                alink.href = fileURL;
                var filename = res.headers.get("content-disposition");
                if (filename && filename.indexOf('attachment') !== -1) {
                    var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    var matches = filenameRegex.exec(filename);
                    if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
                }
                alink.download = filename;
                alink.click();
            }).catch(err => {
                console.log(err)
            })
        }

    }
    return (
        <>
            <div className="mt-2 mb-4 flow-root">
                {/* divide-y */}
                <ul role="list" className="-my-5 divide-gray-200">
                    {files && files.length > 0 ? files.map(function (row, index) {
                        return (
                            <>
                                {row.action !== "delete" && <li key={row.fileName} className="py-2">
                                    <div className="flex items-center space-x-4">
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-bold text-indigo-900">{row.fileName}</p>
                                        </div>
                                        {(row.action !== "add") && <div>
                                            <button type="button"
                                                className="disabled:opacity-50"
                                                onClick={e => { e.preventDefault(); handleDownloadFile(row.attachId) }}
                                            // disabled={disabled}
                                            >
                                                <CloudArrowDownIcon color="green" disabled="true" className="text-white-600 hover:text-white-900 h-6 w-6 mr-0 cursor-pointer" />
                                            </button>
                                        </div>}

                                        <div>
                                            <button type="button"
                                                className="disabled:opacity-50"
                                                onClick={e => { onDelete(row) }}
                                                disabled={disabled}
                                            >
                                                <XCircleIcon color="red" className="text-white-600 hover:text-white-900 h-6 w-6 mr-0 cursor-pointer" />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                                }
                            </>
                        )
                    }) : ''}
                </ul>
            </div>
        </>
    )
}
export default ListFile