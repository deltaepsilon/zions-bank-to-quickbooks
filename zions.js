var path = process.argv[1],
	file = process.argv[2],
	fs = require('fs'),
	destination = __dirname + '/result.iif';
if (!file) {
	return console.log("You're going to need to specify a .csv file to process, or this will go nowhere.");
}

function main () {
	// console.log()
	// console.log(path, file, process.argv);
	var csv = fs.readFileSync( __dirname + '/' + file, 'utf8'),
		lines = csv.split('\n'),
		i = lines.length,
		split,
		cleaned = [],
		regex = /"/g,
		date;

	while (i--) {
		split = lines[i].split(',');
		if (split.length === 18 && split[1].replace(regex, '') !== "Posted Date") {
			date = split[1].match(/(\d{4})-(\d{2})-(\d{2})/);
			console.log(date)
			cleaned.push({
				DATE: date[2] + '/' + date[3] + '/' + date[1],
				ACCNT: "Zions",
				secondaryACCNT: split[12].replace(regex, '') === 'Credit' ? "Zions Credit" : "Zions Debit",
				NAME: split[2].replace(regex, ''),
				"CLASS": "Zions Bank Transaction - " + split[12].replace(regex, ''),
				AMOUNT: split[3].replace(regex, ''),
				MEMO: split[7].replace(regex, ''),

			});
		}
		// if (split.length === 1);
	}
	fs.writeFileSync(destination, '!TRNS	DATE	ACCNT	NAME	CLASS	AMOUNT	MEMO\n!SPL	DATE	ACCNT	NAME	AMOUNT	MEMO\n!ENDTRNS\n');
	format(cleaned);
}

function format (transactions) {
	var i = transactions.length,
		transaction,
		text;
	while (i--) {
		transaction = transactions[i];
		text = "";
		text += 'TRNS\t"' + transaction.DATE + '"\t"' + transaction.ACCNT + '"\t"' + transaction.NAME + '"\t"' + transaction["CLASS"] + '"\t"' + transaction.AMOUNT  + '"\t"' +  transaction.MEMO  + '"\n';
		text += 'SPL\t"' + transaction.DATE  + '"\t"' + transaction.secondaryACCNT + '"\t"' + transaction.NAME + '"\t"' + transaction.AMOUNT + '"\t"' + transaction.MEMO + '"\n';
		text += "ENDTRNS\n";
		fs.appendFileSync(destination, text);
	}
}


main();
