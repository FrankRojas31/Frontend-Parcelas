import React from "react";

const Login = () => {
	return (
			<div style={backgroundStyle}>
				<form style={cardStyle}>
					<h2 style={{ marginBottom: 24, fontSize: "2rem" }}>Inicia Sesion</h2>
					<label style={{ alignSelf: "flex-start", marginLeft: 8 }}>Correo</label>
					<input type="email" placeholder="Correo" style={inputStyle} required />
					<label style={{ alignSelf: "flex-start", marginLeft: 8 }}>Contraseña</label>
					<input type="password" placeholder="Contraseña" style={inputStyle} required />
					<button type="submit" style={buttonStyle}>Acceder</button>
				</form>
			</div>
	);
};

export default Login;
const backgroundStyle: React.CSSProperties = {
	width: "100vw",
	height: "100vh",
	backgroundImage: 'url("/background.jpg")',
	backgroundSize: "cover",
	backgroundPosition: "center",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
};

const cardStyle: React.CSSProperties = {
		background: "rgba(255,255,255,0.8)",
		borderRadius: "40px",
		boxShadow: "0 2px 16px rgba(0,0,0,0.15)",
		padding: "40px 32px",
		minWidth: "500px",
		maxWidth: "600px",
		width: "100%",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
};

const inputStyle: React.CSSProperties = {
	width: "100%",
	padding: "10px 16px",
	margin: "10px 0",
	borderRadius: "20px",
	border: "1px solid #ccc",
	fontSize: "1rem",
	outline: "none",
};

const buttonStyle: React.CSSProperties = {
	width: "60%",
	padding: "12px 0",
	marginTop: "20px",
	borderRadius: "30px",
	border: "none",
	background: "#ffffffff",
	fontSize: "1.2rem",
	fontWeight: "bold",
	cursor: "pointer",
	boxShadow: "0 1px 6px rgba(0,0,0,0.10)",
};
