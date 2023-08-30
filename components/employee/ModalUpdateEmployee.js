import { Fragment, useState, useRef, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { EmployeeService } from "../../pages/api/employee.service";
import InputSelectGroup from "../InputSelectGroup";
import { renderOptions } from "../../helpers/utils";
import { MasterService } from "../../pages/api/master.service";
export default function ModalUpdateEmployee(props) {
  const { open, setOpen, mode, employeeCode, jobEntry, timesheet } = props;
  const [employeeDetail, setEmployeeDetail] = useState({});
  const [querySuccess, setQuerySuccess] = useState(false);
  const [titleOption, setTitleOption] = useState([]);
  useEffect(() => {
    async function fetchData() {
      await getConfigList("TITLE");
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
  const getConfigList = async (code) => {
    let param = {
      subType: code,
    };
    await MasterService.getConfig(param)
      .then((res) => {
        if (res.data.resultCode === 200) {
          if (code === "TITLE") setTitleOption(res.data.resultData);
        } else {
          if (code === "TITLE") setTitleOption([]);
        }
      })
      .catch((err) => {});
  };
  const handleSave = async () => {};
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
        <div className="fixed inset-0 z-10 overflow-y-auto w-100">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 text-left shadow-xl transition-all w-5/6 h-3/6 md:h-auto p-6">
                {querySuccess && (
                  <div className="rounded-md p-4 shadow-md">
                    <div className="flex flex-1 items-stretch">
                      <div className="relative w-0 flex-1 mr-6 border-r">
                        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4 mr-6">
                          <InputSelectGroup
                            type="text"
                            label="คำนำหน้า"
                            id={"title"}
                            name="title"
                            // onChange={(e) => handleChange(e, index, "title")}
                            options={renderOptions(
                              titleOption,
                              "value1",
                              "code"
                            )}
                            isSearchable
                            value={employeeDetail?.title.code}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <footer className="flex items-center justify-center sm:px-6 lg:px-8 sm:py-4 lg:py-4">
                  <div className="flex justify-center items-center overflow-y-auto p-4">
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
