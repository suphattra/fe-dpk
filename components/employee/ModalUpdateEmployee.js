import { Fragment, useState, useRef, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { EmployeeService } from "../../pages/api/employee.service";
import { _resObjConfig, renderOptions } from "../../helpers/utils";
import { NotifyService } from "../../pages/api/notify.service";
import CardEmployee from "./CardEmployee";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { authService } from "../../pages/api/auth/auth-service";

export default function ModalUpdateEmployee(props) {
  const {
    open,
    setOpen,
    mode,
    employeeCode,
    callbackLoad,
  } = props;
  const [employeeDetail, setEmployeeDetail] = useState({});
  const [querySuccess, setQuerySuccess] = useState(false);
  const [userLogin, setUserLogin] = useState("")
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

  useEffect(() => {
    setUserLogin(authService.getUserId())
    async function fetchData() {
      await getEmployeeDetail(employeeCode);
    }
    fetchData();
  }, []);
  const getEmployeeDetail = async (employeeCode) => {
    await EmployeeService.getEmployeeDetail(employeeCode)
      .then((res) => {
        if (res.data.resultCode === 200) {
          console.log(res.data.resultData);
          setEmployeeDetail(res.data.resultData[0]);
          setQuerySuccess(true);
        } else {
          setEmployeeDetail({});
          setQuerySuccess(false);
        }
      })
      .catch((err) => {
        console.log("==> list job3");
      });
  };
  const handleSave = async () => {
    console.log(employeeDetail);
    employeeDetail.updatedBy = userLogin
    await EmployeeService.updateEmployee(employeeCode, employeeDetail).then(
      (res) => {
        if (res.data.resultCode === 200) {
          NotifyService.success("แก้ไขข้อมูลเรียบร้อยเเล้ว");
          setOpen(false);
          callbackLoad();
        } else {
          NotifyService.error(res.data.resultDescription);
        }
      }
    );
  };
  const onChange = (e, index) => {
    const { name, value, checked, type } = e.target;
    console.log(name, value, checked, type);
    setEmployeeDetail((data) => ({ ...data, [name]: value }));
  };
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>
                <div className="fixed inset-0 z-10 overflow-y-auto p-14">
                <div className="flex max-h-fit min-h-max h-full items-endjustify-center p-4 text-center sm:items-center sm:p-0 ">
                    <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
              <Dialog.Panel className="h-full relative transform  rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full">
              <div className="h-5/6 overflow-y-auto shadow-inner border rounded-md">
                {querySuccess && (
                    
                  <CardEmployee
                    index={1}
                    employee={employeeDetail}
                    onChange={onChange}
                    mode={mode}
                    onErrors={errors}
                  />
                )}
              </div>
              <footer className="flex items-center justify-center">
                <div className="flex justify-center items-center overflow-y-auto my-10">
                  <div className="flex justify-center items-center">
                    <button
                      type="button"
                      className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-gray-600 px-6 py-1 pb-1.5 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-2"
                      onClick={() => {
                        setOpen(false);
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
               
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
