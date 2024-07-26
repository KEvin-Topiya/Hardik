import {Link,NavLink} from 'react-router-dom'
import { BiSolidUser,BiSolidShoppingBag } from "react-icons/bi";
import { IconContext } from "react-icons";
import { useState } from 'react';
export default function Header(){

    const [OrderPrice,setOrderPrice]=useState("0.00$")
 
    return(
        <>
        <nav className='sticky z-10 top-0 pl-10 pr-10 flex justify-between h-32 items-center bg-white border-b border-b-gray-300'>
            <ul className='w-fit flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0'>
                <li>
                   <NavLink
                   to={"/"}
                   className={({isActive})=>`hover:text-c1 text-xl font-flight font-black ${isActive ?`text-c1`: `text-black`}`}
                   >    
                    HOME
                   </NavLink>   
                </li>
                <li>
                   <NavLink
                   to={"/shop"}
                   className={({isActive})=>`hover:text-c1 text-xl font-flight font-black ${isActive ?`text-c1`: `text-black`}`}
                   >    
                    SHOP
                   </NavLink>   
                </li>
                <li>
                   <NavLink
                   to={"/about"}
                   className={({isActive})=>`hover:text-c1 text-xl font-flight font-black ${isActive ?`text-c1`: `text-black`}`}
                   >    
                    ABOUT
                   </NavLink>   
                </li>
                <li>
                   <NavLink
                   to={"/contact"}
                   className={({isActive})=>`hover:text-c1 text-xl font-flight font-black ${isActive ?`text-c1`: `text-black`}`}
                   >    
                    CONTACT
                   </NavLink>   
                </li>
            </ul>

            <Link to={"/"}>
            <img className='h-36 mr-44' src="/raghunandanLogo.png"/>
            </Link>

            <ul className='flex gap-6'>
                <li>
                    <IconContext.Provider value={{ size: "2rem", color:"grey" }}>
                        <BiSolidUser />
                    </IconContext.Provider>
                </li>
                <li>
                    <NavLink to={"/cart"} className={()=>`flex justify-around w-24`}>
                    {OrderPrice}
                    <IconContext.Provider value={{size:"1.5rem",color:"var(--c1)"}}>
                    <BiSolidShoppingBag />
                    </IconContext.Provider>
                    </NavLink>
                </li>
                <li>

                </li>
            </ul>
        </nav>
        </>
    )
}