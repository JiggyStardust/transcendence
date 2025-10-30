

type InputProps = {
  id: string;
  label: string;
  type?: string;
};

export default function Input({id, label, type = "text"}: InputProps) {

	return (
		<div className="flex flex-col m-2 px-4">
			<label className="flex justify-left">
				{label}
			</label>
			<input className="p-1 border border-white rounded-sm"
				type={type} id={id}/>
		</div>
	)
}