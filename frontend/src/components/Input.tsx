import { FiCheck } from "react-icons/fi";
import { FiAlertOctagon } from "react-icons/fi";
import { FiXOctagon } from "react-icons/fi";

type InputProps = {
  id: string;
  label: string;
  type?: string;
  value?: string;
	tooltip?: string;
	autofocus?: boolean;
	focusTooltip?: React.ReactNode;
	status?: "ok" | "warning" | "error";
	statusMessage?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>; // after we leave current field, this prop is activated
};

export default function Input({id, label, type = "text", value, tooltip, focusTooltip, autofocus=false, status, statusMessage, onChange, onBlur,}: InputProps) {
	const statusIcons: Record<NonNullable<typeof status>, React.ReactNode> = {
	  ok:   <FiCheck size="20" color="green" />,
	  warning:<FiAlertOctagon size="20" color="orange"  />,
	  error:  <FiXOctagon size="20" color="red" />
	};
	return (
		<div className="flex flex-col gap-1 text-black dark:text-white">
			<div className="flex gap-4 items-center">
			  <div className="relative group/label">
			    <label>
			      {label}
			    </label>
			    {tooltip && (
			      <div className="absolute bottom-full left-0 w-max px-2 py-1 text-sm bg-vintage-yellow dark:bg-stone-600 rounded shadow-lg opacity-0 group-hover/label:opacity-100 transition">
			        {tooltip}
			      </div>
			    )}
			  </div>
			  {status && (
			    <div className="relative group/icon cursor-help">
			      {statusIcons[status]}
						{statusMessage && (
							<div className="absolute left-full top-1/2 ml-2 -translate-y-1/2 w-max px-2 py-1 text-sm bg-vintage-yellow dark:bg-stone-600 rounded shadow-lg opacity-0 group-hover/icon:opacity-100 transition">
								{statusMessage}
		      		</div>
						)}
			    </div>
			  )}
			</div>

			<div className="relative group">
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