import '../styles/globals.css'
import 'tailwindcss/tailwind.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function MyApp({ Component, pageProps }) {
  return <>
    <ToastContainer theme="colored" hideProgressBar={false}/>
    <Component {...pageProps} />
  </>
}

export default MyApp
