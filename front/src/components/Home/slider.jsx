import { useEffect, useRef, useState } from "react";
import SlideApi from "../API/Slides";

  function Slider() {

    const [json,setjson]=useState(SlideApi)

    const [sw,setsw]=useState(0)
    const[sn,setsn]=useState(SlideApi.length-1)



    const swipe=()=>{
      if(sw<sn*100)
      setsw(sw+100)
      else{
      setsw(0)
      }
    }

   
    const back=()=>{
      
      if(sw!=0)
      setsw(sw-100)
    }


    useEffect(() => {
      const interval = setInterval(() => {
        swipe();
      }, 3000); // Slide every 2 seconds
  
      return () => clearInterval(interval); // Clear the interval on component unmount
    }, [sw, sn]);
  

  return (
    <>
      <section >
        <div className="m-auto my-16  overflow-hidden rounded-2xl w-[90%] h-[calc(100vh-20rem)]">
          <div  style={{ transform: `translateX(-${sw}vw)` }} className={`h-full transition-transform w-max flex  `}>
            {json.map((val)=>{
              return(
                <img className=" w-[100vw] h-full" key={val.id} src={val.imgPath} />
              )
            })}
           
          </div>
        </div>
        <button onClick={swipe}>swipe</button>
        <button onClick={back}>back</button>
      </section>
    </>
  );
}

export default  Slider;
