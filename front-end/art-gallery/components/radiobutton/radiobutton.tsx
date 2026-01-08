import { useState } from 'react';
import './radiobutton.css';

interface Item {
    title: string;
    //icon?: JSX.Element;
    action?: () => void;
}

type Props = {
  items: Item[];
  onSelect: (value: string) => void;
};

function radiobutton (
  { onSelect, items }: Props
) {
  const [selected, setSelected] = useState<string>("");

  const handleClick = (value: string) => {
    onSelect(value);
    setSelected(value);
  };

  return (
    <ul className='radiobutton-ul'>
      {items.map((item, index) => (
        <li key={index} onClick={() => handleClick(item.title)} className={selected === item.title ? "active" : "radiobutton-ul-li"}>{item.title}</li>
        
      ))}
    </ul>
  );
}

export default radiobutton;