type CheckLabelProps = {
  checked: boolean;
  onChange: () => void
  title: string
}

/** Checkbox with label that styled as radio button */
export default function CheckLabel({checked, onChange, title}: CheckLabelProps){
  return(
    <label className="flex mb-2 md:mb-0 text-xs sm:text-sm md:text-base items-center justify-center w-fit cursor-pointer md:space-x-1">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="hidden"
      />
      <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-gray-600 flex items-center justify-center ${checked ? "bg-blue-500" : "bg-white"}`}>
        {checked && <div className="w-2 h-2 bg-white rounded-full"></div>}
      </div>
      <span>{title}</span>
    </label>
  )
}