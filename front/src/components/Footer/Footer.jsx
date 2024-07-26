import { IconContext } from "react-icons";
import {
  BiLogoFacebookCircle,
  BiLogoInstagram,
  BiLogoTwitter,
  BiSolidPhone,
  BiLogoGmail
} from "react-icons/bi";
import { MdLocationPin } from "react-icons/md";
export default function Footer() {
  return (
    <>
      <footer className=" p-14 bg-zinc-700 flex flex-col justify-end items-center ">
        <div className="w-full flex justify-around ">
            <ul>
                <li className="text-xl text-white">
                    Company
                </li>
                <li className="text-lg text-gray-400 hover:text-white">
                    About us
                </li>
                <li className="text-lg text-gray-400 hover:text-white">
                    Team
                </li>
                <li className="text-lg text-gray-400 hover:text-white">
                    Contact us
                </li>
                <li className="text-lg text-gray-400 hover:text-white">
                    FAQ
                </li>
            </ul>
            <ul>
                <li className="text-xl text-white">
                    Product
                </li>
                <li className="text-lg text-gray-400 hover:text-white">
                    Category
                </li>
                <li className="text-lg text-gray-400 hover:text-white">
                    New Products
                </li>
                <li className="text-lg text-gray-400 hover:text-white">
                    Top-products
                </li>
                <li className="text-lg text-gray-400 hover:text-white">
                    Return-policy
                </li>
                <li className="text-lg text-gray-400 hover:text-white">
                    Custom Order
                </li>
                <li className="text-lg text-gray-400 hover:text-white">
                    Cart
                </li>
            </ul>
            <ul>
                <li className="text-xl text-white">
                    Product
                </li>
                <li className="text-lg text-gray-400 hover:text-white">
                    Category
                </li>
                <li className="text-lg text-gray-400 hover:text-white">
                    New Products
                </li>
                <li className="text-lg text-gray-400 hover:text-white">
                    Top-products
                </li>
                <li className="text-lg text-gray-400 hover:text-white">
                    Return-policy
                </li>
                <li className="text-lg text-gray-400 hover:text-white">
                    Custom Order
                </li>
                <li className="text-lg text-gray-400 hover:text-white">
                    Cart
                </li>
            </ul>
          <table>
          <tbody>
            <tr>

              <td>
                <IconContext.Provider
                  value={{ size: "2rem", color: "#e5e7eb" }}>
                  <MdLocationPin />
                </IconContext.Provider>
              </td>
              <td className="text-white text-x ">Rajkot</td>
            </tr>
            <tr>
              <td>
                <IconContext.Provider
                  value={{ size: "2rem", color: "#e5e7eb" }}>
                  <BiSolidPhone />
                </IconContext.Provider>
              </td>
            <td className="text-white ">
               <a href="tel:+919586652965">+91 9586652965</a> 
            </td>
            </tr>
            <tr>
                <td>
                <IconContext.Provider
                  value={{ size: "2rem", color: "#e5e7eb" }}>
                 <BiLogoGmail />
                </IconContext.Provider>  
                </td>
                <td className="text-white ">
                <a href="mailto:HARDIK1612006@GMAIL.COM">inforaghunandan@gmail.com</a>
            </td>
            </tr>
            </tbody>
          </table>
        </div>

        <div className="flex  mt-16 justify-around gap-10 items-end ">
        <p className="text-gray-400">Copyright © 2024 KAVYATA Enterprise</p>
          <IconContext.Provider value={{ size: "2rem", color: "#e5e7eb" }}>
            <a href="#">
              <BiLogoFacebookCircle />
            </a>
            <a href="#">
              <BiLogoInstagram />
            </a>
            <a href="#">
              <BiLogoTwitter />
            </a>
          </IconContext.Provider>
        </div>
      </footer>
    </>
  );
}
