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

const ProfileSettings = ({ user, setUser }: SettingsProps) => {

	function updateName(e: React.ChangeEvent<HTMLInputElement>) {
    setUser(u => ({ ...u, displayName: e.target.value }));
  }

	async function saveDisplayName(displayName: string) {
    const res = await fetch(PROXY_URL + "/updateDisplayName", {
	    method: "POST",
	    credentials: "include", // sends cookies/session
	    headers: {
	      "Content-Type": "application/json",
	    },
	    body: JSON.stringify({ displayName }),
	  });
    const data = await res.json();
		//what happens now
		return (data);
  }

	async function saveSettings(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const displayNameResult = await saveDisplayName(user.displayName);
	  if (displayNameResult.error) {
	    //something
	  } else {
	    //something
	  }
		//save avatar here also
	}

	return (
		<div className="relative flex flex-col bg-stone-500 rounded-3xl p-8">
			<h2 className="font-tomorrow font-bold text-xl text-stone-800">Public profile</h2>
			<form className="flex flex-col gap-2 m-4" onSubmit={(e) => saveSettings(e)}>
				<Input
					id="name"
					label="Display name"
					value={user.displayName}
					tooltip="Name that is shown to other players"
					onChange={(e) => updateName(e)}/>
				<p>Change avatar here</p>
				<div className="absolute bottom-8 right-12">
					<Button>Save</Button>
				</div>
			</form>
		</div>
	)
}

const TwoFactorAuthSetting = ({ user, setUser }: SettingsProps) => {
	const [qr, setQr] = useState<string | null>(null);
	const [token, setToken] = useState("");
	const [qrModalOpen, setQrModalOpen] = useState(false);

	const verify2FA = async () => {
	  const res = await fetch(PROXY_URL + "/verify-setup-2fa", {
	    method: "POST",
	    credentials: "include",
	    headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ token })
  	});
		const data = await res.json();
	  if (data.success) {
			setQrModalOpen(false);
			setUser(u => ({ ...u, twoFactorEnabled: true }))
			//TODO some success message?
		}
		else {
			console.log("Wrong code");	//TODO show error
		}
	};

	async function start2FA() {
    const res = await fetch(PROXY_URL + "/enable-2fa", {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    setQr(data.qr);
    setQrModalOpen(true);
  }

	const status = user.twoFactorEnabled ? "enabled" : "disabled";

	return (
		<div className="flex items-center gap-4">
			<p>Two factor authentication is <strong>{status}</strong></p>
			<Button onClick={start2FA}>{user.twoFactorEnabled ? "Disable" : "Enable"}</Button>
			{qrModalOpen && (
				<QrModal
					qr={qr}
					token={token}
					setToken={setToken}
					onClose={() => {setQrModalOpen(false)}}			//is this correct?
					onVerify={verify2FA}
				/>
			)}
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
			<div className="bg-light-bg dark:bg-dark-bg p-8 rounded-xl shadow-xl max-w-sm w-full text-center flex flex-col items-center gap-2">
				<h3 className="text-md font-semibold mb-4">Scan the QR Code to activate two factor athentication</h3>
				{qr && (
					<div className="mb-5">
						<img src={qr} alt="2FA QR" className="w-48 h-48 mb-2"/>
						<Input
							id="2faCode"
							label="Code from app"
							value={token}
							tooltip="Write the code you see in the app after scanning the qr code"
							autofocus={true}
							onChange={(e) => setToken(e.target.value)}/>
					</div>
				)}
				<div className="flex gap-39">
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

const ChangePassword = () => {
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [passwordModalOpen, setPasswordModalOpen] = useState(false);

	async function updatePassword() {
		const res = await fetch(PROXY_URL + "/updatePassword", {
      method: "POST",
      credentials: "include",
			headers: {
  			"Content-Type": "application/json",
			},
			body: JSON.stringify({
	      oldPassword,
	      newPassword,
	    }),
    });
    const data = await res.json();
		if (data.success) {
			setPasswordModalOpen(false);
			//TODO some success message?
		}
		else {
			setOldPassword("");
			setNewPassword("");
			//TODO show error
			console.log("Updating password failed");
		}
	}

	return (
		<div>
			<Button onClick={() => setPasswordModalOpen(true)}>Change password</Button>
			{passwordModalOpen && (
				<PasswordModal
					oldPassword={oldPassword}
					setOldPassword={setOldPassword}
					newPassword={newPassword}
					setNewPassword={setNewPassword}
					onClose={() => {setPasswordModalOpen(false)}}
					onSave={updatePassword} />
			)}
		</div>
	)
}

interface PasswordModalProps {
	oldPassword: string;
	setOldPassword: (oldPassword: string) => void;
	newPassword: string;
	setNewPassword: (newPassword: string) => void;
	onClose: () => void;
	onSave: () => void;
}

const PasswordModal = ({ oldPassword, setOldPassword, newPassword, setNewPassword, onClose, onSave }: PasswordModalProps) => {
	return (
		<div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/50 z-50">
			<div className="bg-light-bg dark:bg-dark-bg p-8 rounded-xl shadow-xl max-w-sm w-full text-center flex flex-col items-center gap-2">
				<h3 className="text-md font-semibold mb-4">Give your current password and the new password</h3>
				<div className="flex flex-col gap-4 mb-4">
					<Input
						id="oldPassword"
						label="Current password"
						type="password"
						value={oldPassword}
						tooltip="Your old password is needed to set new password"
						onChange={(e) => setOldPassword(e.target.value)}/>
					<Input 
						id="newPassword"
						label="New password"
						type="password"
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}/>
				</div>
				<div className="flex gap-39">
					<Button variant="secondary" onClick={onClose}>
						Close
					</Button>
					<Button variant="primary" onClick={onSave}>
						Verify
					</Button>
				</div>
			</div>
		</div>
	)
}

const AuthSettings = ({ user, setUser }: SettingsProps) => {
	return (
		<div className="flex flex-col gap-4 mb-20 pl-8">
			<h2 className="font-tomorrow text-xl font-bold"> Password and authentication</h2>
			<div className="flex flex-col gap-4 p-4">
				<TwoFactorAuthSetting user={user} setUser={setUser} />
				<ChangePassword />
			</div>
		</div>
	)
}

const Settings = ({}) => {
	const [user, setUser] = useState({		//get actual data
    displayName: "name",
    twoFactorEnabled: false,
  });

	return (
		<div className="flex justify-center pt-6">
			<div className="flex flex-col gap-12 w-3/5 min-w-xl max-w-6xl">
				<ProfileInfo />
				<ProfileSettings user={user} setUser={setUser} />
				<AuthSettings user={user} setUser={setUser} />
				
				{/* <form onSubmit={saveSettings}>
					<ProfileSettings user={user} setUser={setUser} />
					<div className="flex justify-end">
						<Button>Save</Button>
					</div>
				</form> */}
			</div>
		</div>
	)
}

export default Settings;
