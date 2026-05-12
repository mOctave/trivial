const { verifyToken } = require("./jwt");

function authorize(req, res, failHard) {
	const token = req.cookies.token;

	if (!token) {
		if (failHard) return res.status(401).render("errors/401");
		return;
	}

	try {
		req.user = verifyToken(token);
	} catch (e) {
		if (failHard) return res.status(401).render("errors/401");
		return;
	}
}

module.exports = authorize;
