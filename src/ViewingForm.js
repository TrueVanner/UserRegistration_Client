/* eslint-disable eqeqeq */
import { Button, Grid, Paper, Stack, TextField } from "@mui/material"
import UserCard from "./UserCard"
import { useState } from 'react';
import { LoadingButton } from "@mui/lab";
import { styled } from '@mui/material/styles';
import '@fontsource/roboto/500.css'

function ViewingForm() {
	const [loading, setLoading] = useState(false)
	const [firstFetch, setFirstFetch] = useState(false)
	const [error, setError] = useState(false);
	
	const [count, setCount] = useState(5)
	const [offset, setOffset] = useState(0)

	const [users, setUsers] = useState([-1])
	const [links, setLinks] = useState({prev_url: null, next_url: null})

	const ErrorText = styled('div')(({ theme }) => ({
		...theme.typography.button,
		fontSize: "20px",
		color: "red",
	}));

	const fetchUsersFirst = async () => {
		setError(false)
		setLoading(true)

		const url = new URL("http://localhost:8081/api/v1/users")

		url.searchParams.append("count", count)

		if(offset == 0) 
			url.searchParams.append("page", 1);
		else 
			url.searchParams.append("offset", offset)

		const data = await fetch(url, {
			mode: "cors",
		}).then(res => res.json())

		if (!data.success)
			setError(true)
		else {
			setUsers(data.users)
			setLinks(data.links)
			setFirstFetch(true)
		}

		setLoading(false)
	}

	const fetchUsers = async (url) => {
		setLoading(true)

		const data = await fetch(url, {
			mode: "cors",
		}).then(res => res.json())
		
		setUsers(data.users)
		setLinks(data.links)
		setLoading(false)
	}

	return !firstFetch ? (
		<Paper elevation={2} sx={{p: 5, m: 5, mt: 5}}>
			<Stack
				direction="column"
				justifyContent="center"
				alignItems="center"
				spacing={2}>

				<TextField
					label="Count"
					variant="outlined"
					value={count}
					onChange={event => setCount(event.target.value)}/>

				<TextField
					label="Offset (not required!)"
					variant="outlined"
					value={offset}
					onChange={event => setOffset(event.target.value)}/>

				<LoadingButton
					variant="outlined"
					loadingIndicator="Loading…"
					loading={loading}
					color={error ? "error" : "primary"}
					onClick={fetchUsersFirst}>
						Get users
				</LoadingButton>

				<ErrorText>{error ? "No users found!" : ""}</ErrorText>
			</Stack>
		</Paper>

		) : (

		<div>
			<Grid sx={{flexGrow: 1}} container spacing={2}>
				{users.map(elem => {
						return <Grid item key={elem.id}><UserCard user={elem}></UserCard></Grid>
					})
				}
			</Grid>

			<Stack
				direction="column"
				justifyContent="center"
				alignItems="flex-start"
				spacing={2}>
					
					<Stack
						direction="row"
						justifyContent="flex-start"
						alignItems="center"
						spacing={2}
						mt={6}>
							<LoadingButton
								variant="outlined"
								sx={{width:	"20ch"}}
								loadingIndicator="Loading…"
								loading={loading}
								disabled={!!!links.prev_url}
								onClick={() => fetchUsers(links.prev_url)}>
									Previous page
							</LoadingButton>
							
							<LoadingButton
								variant="outlined"
								sx={{width:	"20ch"}}
								loadingIndicator="Loading…"
								loading={loading}
								disabled={!!!links.next_url}
								onClick={() => fetchUsers(links.next_url)}>
									Next page
							</LoadingButton>
						</Stack>
				<Button
					variant="contained"
					sx={{width:	"42ch"}}
					onClick={() => setFirstFetch(false)}>
						Change search parameters
				</Button>
			</Stack>
		</div>
		)
}

export default ViewingForm