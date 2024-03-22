import { useState,useEffect,cloneElement, ReactElement } from "react";
export default function CountDownButtonWrapper({children, countDownSecond}:{children:ReactElement, countDownSecond:number}){
    const [countDown, setCountDown] = useState(countDownSecond);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        let interval: any;

        if (countDown > 0) {
            interval = setInterval(() => {
                setCountDown((prevValue) => prevValue - 1);
            }, 1000);
        } else if (!isActive) {
            setIsActive(true); // Re-activate the button once the countdown reaches 0
        }

        return () => clearInterval(interval);
    }, [countDown, isActive]);


    const handleClick = (originalOnClick: (e:any)=>Promise<boolean>) => async (e:any) => {
        if (isActive && originalOnClick) {
            //This indicates if the function short terminate in client side
            const serverRequest = await originalOnClick(e);
            if (serverRequest) {
                setIsActive(false);
                setCountDown(countDownSecond);
            }
        }
    };

    return cloneElement(children, {
        onClick: handleClick(children.props.onClick),
        disabled: !isActive,
        children: isActive ? children.props.children : <button>{countDown}s</button>,
    });
}