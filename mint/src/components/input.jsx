export function CheckboxWithLabel({ label, name, checked, onChange }) {
  return (
    <div>
      <label className="flex items-center text-sm font-medium leading-6 text-gray-900">
        <input type="radio" name={name} checked={checked} onChange={onChange} className="h-4 w-4 border-gray-300 text-bitwell-blue focus:ring-bitwell-blue mr-2" />
        {label}
      </label>
    </div>
  )
}
