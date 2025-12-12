// @ts-nocheck
type InputProps = {
  id: string;
  label: string;
  type?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>; // after we leave current field, this prop is activated
};

export default function Input({id, label, type = "text", value, onChange, onBlur,}: InputProps) {

	return (
		<div className="flex flex-col m-2 px-4  text-black dark:text-white">
			<label className="flex justify-left">
				{label}
			</label>
			<input className="p-1 border border-white rounded-sm"
				type={type} id={id} value={value} onChange={onChange} onBlur={onBlur}/>
		</div>
	)
}