import React from "react";

type FormationKey = "4-3-3" | "4-4-2" | "4-2-3-1" | "3-5-2";

interface SelectFormationProps {
  onChange: (formation: FormationKey) => void;
  value: string;
}

const SelectFormation: React.FC<SelectFormationProps> = ({
  onChange,
  value,
}) => {
  return (
    <select
      value={value}
      className="
      ml-20
      mt-4
      cursor-pointer
      border 
    border-gray-400
      relative
       z-20
       rounded-lg

    bg-white
    py-2 
    shadow-md
    focus:outline-none
    focus:ring-2 focus:ring-green-400 focus:border-green-400
    transition-all
    duration-300
    hover:shadow-lg

      "
      onChange={(e) => onChange(e.target.value as FormationKey)}
    >
      <option value="4-3-3">4-3-3</option>
      <option value="4-4-2">4-4-2</option>
      <option value="4-2-3-1">4-2-3-1</option>
      <option value="3-5-2">3-5-2</option>
    </select>
  );
};

{
  /* <select
  value={value}
  onChange={(e) => onChange(e.target.value as FormationKey)}
  className="
    ms-16 mt-4
    cursor-pointer
    border border-gray-300
    rounded-lg
    bg-white
    py-2 px-4
    pr-10
    shadow-md
    focus:outline-none
    focus:ring-2 focus:ring-green-400 focus:border-green-400
    transition-all
    duration-300
    hover:shadow-lg
    relative
  "
>
  <option value="4-3-3">4-3-3</option>
  <option value="4-4-2">4-4-2</option>
  <option value="4-2-3-1">4-2-3-1</option>
  <option value="3-5-2">3-5-2</option>
</select> */
}

export default SelectFormation;
