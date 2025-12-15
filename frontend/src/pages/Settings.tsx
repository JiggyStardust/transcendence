import { Button } from "../components/Button";
import Input from "../components/Input";
import { PROXY_URL } from "../constants";
import { useState, useEffect } from "react";
import { passwordRequirements } from "../constants/passwordRequirements";
import { FiX } from "react-icons/fi";
import { useAppToast } from "../context/ToastContext";
import { type Status } from "../types/types";
import { useUser } from "../context/UserContext";

interface User {
	username: string;
  displayName: string;
  twoFactorEnabled: boolean;
	avatarUrl: string | null;
	avatarUpdatedAt: number;
}

//TODO newly uploaded avatar does not show before reload of page

const ProfilePic = ({ avatarUrl, avatarUpdatedAt }: {avatarUrl: string | null, avatarUpdatedAt: number}) => {
	const imageUrl = avatarUrl !== null
	  ? `${avatarUrl}?t=${avatarUpdatedAt}` : PROXY_URL + "/uploads/avatars/default.jpeg";
	return (
		<img className="w-36 h-36 rounded-full object-cover"
			key={avatarUpdatedAt}
      src={imageUrl}
      alt="Avatar"
    />
	)
}

const ProfileInfo = ({ user }: { user: User }) => {
	return (
		<div className="flex gap-8">
			<ProfilePic avatarUrl={user.avatarUrl} avatarUpdatedAt={user.avatarUpdatedAt}/>
			<div className="flex flex-col gap-4 pt-4">
				<h1 className="font-bold text-3xl">{user.username}</h1>
				<p>Some text</p>
			</div>
		</div>
	)
}

interface SettingsProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

const MAX_FILE_SIZE_MB = 2;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/jpg"];

const ProfileSettings = ({ user, setUser }: SettingsProps) => {
	const [fileName, setFileName] = useState("");
	const [file, setFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)
	const [nameChanged, setNameChanged] = useState(false);
	const [displayNameStatus, setDisplayNameStatus] = useState<Status | null>(null);

	const { showToast } = useAppToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0] || null;
		if (selectedFile === null) {
			return;
		}
		const fileSizeMB = selectedFile.size / (1024 * 1024);
		if (fileSizeMB > MAX_FILE_SIZE_MB) {
			showToast("File size too big, must be under 2MB", "error");
	    return;
	  }
		if (!ACCEPTED_TYPES.includes(selectedFile.type)) {
			showToast("Wrong file type, accepted types: .png, .jpg, .jpeg", "error");
	    return;
	  }
		setFile(selectedFile);
    setFileName(selectedFile.name);
		const url = URL.createObjectURL(selectedFile);
  	setPreviewUrl(url);
  };

	const removeFile = () => {
		setFile(null);
    setFileName("");
		setPreviewUrl("");
	}

	function updateName(e: React.ChangeEvent<HTMLInputElement>) {
    setUser(u => ({ ...u, displayName: e.target.value }));
		setNameChanged(true);
		const len = e.target.value.length;
		if (e.target.value === "") {
			setDisplayNameStatus({type: "error", message: "Display name can not be empty"});
		} else if (len < 3 || len > 20) {
			setDisplayNameStatus({type: "error", message: "Display name must be between 3 and 20 characters"});
		} else {
			setDisplayNameStatus(null);
		}
  }

	async function saveDisplayName(displayName: string) {
    const res = await fetch(PROXY_URL + "/user", {
	    method: "PATCH",
	    credentials: "include",
	    headers: {
	      "Content-Type": "application/json",
	    },
	    body: JSON.stringify({ displayName }),
	  });
    const data = await res.json();
		console.log("Display name response: ", data);
		return (data);
  }

	async function saveAvatar(file: File) {
		const endpoint = `/users/${user.username}/avatar`;
		const formData = new FormData();
  	formData.append("avatar", file);
		const res = await fetch(PROXY_URL + endpoint, {
	    method: "POST",
	    credentials: "include",
	    body: formData,
	  });
		const data = await res.json();
		return (data);
	}

	async function saveSettings(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (nameChanged) {
			const displayNameResponse = await saveDisplayName(user.displayName);
			if (displayNameResponse.error) {
				//set state username not context username
				showToast("Error: " + displayNameResponse.error, "error")
				setDisplayNameStatus(null);
			} else {
				showToast("Success: display name updated successfully", "success");
				setUser({ ...user, displayName: displayNameResponse.displayName});
				setNameChanged(false);
			}
		}
		if (file != null) {
			const avatarResponse = await saveAvatar(file);
			if (avatarResponse.error) {
				setDisplayNameStatus(null);
				showToast("Error: " + avatarResponse.error, "error")
			}
			else {
				showToast("Success: avatar updated successfully", "success");
			  setUser(prev => ({
				  ...prev,
				  avatarUrl: "/api" + avatarResponse.avatarURL,
				  avatarUpdatedAt: Date.now(),
				}));
				console.log("Test: " + user.avatarUrl);
				setPreviewUrl("");
				setFileName("");
			}
		}
	}

	return (
		<div className="relative flex flex-col bg-stone-700/50 dark:bg-stone-500 rounded-3xl p-8">
			<h2 className="font-tomorrow font-bold text-xl text-stone-800 dark:text-vintage-yellow ">Public profile</h2>
			<form className="flex flex-col gap-2 m-4 mb-1" onSubmit={(e) => saveSettings(e)}>
				<Input
					id="name"
					label="Display name:"
					value={user.displayName}
					tooltip="Name that is shown to other players"
					status={displayNameStatus || undefined}
					onChange={(e) => updateName(e)}/>
				<p className="mt-4">Change avatar:</p>
				<div className="flex gap-6 items-center">
				  <label
				    htmlFor="avatar"
				    className="w-30 px-4 py-2 cursor-pointer font-tomorrow rounded-lg hover:bg-vintage-yellow/60 dark:bg-stone-600 bg-amber-50 dark:hover:bg-neutral-800">
				    Choose File
				  </label>
					<input
						type="file"
				    id="avatar"
				    accept="image/png, image/jpeg, image/jpg"
						className="hidden"
						onChange={handleFileChange} />
					{previewUrl && (
						 <div className="flex items-center gap-1">
							<img className="w-12 h-12 rounded-full object-cover"
								src={previewUrl} 
								alt="Avatar preview"
							/>
							<p>{fileName}</p>
							<button type="button" className="cursor-pointer m-2" onClick={() => removeFile()}>
									<FiX size="30"/>
							</button>
						</div>
					)}
				</div>
				<div className="absolute bottom-8 right-12">
					<Button
						disabled={previewUrl || (nameChanged && displayNameStatus?.type !== "error") ? false : true}>
						Save
					</Button>
				</div>
			</form>
		</div>
	)
}

