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


const ProfileSettings = ({}) => {

	const [name, setName] = useState("name");							//change to user.displayName or similar
	const [twoFactor, setTwoFactor] = useState(false);		//chenge to user.twoFactorEnabled or similar
	const [qr, setQr] = useState<string | null>(null);
	const [showQRModal, setShowQRModal] = useState(false);

	const Settings = ({}) => {
		return (
			<div className="flex flex-col">
				<Input id="name" label="Display name" value={name} tooltip="Name that is shown" onChange={(e) => setName(e.target.value)}/>
			  <div className="flex m-2 px-4 gap-3 items-center">
			    <label >Two factor authentication</label>
			    <input type="checkbox" id="twoFactorAuth" checked={twoFactor} onChange={(e) => setTwoFactor(e.target.checked)}/>
			  </div>
			</div>
		)
	}

	const QrModal = () => {
		const [token, setToken] = useState("");

		const verifySetup = async () => {
	    const res = await fetch(PROXY_URL + "/verify-setup-2fa", {
	      method: "POST",
	      credentials: "include",
	      headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ token })
	    });

	    const data = await res.json();
			console.log("Response: " + data);
	    if (data.success) {
				setShowQRModal(false);
			}
			else {
				console.log("Wrong code");
			}
	  };

		return (
			<div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/50 z-50">
				<div className="bg-light-bg dark:bg-dark-bg p-8 rounded-xl shadow-xl max-w-sm w-full text-center">
					<h2 className="text-md font-semibold mb-4">Scan the QR Code to activate two factor athentication</h2>
					{qr && (
						<>
							<img src={qr} alt="2FA QR" className="w-48 h-48 mx-auto mb-6"/>
							<Input id="2faCode" label="Code from app" tooltip="Write the code you see in the app after scanning the qr code" value={token} onChange={(e) => setToken(e.target.value)}/>
						</>
					)}
					<div className="flex justify-around">
						<Button variant="secondary" onClick={() => {setShowQRModal(false); setTwoFactor(!twoFactor);}}>
							Close
						</Button>
						<Button variant="primary" onClick={() => {verifySetup()}}>
							Verify
						</Button>
					</div>
				</div>
			</div>
		)
	}

	async function request2FASetup() {
	  const res = await fetch(PROXY_URL + "/enable-2fa", {
	    method: "POST",
	    credentials: "include",
	  });
	  return res.json();
	}

	const startSetup = async () => {
    const data = await request2FASetup();
    setQr(data.qr);
  };
	
	function saveSettings() {
		console.log("save settings button pressed");

		if (twoFactor != false) {			//change to actual value
			let showQr  = confirm("To enable two factor authentication you now need to scan a qr code with a second device. Do you want to proceed?");
			if (showQr) {
				startSetup();
				setShowQRModal(true);
			}
			else {
				setTwoFactor(!twoFactor);
			}
		}

	}

	return (
		<div className="flex justify-center pt-10">
			<div className="flex flex-col gap-16 w-3/5 min-w-xl max-w-6xl">
				<ProfileInfo />
				<form action={saveSettings}>
					<Settings />
					<div className="flex justify-end">
						<Button>Save</Button>
					</div>
				</form>
			</div>
			{showQRModal && <QrModal/>}
		</div>
	)
}

export default ProfileSettings;
