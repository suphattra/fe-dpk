// import { Label } from "@headlessui/react/dist/components/label/label";
import React, { useEffect, useState } from "react";
import ImageUploading from "react-images-uploading";

// import "./styles.css";

const UploadFileImg = (props) => {
    const { data, onDelete, disabled, type } = props;

    const [images, setImages] = useState([]);
    const maxNumber = 69;
    const onChange = (imageList, addUpdateIndex) => {
        // data for submit
        // console.log(imageList, addUpdateIndex);
        // setImages(imageList);
    };

    return (
        <div>
            <ImageUploading
                // multiple
                value={images}
                onChange={onChangeImg}
                maxNumber={maxNumber}
                dataURLKey="data_url"
                acceptType={["jpg"]}
            >
                {({
                    imageList,
                    onImageUpload,
                    onImageRemoveAll,
                    onImageUpdate,
                    onImageRemove,
                    isDragging,
                    dragProps
                }) => (
                    // write your building UI
                    <div className="upload__image-wrapper ">
                        <div className="flex items-center justify-center space-x-4">
                            <div className="w-100 border rounded-md" for="photo" style={{ textAlign: "center", width: "50%" }} {...dragProps}>
                                <div onClick={onImageUpload} className="icon-add-photo" style={{
                                    backgroundColor: "white",
                                    width: "max-content",
                                    margin: "0 auto",
                                    padding: "10px",
                                    borderRadius: "50%"
                                }}>
                                    <svg
                                        width="42"
                                        height="43"
                                        viewBox="0 0 42 43"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M33.25 12.5413V17.8984C33.25 17.8984 29.7675 17.9163 29.75 17.8984V12.5413H24.5C24.5 12.5413 24.5175 8.97592 24.5 8.95801H29.75V3.58301H33.25V8.95801H38.5V12.5413H33.25ZM28 19.708V14.333H22.75V8.95801H8.75C6.825 8.95801 5.25 10.5705 5.25 12.5413V34.0413C5.25 36.0122 6.825 37.6247 8.75 37.6247H29.75C31.675 37.6247 33.25 36.0122 33.25 34.0413V19.708H28ZM8.75 34.0413L14 26.8747L17.5 32.2497L22.75 25.083L29.75 34.0413H8.75Z"
                                            fill="#DF3062"
                                        />
                                    </svg>
                                </div>
                                <div style={{ color: "#344358", paddingTop: "5px", paddingBottom: "10px" }}>
                                    <h3 style={{ margin: "0" }}>อัพโหลดรูปภาพ</h3>
                                    <span>หรือลากไฟล์วางที่นี่</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end ">
                            <button
                                className="flex justify-center inline-flex items-center rounded-md border bg-white-800 px-6 py-1.5 text-xs font-medium text-black shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-0 focus:ring-white-500 focus:ring-offset-0 disabled:opacity-80"
                                type="button" onClick={onImageRemoveAll}>
                                <TrashIcon className="h-4 w-4 mr-2" aria-hidden="true" />
                                Remove all images</button>
                        </div>
                        <div className="flex items-center justify-center space-x-4">
                            {/* <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 m-6 align-middle"> */}
                            {imageList.map((image, index) => (

                                <div key={index} className="image-item" style={{ textAlign: "center", width: "50%" }}>
                                    <img src={image.data_url} alt="" width="100%" style={{ textAlign: "center" }} />
                                    <div className="flex justify-between ">
                                        <button
                                            className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-white-800 px-2 py-1.5 text-xs font-medium text-black shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-0 focus:ring-white-500 focus:ring-offset-0 disabled:opacity-80"
                                            type="button" onClick={() => onImageUpdate(index)}>
                                            <PencilIcon className="h-4 w-4 mr-2" aria-hidden="true" />
                                            Update</button>
                                        <button
                                            className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-white-800 px-2 py-1.5 text-xs font-medium text-black shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-0 focus:ring-white-500 focus:ring-offset-0 disabled:opacity-80"
                                            type="button" onClick={() => onImageRemove(index)}>
                                            <TrashIcon className="h-4 w-4 mr-2" aria-hidden="true" />
                                            Remove</button>
                                    </div>
                                </div>

                            ))}
                        </div>
                    </div>
                )}
            </ImageUploading>
        </div>
    );
}
export default UploadFileImg