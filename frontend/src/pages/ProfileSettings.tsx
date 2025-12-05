import { Button } from "../components/Button";
import { FiUser } from "react-icons/fi";
import Input from "../components/Input";
import { PROXY_URL } from "../constants";
import { useState } from "react";

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

const ProfileInfo = () => {
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

interface User {
  displayName: string;
  twoFactorEnabled: boolean;
}

interface SettingsProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

const Settings = ({ user, setUser }: SettingsProps) => {

	function updateName(e) {
    setUser(u => ({ ...u, displayName: e.target.value }));
  }

  function update2FA(e) {
    setUser(u => ({ ...u, twoFactorEnabled: e.target.checked }));
  }

	return (
		<div className="flex flex-col">
			<Input
				id="name"
				label="Display name"
				value={user.displayName}
				tooltip="Name that is shown to other players"
				onChange={(e) => updateName(e)}/>
		  <div className="flex m-2 px-4 gap-3 items-center">
		    <label >Two factor authentication</label>
		    <input
					type="checkbox"
					id="twoFactorAuth"
					checked={user.twoFactorEnabled}
					onChange={(e) => update2FA(e)}/>
		  </div>
		</div>
	)
}

interface QrModalProps {
	qr: string | null;
	token: string;
	setToken: React.Dispatch<React.SetStateAction<string>>;
	onClose: () => void;
	onVerify: () => void;
}

const QrModal = ({ qr, token, setToken, onClose, onVerify }: QrModalProps) => {
	return (
		<div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/50 z-50">
			<div className="bg-light-bg dark:bg-dark-bg p-8 rounded-xl shadow-xl max-w-sm w-full text-center">
				<h2 className="text-md font-semibold mb-4">Scan the QR Code to activate two factor athentication</h2>
				{qr && (
					<>
						<img src={qr} alt="2FA QR" className="w-48 h-48 mx-auto mb-6"/>
						<Input
							id="2faCode"
							label="Code from app"
							value={token}
							tooltip="Write the code you see in the app after scanning the qr code"
							autofocus={true}
							onChange={(e) => setToken(e.target.value)}/>
					</>
				)}
				<div className="flex justify-around">
					<Button variant="secondary" onClick={onClose}>
						Close
					</Button>
					<Button variant="primary" onClick={onVerify}>
						Verify
					</Button>
				</div>
			</div>
		</div>
	)
}

const ProfileSettings = ({}) => {
	const [user, setUser] = useState({		//get actual data
    displayName: "name",
    twoFactorEnabled: false,
  });
	const [qr, setQr] = useState<string | null>(null);
	const [token, setToken] = useState("");
	const [modalOpen, setModalOpen] = useState(false);

	const verify2FA = async () => {
	  const res = await fetch(PROXY_URL + "/verify-setup-2fa", {
	    method: "POST",
	    credentials: "include",
	    headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ token })
  	});
		const data = await res.json();
	  if (data.success) {
			setModalOpen(false);
			//TODO some success message?
		}
		else {
			console.log("Wrong code");
		}
	};

	async function start2FA() {
    const res = await fetch(PROXY_URL + "/enable-2fa", {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    setQr(data.qr);
    setModalOpen(true);
  }
	
	function saveSettings(e) {
		e.preventDefault();
		if (user.twoFactorEnabled != false) {			//change to actual value
			start2FA();
		}
	}

	return (
		<div className="flex justify-center pt-10">
			<div className="flex flex-col gap-16 w-3/5 min-w-xl max-w-6xl">
				<ProfileInfo />
				<form onSubmit={saveSettings}>
					<Settings user={user} setUser={setUser} />
					<div className="flex justify-end">
						<Button>Save</Button>
					</div>
				</form>
			</div>
			{modalOpen && (
				<QrModal
					qr={qr}
					token={token}
					setToken={setToken}
					onClose={() => {setModalOpen(false); setUser(u => ({ ...u, twoFactorEnabled: !u.twoFactorEnabled}))}}			//is this correct?
					onVerify={verify2FA}
				/>
			)}
		</div>
	)
}

export default ProfileSettings;
