import { Button } from "../components/Button";
import { FiUser } from "react-icons/fi";
import Input from "../components/Input";

const ProfilePic = () => {

	return (
		<div className="rounded-full border-4 p-2 w-[120px] h-[120px] flex items-center justify-center overflow-hidden">
		  {/* {user?.image ? (
		    <img
		      src={user.image}
		      alt="Profile"
		      className="w-full h-full object-cover rounded-full"
		    />
		  ) : ( */}
		    <FiUser size={120} />
		  {/* )} */}
		</div>
	)
}

const ProfileInfo = ({}) => {

	return (
		<div className="flex gap-8">
			<ProfilePic />
			<div className="flex flex-col gap-4 pt-4">
				<h1 className="font-bold text-3xl">Username</h1>
				<p>Some text</p>
			</div>
		</div>
	)
}

const Settings = ({}) => {
	return (
		<div className="grid grid-cols-2">
			<Input id="name" label="Name on server"/>
			<Input id="language" label="Language preference" />
			<Input id="name" label="Name on server"/>
			<Input id="language" label="Language preference" />
		</div>
	)
}

const ProfileSettings = ({}) => {

	return (
		<div className="flex justify-center pt-10">
			<div className="flex flex-col gap-16 w-3/5 min-w-xl max-w-6xl">
				<ProfileInfo />
				<Settings />
				<div className="flex justify-end">
					<Button>Save</Button>
				</div>
			</div>
		</div>
	)
}

export default ProfileSettings;
