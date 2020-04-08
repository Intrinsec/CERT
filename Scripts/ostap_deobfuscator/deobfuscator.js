// Libraries required
const fs = require('fs')
const beautify = require('js-beautify').js

// Deobfuscation function
function deobfuscate (filename) {
	var b = ""
	fs.readFile(filename, 'utf8', function (err, data) {
		console.log("\nOBFUSCATED FILE :", filename)
		// Set regular expressions used to parse deobfuscation output
		var re = /\[[ ()a-zA-Z0-9_/+-]{1,}\][ ]?=[ ]?[0-9]{1,3};/g
		b = beautify(data).match(re)
		var reurl = /(https|http):\/\/.+\.(php|html)/
		var reip = /([0-9]{1,3}\.){3}[0-9]{1,3}/
		var reua = /User-Agent.+endstatus/
		var secondTerm = []
		var firstTerm = []
		var results = []
		var i = 0
		var j = 0
		var cpt = 0
		var sNumber = 0
		try{
			for(c=0; c<b.length; c++){
				// Get indexes needed to calculate each value corresponding to a script character
				var sNumber = parseInt((b[c].replace(/\[[ ()a-zA-Z0-9_/+-]{1,}\][ ]?=[ ]?/, '')).replace(';', ''))
				if(cpt%2==0) {
					secondTerm[i] = sNumber
					i++
				} else if (cpt%2!=0) {
					firstTerm[j] = sNumber
					// Calculate firstTerm - secondTerm
					results[j]=firstTerm[j]-secondTerm[j]
					j++
				}
				cpt++
			}
		} catch {
			console.log(">>> Unable to parse input data.")
			return
		}
		var ffr=""
		for(k=0; k<results.length; k++){
			// Decode with String.fromCharCode each obfuscated character
			ffr += String.fromCharCode(results[k].toString())
		}
		// Display desobfuscated script and IOCs
		try{
			console.log("\nDEOBFUSCATED SCRIPT :")
			console.log(ffr)
		} catch {
			console.log('>>> Unable to display deobfuscated script.')
			return
		}
		console.log("\nIOCs :")
		try{
			console.log(ffr.match(reurl)[0])	
		} catch {
			console.log('>>> Unable to display URLs.')
		}
		try{
			console.log(ffr.match(reip)[0])
			
		} catch {
			console.log('>>> Unable to display IPs.')
		}
		try{
			console.log(ffr.match(reua)[0].replace(/(S|s)endstatus/, ''	))
		} catch {
			console.log('>>> Unable to display User-Agents.')
		}
	})
}

// Get file names from command line
function main() {
console.log(" #######   ######  ########    ###    ########     ########  ########  #######  ########  ######## ##     ##  ######   ######     ###    ######## ####  #######  ##    ## ")
console.log("##     ## ##    ##    ##      ## ##   ##     ##    ##     ## ##       ##     ## ##     ## ##       ##     ## ##    ## ##    ##   ## ##      ##     ##  ##     ## ###   ## ")
console.log("##     ## ##          ##     ##   ##  ##     ##    ##     ## ##       ##     ## ##     ## ##       ##     ## ##       ##        ##   ##     ##     ##  ##     ## ####  ## ")
console.log("##     ##  ######     ##    ##     ## ########     ##     ## ######   ##     ## ########  ######   ##     ##  ######  ##       ##     ##    ##     ##  ##     ## ## ## ## ")
console.log("##     ##       ##    ##    ######### ##           ##     ## ##       ##     ## ##     ## ##       ##     ##       ## ##       #########    ##     ##  ##     ## ##  #### ")
console.log("##     ## ##    ##    ##    ##     ## ##           ##     ## ##       ##     ## ##     ## ##       ##     ## ##    ## ##    ## ##     ##    ##     ##  ##     ## ##   ### ")
console.log(" #######   ######     ##    ##     ## ##           ########  ########  #######  ########  ##        #######   ######   ######  ##     ##    ##    ####  #######  ##    ## ")
	var args = process.argv.slice(2)
	if(process.argv[1] == '-h' || process.argv[1] == "/?" || process.argv[1] == "--help" || process.argv[2] == '-h' || process.argv[2] == "/?" || process.argv[2] == "--help"){
		console.log("Usage : node core.js <filename>")
		return
	}
	for (nb=0; nb<args.length; nb++){
		// Check if the file exists or not
		if(fs.existsSync(args[nb])){
			deobfuscate(args[nb])
		} else {
			console.log("\"", args[nb], "\" not found")
		}
	}
}

main()
