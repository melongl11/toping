// Put here your email sending configurations!
module.exports = {
	emailTransport: {
		// host: 'yoursmtpserver',
		// port: 25,
		// auth: { user: '####', pass: '####' }
		service: 'Gmail',
		auth: {
			user: 'wlalsrb0928@gmail.com',
			pass: 'wlalsrb0928.'
		}
	},
	emailOptions: {
		from: 'Mosaico by VOXmail <test@mosaico.io>', // sender address
		// bcc: 'mosaico@mosaico.io',
	}
};
