import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { authService } from "../pages/api/auth/auth-service";

export default function Layout({ children }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const islogin = authService.getToken();
    if (!islogin) {
      router.push('/login');
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true)
    }
  }, [isAuthenticated]);


  const sidebarOpenCallback = (e) => {
    setSidebarOpen(e)
  }
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  return (
    <>
      <Navbar></Navbar>
      <div className="flex relative">
        <Sidebar sidebarOpenCallback={sidebarOpenCallback} />
        <div className={classNames(sidebarOpen ? 'flex flex-col absolute z-[1] w-[calc(100vw-14rem)] left-56' : 'flex flex-col absolute  z-[1] w-[calc(100vw-6rem)] left-24', " h-[calc(100vh-4rem)]")}>
          {/* <div className={classNames(sidebarOpen ? 'flex flex-col fixed w-[calc(100vw-14rem)] left-56' : 'flex flex-col fixed w-[calc(100vw-6rem)] left-24', " h-[calc(100vh-4rem)]")}> */}
          {/* overflow-y-auto */}
          {children}
        </div>
      </div>
    </>
  );
}
