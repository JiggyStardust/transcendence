
type InputProps = {
  id: string;
  label: string;
  type?: string;
  value?: string;
	tooltip?: string;
	autofocus?: boolean;
	focusTooltip?: React.ReactNode;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>; // after we leave current field, this prop is activated
};

export default function Input({id, label, type = "text", value, tooltip, focusTooltip, autofocus=false, onChange, onBlur,}: InputProps) {

	return (
		<div className="flex flex-col text-black dark:text-white">
			<div className="relative group">
				<label className="flex justify-left">
					{label}
				</label>
				{tooltip && (
					<div className="absolute bottom-full w-max px-2 py-1 text-sm bg-vintage-yellow/30 dark:bg-stone-600 rounded shadow-lg opacity-0 group-hover:opacity-100">
						{tooltip}
					</div>
				)}
			</div>
			<div>
				<input className="flex justify-left p-1 border border-white rounded-sm"
					type={type}
					id={id}
					value={value}
					onChange={onChange}
					autoFocus={autofocus}
					onBlur={onBlur}/>
				{/* tooltip on focus and positioned to the right (used by SignUp's password requirements) */}
				{focusTooltip && (
					<div className="absolute top-1/2 left-full ml-4 transform -translate-y-1/2 px-3 py-2 w-64 text-sm bg-gray-800 text-white rounded-md shadow-lg border border-gray-600 hidden group-focus-within:block">
						{focusTooltip}
					</div>
				)}
			</div>
		</div>
	);
}