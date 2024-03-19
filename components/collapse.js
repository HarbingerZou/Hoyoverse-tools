import { useState } from 'react';

export default function CustomCollapse({alwaysDisplay, optionalDisplay}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    console.log("clicked");
    setIsOpen(!isOpen); // Toggle the state
  };

  return (
    <>
       <div className="collapse collapse-arrow border border-base-300 bg-primary" open={isOpen}>
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
