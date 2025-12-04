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

	async function request2FASetup() {
	  const res = await fetch(PROXY_URL + "/enable-2fa", {
	    method: "POST",
	    credentials: "include",
	  });
	  return res.json(); // { qr: "data:image/png;base64,...." }
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
			{showQRModal && (
				<div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/50 z-50">
					<div className="bg-white p-8 rounded-xl shadow-xl max-w-sm w-full text-center">
						<h2 className="text-xl font-semibold mb-4">Scan the QR Code to activate two factor athentication</h2>

						{qr && (
							<img 
								src={qr} 
								alt="2FA QR" 
								className="w-48 h-48 mx-auto mb-6"
							/>
						)}

						<Button variant="primary" onClick={() => setShowQRModal(false)}>
							Close
						</Button>
					</div>
				</div>
			)}
		</div>
	)
}

export default ProfileSettings;
