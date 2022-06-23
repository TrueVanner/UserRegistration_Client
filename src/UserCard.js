import {Typography, CardContent, Card, CardHeader, Avatar} from "@mui/material"

function UserCard(props) {
	return (
		<div>
		<Card sx={{ maxWidth: 345 }}>
      	<CardHeader
			avatar={
			<Avatar alt={props.user.name} src={"http://localhost:8081/"+props.user.image_name} sx={{width: 70, height: 70}}></Avatar>
			}
			title={props.user.name}
			subheader={"ID: " + props.user.id}
		/>
		<CardContent>
			<Typography variant="body2" color="text.secondary">
				Email: {props.user.email}
			</Typography>
			<Typography variant="body2" color="text.secondary">
				Phone: {props.user.phone}
			</Typography>
			<Typography variant="body2" color="text.secondary">
				Position: {props.user.position}
			</Typography>
		</CardContent>
		
		</Card>
		</div>
	)
}

export default UserCard