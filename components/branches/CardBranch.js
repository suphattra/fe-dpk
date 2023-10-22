import { XMarkIcon } from "@heroicons/react/20/solid";
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
import ListFile from "../ListFile";

export default function CardBranch({
  index,
  branch,
  onChange,
  deleteAddOnService,
  mode,
  dateSelect,
  onErrors,
  fieldRegister = () => {},
}) {
  const [querySucess, setQuerySucess] = useState(false);
  const [errors, setErrors] = useState({});
  const [branchType, setBranchType] = useState([]);
  const [productType, setProductType] = useState([]);
  const [supervisorList, setSupervisorList] = useState([]);
  // const [files, setFiles] = useState([]);
  const [listFile, setListFile] = useState([])
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
    setErrors(onErrors);
  }, [onErrors]);
  const getConfigList = async (code) => {
    let param = {
      type: "BRANCH",
      subType: code,
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
      .catch((err) => {});
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
      .catch((err) => {});
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
  };

  const callbackProduct = (e, index,name) => {
    console.log(e, index,name)
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
                name="บริเวณที่ตั้ง"
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
                name="หมายเหตุ"
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

<div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-3 gap-4 mb-4 mt-6">
    <label className="block">
        <input type="file" className="block w-full text-sm text-gray-500 file:mr-2 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            onChange={e => { handleFileChange(e) }} 
            disabled={mode === 'view'}
        />
        <span className="sr-only">Choose File</span>
    </label>
</div>
          <ListFile data={listFile}/>
        </div>
      )}
    </div>
  );
}
