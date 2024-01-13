import { useEffect, useState } from "react";
import LoadingOverlay from "react-loading-overlay";
import Breadcrumbs from "../../../components/Breadcrumbs";
import Layout from "../../../layouts";
import { useRouter } from "next/router";
import moment from "moment";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { EmployeeService } from "../../api/employee.service";
import { NotifyService } from "../../api/notify.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import CardFinancialsEmployee from "../../../components/employee/CardFinancialsEmployee";
LoadingOverlay.propTypes = undefined;
export default function EmployeeDisbursement() {
  const router = useRouter();
  const breadcrumbsData = [
    { index: 1, href: '/employee', name: 'ข้อมูลพนักงาน' },
    { index: 2, href: '/employee', name: 'บันทึกเบิก-จ่าย' }
  ];
  const employeeCode = router.query["employeeCode"];
  const [loading, setLoading] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState(breadcrumbsData);
  const [addEmployeeForm, setAddEmployeeForm] = useState([
    {
      index: 1,
      transactionDate: moment(new Date()).format("YYYY-MM-DD"),
      employeeCode: employeeCode,
      financialType: {
        code: 'MD0088',
        value1: "รายการเบิก"
      },
      financialTopic: {
        code: '',
        value1: ""
      },
      amount: "",
      paymentType: {
        code: 'MD0090',
        value1: "เงินสด"
      },
      remark: "",
      receipt: null,
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

  useEffect(() => {
    async function fetchData() {
      await getEmployeeDetail(employeeCode);
    }
    fetchData();
  }, []);
  const getEmployeeDetail = async (employeeCode) => {
    await EmployeeService.getEmployeeDetail(employeeCode)
      .then((res) => {
        if (res.data.resultCode === 200) {
          setBreadcrumbs([...breadcrumbsData,{ index: 3, href: '/employee', name: 'สร้างบันทึก (' + res.data.resultData[0]?.firstName + ' '  + res.data.resultData[0]?.lastName + ')'}])
       } 
      })
      .catch((err) => {
        console.log("==> list job3");
      });
  };
  const handleSave = async () => {
    const errorList = [];
    console.log(addEmployeeForm);
    for (let employee of addEmployeeForm) {
      if (!employee.financialTopic.code) {
        errorList.push({
          field: `financialTopic[${employee.index}]`,
          type: "custom",
          message: "custom message",
        });
      }
      if (!employee.amount) {
        errorList.push({
          field: `amount[${employee.index}]`,
          type: "custom",
          message: "custom message",
        });
      }
    }
    if (errorList.length === 0) {
      setLoading(true);
      let dataList = {
        dataList: addEmployeeForm,
      };
      await EmployeeService.createEmployeeFinancials(dataList).then((res) => {
        if (res.data.resultCode === 200) {
          NotifyService.success("บันทึกข้อมูลเรียบร้อยเเล้ว");
          router.push("/employee/disbursement?employeeCode=" + employeeCode);
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
    console.log("dddddddddddddd", e, index, name);

    let _newValue = [...addEmployeeForm];
    if (_newValue[index]) {
      _newValue[index][name] = e.target.value;
      setAddEmployeeForm(_newValue);
    }
    if (errors) {
      if (e.target.value) {
        console.log(name);
      
          clearErrors(`${name}[${_newValue[index].index}]`);
        
      }
    }
  };

  const deleteAddOnService = (rowIndex) => {
    console.log("rowIndex", rowIndex);
    const newData = addEmployeeForm.filter((item) => item.index !== rowIndex);
    console.log("newData", newData);
    setAddEmployeeForm(newData);
  };

  const insertAddOnService = async () => {
    if (addEmployeeForm.length === 10) {
      NotifyService.error("สามารถเพิ่มสูงสุด 10 รายการ");
      return;
    }
    let lastElement =
      addEmployeeForm.length > 0
        ? addEmployeeForm[addEmployeeForm.length - 1]
        : { index: 0 };
    let newService = {
      index: lastElement.index + 1,
      transactionDate: moment(new Date()).format("YYYY-MM-DD"),
      employeeCode: employeeCode,
      financialType: {
        code: 'MD0088',
        value1: "รายการเบิก"
      },
      financialTopic: {
        code: '',
        value1: ""
      },
      amount: "",
      paymentType: {
        code: 'MD0090',
        value1: "เงินสด"
      },
      remark: "",
      receipt: null,
      status: 'Active',
      createdBy: 'initail_by_admin',
      updatedBy: 'initail_by_admin',
    };
    setAddEmployeeForm((timeSheet) => [...timeSheet, newService]);
  };
  return (
    <Layout>
      <LoadingOverlay
        active={loading}
        className="h-[calc(100vh-4rem)]"
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
        <Breadcrumbs title="ข้อมูลพนักงาน" breadcrumbs={breadcrumbs} />
        <div className="md:container md:mx-auto" style={{ overflow: "auto" }}>
          <form className="space-y-4" id="inputForm">
            {addEmployeeForm &&
              addEmployeeForm.map((employee, index) => {
                return (
                  <CardFinancialsEmployee
                    index={index}
                    employee={employee}
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
          <footer className="flex items-center justify-center sm:px-6 lg:px-8 sm:py-4 lg:py-4">
            <div className="flex justify-center items-center overflow-y-auto p-4">
              <div className="flex justify-center items-center">
                <button
                  type="button"
                  className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-gray-600 px-6 py-1 pb-1.5 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-2"
                  onClick={() => {
                    router.push("/employee/disbursement?employeeCode=" + employeeCode);
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
          </footer>
        </div>
      </LoadingOverlay>
    </Layout>
  );
}
