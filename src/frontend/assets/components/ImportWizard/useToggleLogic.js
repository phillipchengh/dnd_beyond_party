import { useState } from 'react';

export function useToggleLogic() {
  const [show, setShow] = useState(false);

  const handleShow = () => {
    setShow(true);
  };

  return [show, handleShow];
}

export default useToggleLogic;
