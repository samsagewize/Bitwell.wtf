export function SimpleButton({ label, disabled, onClick }) {
  return (
    <button type="button" className={`${disabled ? 'bg-gray-300' : 'bg-orange-600 hover:bg-orange-800'} rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bitwell-blue`}
            onClick={() => (!disabled && onClick())}>
      {label}
    </button>
  );
}