const TwoFactorAuthSetting = ({ user, setUser }: SettingsProps) => {
	const [qr, setQr] = useState<string | null>(null);
	const [token, setToken] = useState("");
	const [qrModalOpen, setQrModalOpen] = useState(false);
	const { showToast } = useAppToast();

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
			setUser(u => ({ ...u, twoFactorEnabled: true }));
			console.log("Success: " + data);
			showToast("Success: Two factor authentication is now enabled.", "success");
		}
		else {
			console.log("Error: " + data.error);
			showToast("Error: " + data.error, "error");
		}
	};

	async function start2FA() {
    const res = await fetch(PROXY_URL + "/enable-2fa", {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
		if (data.error) {
			console.log("Error: " + data.error);
			showToast("Error: " + data.error, "error");
		}
    setQr(data.qr);
    setQrModalOpen(true);
  }

	const status = user.twoFactorEnabled ? "enabled" : "disabled";

	return (
		<div className="flex items-center gap-4">
			<p>Two factor authentication is <strong>{status}</strong></p>
			{status === "disabled" && (
				<Button onClick={start2FA}>Enable</Button>
			)}
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

	const { showToast } = useAppToast();

	async function updatePassword() {
		if (oldPassword && newPassword) {
			const res = await fetch(PROXY_URL + "/user/password", {
				method: "PATCH",
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
				showToast("Success: Password updated successfully!", "success");
			}
			else {
				setOldPassword("");
				setNewPassword("");
				showToast("Error: " + data.error, "error");
				console.log("Error: " + data.error);
			}
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
						onChange={(e) => setNewPassword(e.target.value)}
						focusTooltip={
						<div className="text-left">
							<p className="font-semibold mb-1">Password requirements:</p>
							<ul className="list-disc list-inside space-y-1">
								{passwordRequirements.map((req) => (
									<li key={req}>{req}</li>
								))}
							</ul>
						</div>
					}/>
				</div>
				<div className="flex gap-39">
					<Button variant="secondary" onClick={onClose}>
						Close
					</Button>
					<Button variant="primary" onClick={onSave}>
						Save
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
	const { loadMe } = useUser();
	const [user, setUser] = useState<User>({
		username: "",
		displayName: "",
		twoFactorEnabled: false, // this needs to be in user context
		avatarUrl: null,
		avatarUpdatedAt: Date.now(),
	});
	
	useEffect(() => {
		(async () => {
			const me = await loadMe();
			if (me) {
				setUser({
					username: me.username,
					displayName: me.displayName,
					twoFactorEnabled: false, // this needs to be in user context
					avatarUrl: me.avatarUrl,
					avatarUpdatedAt: Date.now(),
				})
			}
		})();
	}, [loadMe]);

	useEffect(() => {
	  console.log("Avatar URL:", user.avatarUrl);
	  console.log("Updated at:", user.avatarUpdatedAt);
	}, [user.avatarUrl, user.avatarUpdatedAt]);

	return (
		<div className="flex justify-center pt-6">
			<div className="flex flex-col gap-12 w-3/5 min-w-xl max-w-6xl">
				{user.username !== "" && (
					<>
						<ProfileInfo user={user} />
						<ProfileSettings user={user} setUser={setUser} />
						<AuthSettings user={user} setUser={setUser} />
					</>
				)}
				{user.username === "" && (
					<p>Loading page...</p>
				)}
			</div>
		</div>
	)
}

export default Settings;
