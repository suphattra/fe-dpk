import { Fragment, useState, useRef, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { EmployeeService } from "../../pages/api/employee.service";
import InputSelectGroup from "../InputSelectGroup";
import { _resObjConfig, renderOptions } from "../../helpers/utils";
import { MasterService } from "../../pages/api/master.service";
import InputGroup from "../InputGroup";
import InputGroupDate from "../InputGroupDate";
import moment from "moment";
import { NotifyService } from "../../pages/api/notify.service";
export default function ModalUpdateEmployee(props) {
  const { open, setOpen, mode, employeeCode, jobEntry, timesheet } = props;
  const [employeeDetail, setEmployeeDetail] = useState({});
  const [querySuccess, setQuerySuccess] = useState(false);
  const [titleOption, setTitleOption] = useState([]);
  const [genderOption, setGenderOption] = useState([])
  const [nationalityOption, setNationalityOption] = useState([])
  const [typeOption, setTypeOption] = useState([])
  const [roleOption, setRoleOption] = useState([])
  useEffect(() => {
    async function fetchData() {
      await getConfigList("TITLE");
      await getConfigList('GENDER');
      await getConfigList('NATIONALITY');
      await getConfigList('TYPE', 'EMPLOYEE')
      await getConfigList('ROLE', 'EMPLOYEE')
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
  const getConfigList = async (code, type) => {
    let param = {
      subType: code,
      type: type
    };
    await MasterService.getConfig(param)
      .then((res) => {
        if (res.data.resultCode === 200) {
          if (code === "TITLE") setTitleOption(res.data.resultData);
          if (code === "GENDER") setGenderOption(res.data.resultData);
          if (code === "NATIONALITY") setNationalityOption(res.data.resultData);
          if (code === "TYPE") setTypeOption(res.data.resultData);
          if (code === "ROLE") setRoleOption(res.data.resultData);
        } else {
          if (code === "TITLE") setTitleOption([]);
          if (code === "GENDER") setGenderOption([]);
          if (code === "NATIONALITY") setNationalityOption([]);
          if (code === "TYPE") setTypeOption([]);
          if (code === "ROLE") setRoleOption([]);
        }
      })
      .catch((err) => { });
  };
  const handleSave = async () => {
    console.log(employeeDetail)
    await EmployeeService.updateEmployee(employeeCode, employeeDetail).then(res => {
      if (res.data.resultCode === 200) {
        NotifyService.success('แก้ไขข้อมูลเรียบร้อยเเล้ว')
        window.location.reload()
        setOpen(false)
      } else {
        NotifyService.error(res.data.resultDescription)
      }
    })
  };
  const onChange = (e, name) => {
    let obj = {}
    if (name === 'title' || name === 'gender' || name === 'nationality' || name === 'employeeType' || name === 'employeeRole') {
      let _option = []
      switch (name) {
        case "title":
          _option = titleOption
          break;
        case "gender":
          _option = genderOption
          break;
        case "nationality":
          _option = nationalityOption
          break;
        case "employeeType":
          _option = typeOption
          break;
        case "employeeRole":
          _option = roleOption
          break;
        default:
      }
      obj = _resObjConfig(e.target.value, _option)
      setEmployeeDetail(data => ({ ...data, [name]: obj }));
    } else {
      setEmployeeDetail(data => ({ ...data, [name]: e.target.value }));

    }
  }
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-2 pb-2 text-left shadow-xl transition-all w-5/6 h-3/6 md:h-auto p-6">
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
                            onChange={(e) => onChange(e, "title")}
                            options={renderOptions(
                              titleOption,
                              "value1",
                              "code"
                            )}
                            isSearchable
                            value={employeeDetail?.title.code}
                            required
                          />
                          <InputGroup type="text" label="ชื่อจริง"
                            id="firstName"
                            name="firstName"
                            onChange={(e) => onChange(e, "firstName")}
                            value={employeeDetail.firstName}
                            required
                          />
                          <InputGroup type="text" label="นามสกุล"
                            id="lastName"
                            name="lastName"
                            onChange={(e) => onChange(e, "firstName")}
                            value={employeeDetail.lastName}
                            required
                          />
                          <InputGroup type="text" label="ชื่อเล่น"
                            id="nickName"
                            name="nickName"
                            onChange={(e) => onChange(e, "firstName")}
                            value={employeeDetail.nickName}
                            required
                          />
                          <InputSelectGroup
                            type="text"
                            label="เพศ"
                            id={"gender"}
                            name="gender"
                            onChange={(e) => onChange(e, "gender")}
                            options={renderOptions(
                              genderOption,
                              "value1",
                              "code"
                            )}
                            isSearchable
                            value={employeeDetail?.gender.code}
                            required
                          />
                          <InputGroupDate
                            type="date" label="วันเกิด"
                            format="YYYY-MM-DD"
                            id={"birthDate"}
                            name="birthDate"
                            onChange={(e) => onChange(e, "birthDate")}
                            value={employeeDetail.birthDate ? moment(new Date(employeeDetail.birthDate)).format('YYYY-MM-DD') : ""}
                          />
                          <InputSelectGroup
                            type="text"
                            label="สัญชาติ"
                            id={"nationality"}
                            name="nationality"
                            onChange={(e) => onChange(e, "nationality")}
                            options={renderOptions(
                              nationalityOption,
                              "value1",
                              "code"
                            )}
                            isSearchable
                            value={employeeDetail?.nationality.code}
                            required
                          />
                          <InputGroup type="text" label="เบอร์โทรติดต่อ 1"
                            id="phoneContact1"
                            name="phoneContact1"
                            onChange={(e) => onChange(e, "phoneContact1")}
                            value={employeeDetail.phoneContact1}
                            required
                          />
                          <InputGroup type="text" label="เบอร์โทรติดต่อ 2"
                            id="phoneContact2"
                            name="phoneContact2"
                            onChange={(e) => onChange(e, "phoneContact2")}
                            value={employeeDetail.phoneContact2}
                            required
                          />

                        </div>
                        <hr className="mt-5 mb-2"></hr>
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 mr-6">
                          <InputSelectGroup type="text" label="ประเภทพนักงาน"
                            id="employeeType"
                            name="employeeType"
                            options={renderOptions(
                              typeOption,
                              "value1",
                              "code"
                            )}
                            onChange={(e) => onChange(e, 'employeeType')}
                            value={employeeDetail.employeeType.code}
                            isSearchable
                            required />
                          <InputSelectGroup type="text" label="ตำแหน่งงาน"
                            id="employeeRole"
                            name="employeeRole"
                            options={renderOptions(
                              roleOption,
                              "value1",
                              "code"
                            )}
                            onChange={(e) => onChange(e, 'employeeRole')}
                            value={employeeDetail.employeeRole.code}
                            isSearchable
                            required />
                          <div className="block w-full">
                            <label htmlFor={"remark"} className="block text-sm font-medium text-gray-700">
                              {"หมายเหตุ:"}
                            </label>
                            <textarea
                              onChange={(e) => onChange(e, "remark")}
                              value={employeeDetail.remark}
                              id="remark" name="หมายเหตุ"
                              rows={2}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:text-gray-800 disabled:bg-gray-50"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4  mr-6">
                          <InputGroupDate
                            type="date" name="startDate" label="วันเริ่มงาน"
                            format="YYYY-MM-DD"
                            id={"startDate"}
                            onChange={(e) => onChange(e, "startDate")}
                            value={employeeDetail.startDate ? moment(new Date(employeeDetail.startDate)).format('YYYY-MM-DD') : ""}
                            required />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4  mr-6 my-4">
                          <InputGroupDate
                            type="date" label="วันสิ้นสุด"
                            format="YYYY-MM-DD"
                            id={"endDate"}
                            onChange={(e) => onChange(e, "endDate")}
                            value={employeeDetail.endDate ? moment(new Date(employeeDetail.endDate)).format('YYYY-MM-DD') : ""}
                            required />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <footer className="flex items-center justify-center sm:px-2 lg:px-2 sm:py-2 lg:py-2">
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
