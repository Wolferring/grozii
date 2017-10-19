var host = {
	dev:"http://api.gwz.eptonic.biz",
	prod:"http://api.grozii.com"
}
var env = {
	browser:process.env.NODE_ENV != 'production'
}
export default{
	host,
	env
}
