import { PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { useEffect } from "react";
import InputGroup from "../InputGroup";
import { _resObjConfig, renderOptions } from "../../helpers/utils";
import InputSelectGroup from "../InputSelectGroup";
import { MasterService } from "../../pages/api/master.service";
import InputGroupMask from "../InputGroupMask";
import { EmployeeService } from "../../pages/api/employee.service";
import { isEmpty } from "lodash";
import ItemProduct from "./ItemProduct";
import ItemIncome from "./ItemIncome";
import ImageUploading from "react-images-uploading";
import LoadingTemplate from "../LoadingTemplate";
export default function CardBranch({
  index,
  branch,
  onChange,
  deleteAddOnService,
  mode,
  dateSelect,
  onErrors,
  fieldRegister = () => { },
}) {
  const [querySucess, setQuerySucess] = useState(false);
  const [errors, setErrors] = useState({});
  const [branchType, setBranchType] = useState([]);
  const [productType, setProductType] = useState([]);
  const [supervisorList, setSupervisorList] = useState([]);
  const [listFile, setListFile] = useState([])
  const [images, setImages] = useState([]);
  const maxNumber = 69;
  useEffect(() => {
    async function fetchData() {
      await getConfigList("TYPE");
      await getConfigList("PRODUCTIVITY");
      await getEmployeeList();
      setQuerySucess(true);
    }
    fetchData();
  }, []);
  useEffect(() => {
    if (!isEmpty(branch.planPicture)) {
      let a = []
      if(!isEmpty(branch.planPicture.filePath)){
        a.push({
          data_url: branch.planPicture?.filePath,
          file: branch.planPicture?.filePath
        })
      }
      setImages(a);
    }

  }, [branch.planPicture]);
  useEffect(() => {
    setErrors(onErrors);
  }, [onErrors]);
  const getConfigList = async (code) => {
    let param = {
      type: "BRANCH",
      subType: code,
      status: 'Active',
    };
    await MasterService.getConfig(param)
      .then((res) => {
        if (res.data.resultCode === 200) {
          if (code === "TYPE") setBranchType(res.data.resultData);
          if (code === "PRODUCTIVITY") setProductType(res.data.resultData);
        } else {
          if (code === "TYPE") setBranchType([]);
          if (code === "PRODUCTIVITY") setProductType([]);
        }
      })
      .catch((err) => { });
  };
  const getEmployeeList = async () => {
    let search = {
      employeeFullName: "",
      limit: 10000,
      offset: 0,
      status: "Active",
    };
    await EmployeeService.getEmployeeList(search)
      .then((res) => {
        if (res.data.resultCode === 200) {
          setSupervisorList(res.data.resultData);
        } else {
          setSupervisorList([]);
        }
      })
      .catch((err) => { });
  };
  const handleChange = (e, index, name) => {
    let obj = {};
    if (name === "branchType" || name === "supervisor") {
      let _option = [];
      switch (name) {
        case "branchType":
          _option = branchType;
          break;
        case "supervisor":
          _option = supervisorList;
          break;
        default:
      }
      obj = _resObjConfig(e.target.value, _option);
      onChange({ target: { name: name, value: obj } }, index, name);
    }
    if (name === "supervisor") {
      obj = supervisorList.find((ele) => {
        return ele.employeeCode === e.target.value;
      });
      if (!isEmpty(obj)) {
        let emp = {
          _id: obj._id,
          employeeCode: obj.employeeCode,
          title: obj.title,
          firstName: obj.firstName,
          lastName: obj.lastName,
          nickName: obj.nickName,
          gender: obj.gender,
        };
        onChange({ target: { name: name, value: emp } }, index, name);
      }
    }
    if (name === "planPicture") {
      console.log(e)
      if (!isEmpty(e)) {
        let obj = {
          filePath: e[0].data_url
        }
        onChange({ target: { name: name, value: obj } }, index, name);
      } else {
        let obj = {
          filePath: ""
        }
        onChange({ target: { name: name, value: obj } }, index, name);
      }
    }
  };

  const callbackProduct = (e, index, name) => {
    onChange({ target: { name: "product", value: e } }, index - 1, "product");
  };

  const callbackIncome = (e, index) => {
    onChange(
      { target: { name: "annualIncome", value: e } },
      index - 1,
      "annualIncome"
    );
  };
  const handleFileChange = async (e) => {
    e.preventDefault();
    const files = e.target.files
    console.log(files)
    if (files.length > 0) {
      let param = {
        index: listFile.length + 1,
        file: files[0],
        fileName: files[0].name,
        fileSizeKb: files[0].size,
        recordStatus: 'A',
        filePath: files[0].name,
        action: 'add'
      };
      setListFile([...listFile, param])
    }

  }

  const onChangeImg = (imageList, addUpdateIndex, index) => {
    setImages(imageList);
    handleChange(imageList, index, 'planPicture')
  };
  return (
    <div className="mt-4 flex flex-col">
      {mode != "edit" && (
        <div className="flex flex-row-reverse py-2 px-2 border border-gray-200 rounded-t-md">
          <button
            type="button"
            className="flex justify-center inline-flex items-center rounded-md border border-transparent  text-xs font-medium text-black shadow-sm hover:bg-red-200 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-80"
            onClick={(e) => deleteAddOnService(branch.index)}
          >
            <XMarkIcon className="h-8 w-8  pointer" aria-hidden="true" />
          </button>
        </div>
      )}
      {querySucess && (
        <div className="rounded-md p-4 shadow-md">
          <div className="grid grid-cols-3 md:grid-cols-1 lg:grid-cols-3 gap-4 mr-6">
            <InputGroup
              type="text"
              label="ชื่อสาขา/แปลง"
              id="branchName"
              name="branchName"
              onChange={(e) => onChange(e, index, "branchName")}
              value={branch.branchName}
              required
              invalid={
                errors?.branchName ? errors?.branchName[branch.index] : false
              }
            />
            <InputSelectGroup
              type="text"
              id={"branch" + branch.index}
              name="branchType"
              label="ประเภท"
              onChange={(e) => handleChange(e, index, "branchType")}
              isSearchable
              options={renderOptions(branchType, "value1", "code")}
              value={branch.branchType.code}
              invalid={
                errors?.branchType ? errors?.branchType[branch.index] : false
              }
              required
            />
            <InputSelectGroup
              type="text"
              id={"branch" + branch.index}
              name="supervisor"
              label="ผู้ดูแล"
              onChange={(e) => handleChange(e, index, "supervisor")}
              isSearchable
              options={renderOptions(
                supervisorList,
                "firstName",
                "employeeCode",
                "lastName"
              )}
              value={branch.supervisor.employeeCode}
              required
              invalid={
                errors?.supervisor ? errors?.supervisor[branch.index] : false
              }
            />
          </div>
          <div className="grid grid-cols-3 md:grid-cols-1 lg:grid-cols-3 gap-4 mr-6 mt-4 mb-4">
            <InputGroupMask
              type="text"
              id="areaSize"
              name="areaSize"
              label="ขนาดพื้นที่"
              mask={[
                /[0-9]/,
                /\d/,
                /\d/,
                /\d/,
                /\d/,
                /\d/,
                /\d/,
                /\d/,
                /\d/,
                /\d/,
              ]}
              onChange={(e) => onChange(e, index, "areaSize")}
              value={branch.areaSize}
              unit={"ไร่"}
            />

            <div className="block w-full">
              <label
                htmlFor={"address"}
                className="block text-sm font-medium text-gray-700"
              >
                {"บริเวณที่ตั้ง"}
              </label>
              <textarea
                value={branch.address}
                onChange={(e) => onChange(e, index, "address")}
                id="address"
                name="address"
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:text-gray-800 disabled:bg-gray-50"
              />
            </div>
            <div className="block w-full">
              <label
                htmlFor={"remark"}
                className="block text-sm font-medium text-gray-700"
              >
                {"หมายเหตุ"}
              </label>
              <textarea
                value={branch.remark}
                onChange={(e) => onChange(e, index, "remark")}
                id="remark"
                name="remark"
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:text-gray-800 disabled:bg-gray-50"
              />
            </div>
          </div>
          <hr />
          <div className="pt-4">
            {branch.product.length <= 0 && (
              <div
                className="flex bg-blue-100 rounded-lg p-4 text-sm text-blue-700"
                role="alert"
              >
                <svg
                  className="w-5 h-5 inline mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <div>กดปุ่มเพิ่มเมื่อต้องการเพิ่มผลผลิตของแปลง/สาขา</div>
              </div>
            )}
            <ItemProduct
              extraProduct={branch.product}
              inventoryOption={productType}
              errors={errors?.product ? errors?.product[branch.index] : false}
              callbackProduct={(e) => callbackProduct(e, branch.index)}
            />
          </div>
          <hr />
          <div className="pt-4">
            {branch.annualIncome.length <= 0 && (
              <div
                className="flex bg-blue-100 rounded-lg p-4 text-sm text-blue-700"
                role="alert"
              >
                <svg
                  className="w-5 h-5 inline mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <div>กดปุ่มเพิ่มเมื่อต้องการเพิ่มรายได้ของแปลง/สาขา</div>
              </div>
            )}
            <ItemIncome
              extraProduct={branch.annualIncome}
              inventoryOption={productType}
              callbackIncome={(e) => callbackIncome(e, branch.index)}
            />
          </div>
          <hr />
          <label htmlFor="" className="block text-sm font-medium text-gray-700">แผนผังแปลง:</label>
          <ImageUploading
            value={images}
            onChange={(e, addUpdateIndex) => { onChangeImg(e, addUpdateIndex, index) }}
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
              <div className="upload__image-wrapper ">
                <div className="flex items-center justify-center space-x-4">
                  {imageList.length <= 0 && <div className="w-100 border rounded-md" for="photo" style={{ textAlign: "center", width: "50%" }} {...dragProps}>
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
                  }
                </div>
                {/* <div className="flex justify-end ">
                  <button
                    className="flex justify-center inline-flex items-center rounded-md border bg-white-800 px-6 py-1.5 text-xs font-medium text-black shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-0 focus:ring-white-500 focus:ring-offset-0 disabled:opacity-80"
                    type="button" onClick={onImageRemoveAll}>
                    <TrashIcon className="h-4 w-4 mr-2" aria-hidden="true" />
                    Remove all images</button>
                </div> */}
                <div className="flex items-center justify-center space-x-4 mt-4">
                  {imageList.map((image, index) => (

                    <div key={index} className="image-item" style={{ textAlign: "center", width: "50%" }}>
                      <img src={image.data_url} alt="" width="100%" style={{ textAlign: "center" }} className="p-4 border rounded-md" />
                      <hr />
                      <div className="flex justify-between ">
                        <button
                          className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-white-800 px-2 py-1.5 text-xs font-medium text-black shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-0 focus:ring-white-500 focus:ring-offset-0 disabled:opacity-80"
                          type="button" onClick={() => onImageUpdate(index)}>
                          <PencilIcon className="h-4 w-4 mr-2" aria-hidden="true" />
                          แก้ไข</button>
                        <button
                          className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-white-800 px-2 py-1.5 text-xs font-medium text-black shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-0 focus:ring-white-500 focus:ring-offset-0 disabled:opacity-80"
                          type="button" onClick={() => onImageRemove(index)}>
                          <TrashIcon className="h-4 w-4 mr-2" aria-hidden="true" />
                          ลบ</button>
                      </div>
                    </div>

                  ))}
                </div>
              </div>
            )}
          </ImageUploading>
        </div>
      )}
       {!querySucess && <LoadingTemplate/>}
    </div>
  );
}
