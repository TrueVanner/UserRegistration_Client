import { InputAdornment, MenuItem, Stack, TextField, Button, Paper } from '@mui/material';
import { LoadingButton } from "@mui/lab"
import SendIcon from '@mui/icons-material/Send';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import '@fontsource/roboto/500.css';

const Input = styled('input')({
	display: 'none',
});

const SuccessText = styled('div')(({ theme }) => ({
	...theme.typography.button,
	fontSize: "20px",
	color: "green",
}));

function AddingForm() {
	const [pos, setPos] = useState("")
	const [image, setImage] = useState();
	const [sending, setSending] = useState(false)
	const [success, setSuccess] = useState(false)
	const [userData, setUserData] = useState({
		name: "",
		email: "",
		phone: "",
	});
 
	const [errors, setErrors] = useState({
		name: "",
		email: "",
		phone: "",
		position: "",
		image_name: ""
	})

	const [allPos, setAllPos] = useState([-1]);

	const changeUserData = (key, value) => {
		const obj = {name: userData.name, email: userData.email, phone: userData.phone}
		obj[key] = value;
		setUserData(obj)
	}

	const fetchPositions = async () => {
		if (allPos[0] === -1 || allPos.length === 0) {
			const names = [];

			const data = await fetch("http://localhost:8081/api/v1/positions", {
				mode: "cors"
			}).catch().then(res => res.json())
		
			data.positions.forEach(pos => {
				names.push(pos.name)
			})
		
			setAllPos(names)
		}
	}

	// useEffect(() => console.log(userData), [userData])

	const sendForm = async () => {
		setSuccess(false)
		setSending(true)

		const formData = new FormData();
		formData.append("name", userData.name)
		formData.append("email", userData.email)
		formData.append("phone", "+380" + userData.phone.slice(0, 9))
		formData.append("position", pos)
		formData.append("image", image)

		const data = await fetch("http://localhost:8081/api/v1/users", {
			method: "POST",
			mode: "cors",
			body: formData
		}).then(res => res.json());


		const newErrors = {
			name: "",
			email: "",
			phone: "",
			position: "",
			image_name: ""
		}
		if (!data.success) {
			data.fails.forEach(fail => {
				newErrors[fail.param] = fail.msg
			})
		} else setSuccess(true)

		setErrors(newErrors)
		setSending(false);
	}

	return (
		<div>
			<Paper elevation={2} sx={{p: 5, m: 5, mt: 5}}>
				<Stack
					direction="column"
					justifyContent="center"
					alignItems="center"
					spacing={2}>
					
					<TextField
						required
						label="Name"
						sx={{ m: 1, width: '35ch' }}
						error={!!errors.name}
						helperText={errors.name}
						value={userData.name}
						color={success ? "success" : "primary"}
						focused={success}
						onChange={event => changeUserData("name", event.target.value)}/>

					<TextField
						required
						label="Email"
						sx={{ m: 1, width: '35ch' }}
						error={!!errors.email}
						helperText={errors.email}
						value={userData.email}
						color={success ? "success" : "primary"}
						focused={success}
						onChange={event => changeUserData("email", event.target.value)}
						/>

					<TextField
						required
						label="Phone number"
						sx={{ m: 1, width: '35ch' }}
						error={!!errors.phone}
						helperText={errors.phone}
						value={userData.phone.slice(0, 9)} // ограничивает максимальный размер номера
						color={success ? "success" : "primary"}
						focused={success}
						onChange={event => changeUserData("phone", event.target.value)}
						InputProps={{
							startAdornment: <InputAdornment position="start">+380</InputAdornment>,
						}}/>

					<TextField
						required
						select
						label="Position"
						sx={{ m: 1, width: '35ch' }}
						error={!!errors.position}
						helperText={errors.position}
						value={pos}
						color={success ? "success" : "primary"}
						focused={success}
						onChange={event => setPos(event.target.value)}
						onMouseEnter={fetchPositions}>

						{allPos.map(option => {
								if (option === -1) return (<MenuItem key={"loading"} disabled={true}>Loading...</MenuItem>);
								return <MenuItem key={option} value={option}>
								{option}
								</MenuItem>
							})
						}
					</TextField>
					
					<label htmlFor="file">
						<Input
							id="file"
							accept="image/jpeg"
							type="file"
							onChange={event => setImage(event.target.files[0])}/>
							
						<Button
							color={!!errors.image_name ? "error" : success ? "success" : "primary"}
							variant={image ? "contained" : "outlined"}
							component="span">
								Upload image
						</Button>
					</label>

					<LoadingButton
						onClick={sendForm}
						endIcon={<SendIcon/>}
						loading={sending}
						color={success ? "success" : "primary"}
						variant="outlined"
						loadingPosition="end">
							Send
					</LoadingButton>

					<SuccessText>{success ? "user added successfully!" : ""}</SuccessText>
				</Stack>
			</Paper>
		</div>
	)
}

export default AddingForm;