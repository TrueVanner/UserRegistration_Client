import { InputAdornment, MenuItem, Stack, TextField, Button, Paper, FormControl, Typography} from '@mui/material';
import { LoadingButton } from "@mui/lab"
import SendIcon from '@mui/icons-material/Send';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import '@fontsource/roboto/500.css';

const Input = styled('input')({
	display: 'none',
});

const SuccessText = styled('div')(({ theme }) => ({
	...theme.typography.button,
	fontSize: "20px",
	color: "green",
}));

function AddingForm(props) {
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
		name: {err: false, help: ""},
		email: {err: false, help: ""},
		phone: {err: false, help: ""},
		position: {err: false, help: ""},
		image_name: {err: false}
	})

	const [allPos, setAllPos] = useState([-1]);

	const changeUserData = (key, value) => {
		const obj = {name: userData.name, email: userData.email, phone: userData.phone}
		obj[key] = value;
		setUserData(obj)
	}

	const fetchPositions = async () => {
		if (allPos[0] === -1) {
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
		formData.append("phone", userData.phone.slice(0, 13))
		formData.append("position", pos)
		formData.append("image", image)

		const data = await fetch("http://localhost:8081/api/v1/users", {
			method: "POST",
			mode: "cors",
			body: formData
		}).then(res => res.json());

		if (!data.success) {
			const newErrors = {
				name: {err: false, help: ""},
				email: {err: false, help: ""},
				phone: {err: false, help: ""},
				position: {err: false, help: ""},
				image_name: {err: false}
			}
			data.fails.forEach(fail => {
				newErrors[fail.param] = {err: true, help: fail.msg}
			})
			setErrors(newErrors)
		} else 
		{
			setErrors({
				name: {err: false, help: ""},
				email: {err: false, help: ""},
				phone: {err: false, help: ""},
				position: {err: false, help: ""},
				image_name: {err: false}
			})
			setSuccess(true)
		}
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
						error={errors.name.err}
						helperText={errors.name.help}
						value={userData.name}
						color={success ? "success" : "primary"}
						focused={success}
						onChange={event => changeUserData("name", event.target.value)}/>
					<TextField
						required
						label="Email"
						sx={{ m: 1, width: '35ch' }}
						error={errors.email.err}
						helperText={errors.email.help}
						value={userData.email}
						color={success ? "success" : "primary"}
						focused={success}
						onChange={event => changeUserData("email", event.target.value)}/>
					<TextField
						required
						label="Phone number"
						sx={{ m: 1, width: '35ch' }}
						error={errors.phone.err}
						helperText={errors.phone.help}
						value={userData.phone.slice(4, 13)} // ограничивает максимальный размер номера и не показывает встроенные +380
						color={success ? "success" : "primary"}
						focused={success}
						onChange={event => changeUserData("phone", "+380"+event.target.value)} // сразу добавляет номер с +380
						InputProps={{
							startAdornment: <InputAdornment position="start">+380</InputAdornment>,
						}}/>

					<TextField
						required
						select
						label="Position"
						sx={{ m: 1, width: '35ch' }}
						error={errors.position.err}
						helperText={errors.position.help}
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
						})}
						</TextField>
						<label htmlFor="file">
						<Input
						id="file"
						accept="image/jpeg"
						type="file"
						onChange={event => setImage(event.target.files[0])}
						/>
						<Button
						color={errors.image_name.err ? "error" : success ? "success" : "primary"}
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