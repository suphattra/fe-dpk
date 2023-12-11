import Layout from "../../layouts";
import LoadingOverlay from "react-loading-overlay";
import { useForm } from "react-hook-form";
import {
  CardBasic,
  InputGroup,
  InputGroupDate,
  InputRadioGroup,
  InputSelectGroup,
} from "../../components";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useRouter } from "next/router";
import { renderOptions } from "../../helpers/utils";
import CardTimesheet from "../../components/time-sheet/CardTimesheet";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import Breadcrumbs from "../../components/Breadcrumbs";
import moment from "moment";
import { OperationsService } from "../api/operations.service";
import { NotifyService } from "../api/notify.service";
import CardBranch from "../../components/branches/CardBranch";
import { BranchService } from "../api/branch.service";
const initial = {
  areaSize: "",
  address: "",
  task: {},
  employee: {},
  branchType: {
    code: "",
    name: "",
  },
  mainBranch: {},
  inventory: [],
};
export default function DetailBranch() {
  const breadcrumbs = [
    { index: 1, href: "/branches", name: "สาขาเเละแปลงงาน" },
    { index: 2, href: "/branches", name: "สร้างสาขาและแปลงงาน" },
  ];
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [mode, setMode] = useState(router.query["mode"]);
  const [jobDetail, setJobDetail] = useState(initial.jobDetail);
  const [branchForm, setBranchForm] = useState([
    {
      index: 1,
      branchName: "",
      branchType: initial.branchType,
      product: [], //initial.task,
      supervisor: {},
      areaSize: initial.areaSize,
      address: initial.address,
      annualIncome: [],
      remark: "",
      planPicture: {},
      status: 'Active',
      createdBy: 'initail_by_admin',
      updatedBy: 'initail_by_admin',
    },
  ]);
  const createValidationSchema = () => {};
  const validationSchema = createValidationSchema();
  const formOptions = { resolver: yupResolver(validationSchema) };
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm(formOptions);
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  const handleSave = async () => {
    const errorList = [];
    console.log(branchForm);

    for (let branch of branchForm) {
      if (!branch.branchName) {
        errorList.push({
          field: `branchName[${branch.index}]`,
          type: "custom",
          message: "custom message",
        });
      }
      if (!branch.branchType.code) {
        errorList.push({
          field: `branchType[${branch.index}]`,
          type: "custom",
          message: "custom message",
        });
      }
      if (!branch.supervisor.employeeCode) {
        errorList.push({
          field: `supervisor[${branch.index}]`,
          type: "custom",
          message: "custom message",
        });
      }
      console.log(branch.product);
      if (branch.product.length > 0) {
        for (let product of branch.product) {
          if (!product.code) {
            errorList.push({
              field: `product[${branch.index}].code[${product.index}]`,
              type: "custom",
              message: "custom message",
            });
          }
          if (!product.amount) {
            errorList.push({
              field: `product[${branch.index}].amount[${product.index}]`,
              type: "custom",
              message: "custom message",
            });
          }
        }
      }
    }
    console.log(errorList);

    if (errorList.length === 0) {
      setLoading(true);
      console.log(branchForm);
      let dataList = {
        dataList: branchForm,
      };
      await BranchService.createBranch(dataList).then((res) => {
        if (res.data.resultCode === 200) {
          NotifyService.success("บันทึกข้อมูลเรียบร้อยเเล้ว");
          router.push("/branches");
          // window.location.reload()
        } else {
          NotifyService.error(res.data.message);
        }
      });
      setLoading(false);
    } else {
      errorList.forEach(({ field, type, message }) => {
        setError(field, { type, message });
      });
    }
  };
  const onChange = (e, index, name) => {
    console.log("dddddddddddddd", e.target.value, index, name);
    let _newValue = [...branchForm];
    _newValue[index][name] = e.target.value;
    setBranchForm(_newValue);

    if (errors) {
      if (e.target.value) {
        console.log(name)
        if (
          (name === "product" || name === "amount") &&
          e.target.value?.length > 0
        ) {
          for (let product of e.target.value) {
            if (product?.code) {
              clearErrors(
                `${name}[${_newValue[index].index}].code[${product.index}]`
              );
            }
            if (product?.amount) {
              clearErrors(
                `${name}[${_newValue[index].index}].amount[${product.index}]`
              );
            }
          }
        } else {
          clearErrors(`${name}[${_newValue[index].index}]`);
        }
      }
    }
  };

  const deleteAddOnService = (rowIndex) => {
    console.log("rowIndex", rowIndex);
    // let newData = newData.filter((_, i) => i != rowIndex - 1)
    const newData = branchForm.filter((item) => item.index !== rowIndex);
    console.log("newData", newData);
    setBranchForm(newData);
  };
  const insertAddOnService = async () => {
    if (branchForm.length === 10) {
      NotifyService.error("สามารถเพิ่มสูงสุด 10 รายการ");
      return;
    }
    let lastElement =
      branchForm.length > 0 ? branchForm[branchForm.length - 1] : { index: 0 };
    let newService = {
      index: lastElement.index + 1,
      branchName: "",
      branchType: initial.branchType,
      product: [], //initial.task,
      supervisor: {},
      areaSize: initial.areaSize,
      address: initial.address,
      annualIncome: [],
      remark: "",
      planPicture: {},
      status: 'Active',
      createdBy: 'initail_by_admin',
      updatedBy: 'initail_by_admin',
    };
    setBranchForm((branch) => [...branch, newService]);
    console.log(newService);
  };
  return (
    <Layout>
      <LoadingOverlay
        active={loading}
        className="h-[calc(100vh-0rem)]"
        spinner
        text="Loading..."
        styles={{
          overlay: (base) => ({
            ...base,
            background: "rgba(215, 219, 227, 0.6)",
          }),
          spinner: (base) => ({ ...base }),
          wrapper: {
            overflowY: loading ? "scroll" : "scroll",
          },
        }}
      >
        <Breadcrumbs title="Job Detail" breadcrumbs={breadcrumbs} />
        <div className="md:container md:mx-auto">
          <form className="space-y-4" id="inputForm">
            {branchForm.length <= 0 && (
              <div
                className="flex bg-blue-100 rounded-lg p-4 mb-4 text-sm text-blue-700 mt-2"
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
                <div>กดปุ่มเพิ่มบันทึกเมื่อต้องการเพิ่มรายการสาขา/แปลงงาน</div>
              </div>
            )}
            {branchForm &&
              branchForm.map((branch, index) => {
                return (
                  <CardBranch
                    index={index}
                    branch={branch}
                    onChange={onChange}
                    deleteAddOnService={deleteAddOnService}
                    onErrors={errors}
                  />
                );
              })}
          </form>
          <div className="flex flex-row-reverse pt-4">
            <button
              type="button"
              className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-white-800 px-6 py-1.5 text-xs font-medium text-black shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-0 focus:ring-white-500 focus:ring-offset-0 disabled:opacity-80"
              onClick={insertAddOnService}
            >
              <PlusCircleIcon className="h-8 w-8 mr-2" aria-hidden="true" />
              เพิ่มบันทึก
            </button>
          </div>
          <div className="flex items-center justify-center sm:px-6 lg:px-8 sm:py-4 lg:py-4">
            <div className="flex justify-center items-center overflow-y-auto p-4">
              <div className="flex justify-center items-center">
                <button
                  type="button"
                  className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-gray-600 px-6 py-1 pb-1.5 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-2"
                  onClick={() => {
                    router.push("/branches");
                  }}
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-purple-600 px-6 py-1 pb-1.5 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={handleSave}
                >
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        </div>
      </LoadingOverlay>
    </Layout>
  );
}
