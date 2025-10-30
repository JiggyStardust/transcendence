

type InputProps = {
  id: string;
  label: string;
  type?: string;
};

export default function Input({id, label, type = "text"}: InputProps) {

	return (
		<div className="px-4">
			<label>
				{label}
				<input className="p-1 border border-black rounded-s"
					type={type} id={id}/>
			</label>
		</div>
	)
}