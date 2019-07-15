// Put here your email sending configurations!
module.exports = {
	emailTransport: {
		// host: 'yoursmtpserver',
		// port: 25,
		// auth: { user: '####', pass: '####' }
		service: 'Gmail',
		auth: {
			user: 'test@toping.io',
			pass: 'toping2116'
		}
	},
	emailOptions: {
		from: 'Mosaico by VOXmail <test@mosaico.io>', // sender address
		// bcc: 'mosaico@mosaico.io',
	}
};
