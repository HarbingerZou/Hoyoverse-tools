import { ReactComponentElement, ReactElement, useState } from 'react';

export default function CustomCollapse({alwaysDisplay, optionalDisplay}:{alwaysDisplay:ReactElement,optionalDisplay:ReactElement }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    //console.log("clicked");
    setIsOpen(!isOpen); // Toggle the state
  };

  return (
    <>
       <div className={`collapse collapse-arrow border border-base-300 bg-primary ${isOpen ? 'collapse-open' : ''}`}>
        <div className="collapse-title bg-primary" onClick={toggleCollapse}>
            {alwaysDisplay}
        </div>
        <div className="collapse-content bg-primary"> 
            {optionalDisplay}
        </div>
        </div>
    </>
  );
}
