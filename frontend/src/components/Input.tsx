
type InputProps = {
  id: string;
  label: string;
  type?: string;
  value?: string;
	tooltip?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>; // after we leave current field, this prop is activated
};

export default function Input({id, label, type = "text", value, tooltip, onChange, onBlur,}: InputProps) {

	return (
		<div className="flex flex-col m-2 px-4  text-black dark:text-white">
			<div className="relative group">
				<label className="flex justify-left">
					{label}
				</label>
				<div className="absolute bottom-full w-max px-2 py-1 text-sm bg-gray-700 rounded shadow-lg opacity-0 group-hover:opacity-100">
          {tooltip}
				</div>
			</div>
			<input className="p-1 border border-white rounded-sm" type={type} id={id} value={value} onChange={onChange} onBlur={onBlur}/>
		</div>
	)
}