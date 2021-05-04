//@ts-check

function logError(error) {
	document.querySelector("#errors").innerText += error + "\n";
}

function logInfo({name, notes, level}) {
	const report = document.querySelector("#report tbody");
	let icon;
	switch (level) {
		case "ok": icon = "✔️"; break;
		case "info": icon = "🔵"; break;
		case "warn": icon = "⚠️"; break;
		case "error": icon = "❌"; break;
	}
	const row = document.createElement("tr");

	const iconTd = document.createElement("td");
	iconTd.innerText = icon;
	iconTd.title = level;
	row.appendChild(iconTd);

	const checkTd = document.createElement("td");
	checkTd.innerText = name;
	row.appendChild(checkTd);

	const notesTd = document.createElement("td");
	notesTd.innerText = notes;
	row.appendChild(notesTd);

	report.appendChild(row);
}

const TEXT_BEGIN_BEGIN = 10;
const TEXT_BEGIN_END = 18;
const TEXT_END_BEGIN = 18;
const TEXT_END_END = 26;
const DATA_BEGIN_BEGIN = 26;
const DATA_BEGIN_END = 34;
const DATA_END_BEGIN = 34;
const DATA_END_END = 42;
const ANALYSIS_BEGIN_BEGIN = 42;
const ANALYSIS_BEGIN_END = 50;
const ANALYSIS_END_BEGIN = 50;
const ANALYSIS_END_END = 58;

const REQUIRED_KEYWORDS = {
	"1.0": [], // yep, none.
	"2.0": [
		"$BYTEORD", "$DATATYPE", "$MODE", "$NEXTDATA", "$PAR", "$P{{n}}B", "$P{{n}}R"
	],
	"3.0": [
		"$BEGINANALYSIS", "$BEGINDATA", "$BEGINSTEXT", "$BYTEORD", "$DATATYPE",
		"$ENDANALYSIS", "$ENDDATA", "$ENDSTEXT", "$MODE", "$NEXTDATA", "$PAR",
		"$P{{n}}B", "$P{{n}}E", "$P{{n}}R", "$TOT" // major: $PnN is still not required!
	],
	"3.1": [
		"$BEGINANALYSIS", "$BEGINDATA", "$BEGINSTEXT", "$BYTEORD", "$DATATYPE",
		"$ENDANALYSIS", "$ENDDATA", "$ENDSTEXT", "$MODE", "$NEXTDATA", "$PAR",
		"$P{{n}}B", "$P{{n}}E", "$P{{n}}N", "$P{{n}}R", "$TOT"
	],
	"3.2": [
		"$BEGINDATA", "$BYTEORD", "$CYT", "$DATATYPE",
		"$ENDDATA", "$NEXTDATA", "$PAR",
		"$P{{n}}B", "$P{{n}}E", "$P{{n}}N", "$P{{n}}R", "$TOT"
	],
	"4.0": [
		"$BEGINDATA", "$BYTEORD", "$DATATYPE",
		"$ENDDATA", "$NEXTDATA", "$PAR", "$DATE", "$ETIM", "$CYT", "$BTIM",
		"$P{{n}}B", "$P{{n}}E", "$P{{n}}N", "$P{{n}}R", "$TOT"
	]
};

const OPTIONAL_KEYWORDS = {
	"1.0": [
		"$ASC", "$PAR",
		"$ABRT", "$BTIM", "$CELLS", "$COM",
		"$CYT",
		"$DATE",
		"$DFC{{m}}{{n}}",
		"$ETIM", "$EXP", "$FIL", "$GATE",
		"$G{{n}}*", "$INST",
		"$LOST", "$OP",
		"$PK{{n}}", "$PKN{{n}}",
		"$P{{n}}N", "$P{{n}}F", "$P{{n}}L", "$P{{n}}O", "$P{{n}}P",
		"$P{{n}}T", "$P{{n}}V", "$P{{n}}R", "$P{{n}}B",
		"$PROJ", "$R{{n}}I", "$R{{n}}W", "$SMNO",
		"$SRC", "$SYS", "$TOT", "$TR",
	],
	"2.0": [
		"$ABRT", "$BTIM", "$CELLS", "$COM",
		"$CYT",
		"$DATE",
		"$DFC{{m}}TO{{n}}",
		"$ETIM", "$EXP", "$FIL", "$GATE", "$GATING",
		"$G{{n}}*", "$INST",
		"$LOST", "$OP",
		"$PK{{n}}", "$PKN{{n}}",
		"$P{{n}}N", "$P{{n}}F", "$P{{n}}E", "$P{{n}}L", "$P{{n}}O", "$P{{n}}P",
		"$P{{n}}T", "$P{{n}}V",
		"$PROJ", "$R{{n}}I", "$R{{n}}W", "$SMNO",
		"$SRC", "$SYS", "$TOT", "$TR"
	],
	"3.0": [
		"$ABRT", "$BTIM", "$CELLS", "$COM",
		"$COMP",
		"$CSMODE", "$CSVBITS", "CSV{{n}}FLAG",
		"$CYT", "$CYTSN", "$DATE", "$ETIM", "$EXP", "$FIL", "$GATE", "$GATING",
		"$G{{n}}E", "$G{{n}}F", "$G{{n}}N", "$G{{n}}P", "$G{{n}}R", "$G{{n}}S",
		"$G{{n}}T", "$G{{n}}V", "$INST",
		"$LOST", "$OP",
		"$PK{{n}}", "$PKN{{n}}", // spec typo: capital K in $PKn
		"$P{{n}}D", "$P{{n}}F", "$P{{n}}G", "$P{{n}}L", "$P{{n}}O", "$P{{n}}P",
		"$P{{n}}S", "$P{{n}}T", "$P{{n}}V", "$P{{n}}N",
		"$PROJ", "$R{{n}}I", "$R{{n}}W", "$SMNO",
		"$SRC", "$SYS", "$TIMESTEP", "$TR",
		"$UNICODE"
	],
	"3.1": [
		"$ABRT", "$BTIM", "$CELLS", "$COM",
		"$CSMODE", "$CSVBITS", "CSV{{n}}FLAG", // unclear from spec if CSMODE is allowed
		"$CYT", "$CYTSN", "$DATE", "$ETIM", "$EXP", "$FIL", "$GATE", "$GATING",
		"$G{{n}}E", "$G{{n}}F", "$G{{n}}N", "$G{{n}}P", "$G{{n}}R", "$G{{n}}S",
		"$G{{n}}T", "$G{{n}}V", "$INST", "$LAST_MODIFIED", "$LAST_MODIFIER",
		"$LOST", "$OP", "$ORIGINALITY",
		"$PK{{n}}", "$PKN{{n}}",
		"$PLATEID", "$PLATENAME", "$P{{n}}CALIBRATION",
		"$P{{n}}D", "$P{{n}}F", "$P{{n}}G", "$P{{n}}L", "$P{{n}}O", "$P{{n}}P",
		"$P{{n}}S", "$P{{n}}T", "$P{{n}}V",
		"$PROJ", "$R{{n}}I", "$R{{n}}W", "$SMNO",
		"$SPILLOVER",
		"$SRC", "$SYS", "$TIMESTEP", "$TR",
		"$VOL", "$WELLID"
	],
	"3.2": [
		"$ABRT", "$BEGINANALYSIS", "$BEGINDATETIME", "$BEGINSTEXT",
		"$CARRIERID", "$CARRIERTYPE", "$CELLS", "$COM", "$CYTSN",
		"$ENDANALYSIS", "$ENDDATETIME", "$ENDSTEXT", "$EXP", "$FIL",
		"$FLOWRATE", "$INST", "$LAST", "$LAST", "$LOCATIONID", "$LOST", "$MODE",
		"$OP", "$ORIGINALITY", "$PnANALYTE", "$PnCALIBRATION", "$PnD",
		"$PnDATATYPE", "$PnDET", "$PnF", "$PnFEATURE", "$PnG", "$PnL", "$PnO",
		"$PnS", "$PnT", "$PnTAG", "$PnTYPE", "$PnV", "$PROJ", "$SMNO",
		"$SPILLOVER", "$SRC", "$SYS", "$TIMESTEP", "$TR", "$UNSTAINEDCENTERS",
		"$UNSTAINEDINFO", "$VOL",
		// Also include the deprecated keywords:
		"$BTIM", "$DATE", "$ETIM", "$GATING", "$PLATEID", "PLATENAME",
		"$P{{n}}P", "$R{{n}}I", "$R{{n}}W", "$WELLID"
	],
	"4.0": [
		"$BEGINANALYSIS", "$ENDANALYSIS", "$BEGINSTEXT", "$ENDSTEXT",
		"$ABRT", "$CELLS", "$COM",
		"$CYTSN", "$EXP", "$FIL", "$GATING",
		"$INST", "$LAST_MODIFIED", "$LAST_MODIFIER",
		"$LOST", "$MODE", "$OP", "$ORIGINALITY",
		"$PLATEID", "$PLATENAME", "$P{{n}}CALIBRATION",
		"$P{{n}}D", "$P{{n}}F", "$P{{n}}G", "$P{{n}}L", "$P{{n}}O", "$P{{n}}P",
		"$P{{n}}S", "$P{{n}}T", "$P{{n}}V", "$P{{n}}TYPE",
		"$PROJ", "$R{{n}}I", "$R{{n}}W", "$SMNO",
		"$SPILLOVER",
		"$SRC", "$SYS", "$TIMESTEP", "$TR",
		"$VOL", "$WELLID",
		"{{n}}CALIBRATION",
		"$CARRIERID", "$CARRIERTYPE", "$LOCATIONID",
		"$P{{n}}$RFMIN", "$P{{n}}$RFMAX",
		"$MIXEDDETECTORLIST", "$UNMIXED", "$PROBES", "$PROBE{{n}}TAG",
		"$PROBE{{n}}SPEC", "$PROBE{{n}}REF", "$UNMIXINGMATRICES",
		"$UNMIXINGMATRIX{{n}}"
	]
};

function read(file, coordinates) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.addEventListener("loadend", () => resolve(reader.result));
		reader.addEventListener("error", reject);
		const segment = file.slice(...coordinates);
		reader.readAsText(segment);
	});
}

async function validate(file) {
	const report = document.querySelector("#report tbody");
	report.innerHTML = "";
	const chars = await read(file, [0, ANALYSIS_END_END]);
	if (/^FCS2.0 {4}[\d ]{48}/.test(chars)) return validate2_0(file);
	if (/^FCS3.0 {4}[\d ]{48}/.test(chars)) return validate3_0(file);
	if (/^FCS3.1 {4}[\d ]{48}/.test(chars)) return validate3_1(file);
	if (/^FCS3.2 {4}[\d ]{48}/.test(chars)) return validate3_2(file);
	if (/^FCS4.0 {4}[\d ]{48}/.test(chars)) return validate4_0(file);
	logError("This does not appear to be a valid FCS 2.0, 3.0, 3.1, 3.2 or 4.0 file.");
	logError(chars);
	// Note: Diva 6 on the Aria will put a "-1" in the header, which is not allowed
	// and will fail at this point.
}

/** @param {File} file */
async function checkDataCoords(file, keyvals) {
	const $PAR = Number.parseInt(keyvals.get("$PAR"), 10);
	const $TOT = Number.parseInt(keyvals.get("$TOT"), 10);
	let bitsPerEvent = 0;
	for (let n = 1; n <= $PAR; n++) {
		const bits = Number.parseInt(keyvals.get(`$P${n}B`), 10);
		bitsPerEvent += bits;
	}
	const bitsTotal = bitsPerEvent * $TOT;
	const bytesTotal = bitsTotal >>> 3;
	const coordinates = await getCoordinates(file);
	let [$BEGINDATA, $ENDDATA] = coordinates[1];
	if ($BEGINDATA === 0 && $ENDDATA === 0) {
		logInfo({
			name: "§3.1.1 HEADER segment",
			notes: `File uses large-file mode.`,
			level: "info"
		});
		$BEGINDATA = Number.parseInt(keyvals.get("$BEGINDATA"), 10);
		$ENDDATA = Number.parseInt(keyvals.get("$ENDDATA"), 10);
	}
	const claimedSize = $ENDDATA - $BEGINDATA + 1;
	if (claimedSize !== bytesTotal) {
		logInfo({
			name: "§3.1.1 HEADER segment",
			notes: `$BEGINDATA and $ENDDATA allow ${claimedSize} bytes in DATA segment, but should be ${bytesTotal}. This is not typically fatal for FSC file readers.`,
			level: "warn"
		});
	} else {
		logInfo({
			name: "§3.1.1 HEADER segment",
			notes: `$BEGINDATA and $ENDDATA allow required number of bytes in DATA segment (${claimedSize}).`,
			level: "ok"
		});
	}
	if (file.size < bytesTotal + $BEGINDATA) {
		// Could improve this with STEXT, ANALYSIS
		logInfo({
			name: "General",
			notes: `File is truncated: should have at least ${bytesTotal + $BEGINDATA} bytes, but only contains ${file.size} bytes.`,
			level: "error"
		});
	}
}

function stringToInt(text, begin, end) {
	return Number.parseInt(text.slice(begin, end));
}

/**
 * @param {File} file
 * @return {Promise<Array<Array<number>>>} Text coordinates, data coordinates, analysis coordinates.
 */
async function getCoordinates(file) {
	const header = await read(file, [0, ANALYSIS_END_END]);
	return [
		[
			stringToInt(header, TEXT_BEGIN_BEGIN, TEXT_BEGIN_END),
			stringToInt(header, TEXT_END_BEGIN, TEXT_END_END)
		],
		[
			stringToInt(header, DATA_BEGIN_BEGIN, DATA_BEGIN_END),
			stringToInt(header, DATA_END_BEGIN, DATA_END_END)
		],
		[
			stringToInt(header, ANALYSIS_BEGIN_BEGIN, ANALYSIS_BEGIN_END),
			stringToInt(header, ANALYSIS_END_BEGIN, ANALYSIS_END_END)
		]
	];
}

function checkDelimiter(delim) {
	const code = delim.charCodeAt(0);
	const valid = code >= 0x01 && code <= 0x7E;
	logInfo({
		name: "§2.2.15 Delimiter",
		notes: "Delimiter is an ASCII character from the range 1 - 126.",
		level: valid ? "ok" : "error"
	});
}

function escapeRegexpComponent(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

function textToMap(delimiter, text) {
	// Workaround for lack of lookbehind support:
	const edelim = escapeRegexpComponent(delimiter);
	const keyvals = text.replace(new RegExp(edelim + edelim, "g"), "\x1F")
		.split(delimiter)
		.map(e => e.replace("\x1F", delimiter));
	const kvl = keyvals.length;
	const header = new Map();
	for (let i = 1; i < kvl - 1; i += 2) header.set(keyvals[i].toUpperCase(), keyvals[i + 1]);
	return header;
}

function checkKeywordPresent(keyword, keyvals, text, delim) {
	if (keyvals.has(keyword)) {
		return true;
	}

	// Possibly an unescaped delimiter preceding this key like //$TOT/
	const edelim = escapeRegexpComponent(delim)
	const re = new RegExp(`${edelim}${escapeRegexpComponent(keyword)}${edelim}[^${edelim}]`);
	const exists = re.test(text);
	if (exists) {
		logInfo({
			name: "§3.2.18 Delimiter Escaping",
			notes: `An unescaped delimiter is likely present before keyword "${keyword}".`,
			level: "warn"
		});
		return true;
	}

	// Possibly an empty value like /$TOT//
	const re2 = new RegExp(`${edelim}${escapeRegexpComponent(keyword)}${edelim}${edelim}`);
	const exists2 = re2.test(text);
	if (exists2) {
		logInfo({
			name: "§3.2.7 Keyword Values",
			notes: `Value of keyword "${keyword}" starts with the delimiter character.`,
			level: "error"
		});
		return;
	}
	
	logInfo({
		name: "§3.2.18 Required Keywords",
		notes: `Required keyword "${keyword}" is missing.`,
		level: "error"
	});
}

function checkRequiredKeywords(version, text) {
	const keywords = REQUIRED_KEYWORDS[version];
	const delim = text[0];
	const keyvals = textToMap(delim, text);
	const $PAR = Number.parseInt(keyvals.get("$PAR"), 10);
	const present = [];
	for (const keyword of keywords) {
		if (keyword.includes("{{n}}")) {
			for (let n = 1; n <= $PAR; n++) {
				const sub = keyword.replace("{{n}}", n);
				if (checkKeywordPresent(sub, keyvals, text, delim)) present.push(sub);
			}
		} else {
			if (checkKeywordPresent(keyword, keyvals, text, delim)) present.push(keyword);
		}
	}
	logInfo({
		name: "§3.2.18 Required Keywords",
		notes: `Required keywords "${present.join("\", \"")}" are present.`,
		level: "ok"
	});
}

function checkNoCustomKeywordsStartWith$(version, text) {
	const delim = text[0];
	const keyvals = textToMap(delim, text);
	const $PAR = Number.parseInt(keyvals.get("$PAR"), 10);
	const required = REQUIRED_KEYWORDS[version];
	const optional = OPTIONAL_KEYWORDS[version];
	const allowed = new Set();
	for (const keyword of required.concat(optional)) {
		if (keyword.includes("{{m}}") && keyword.includes("{{n}}")) {
			// Beckman routinely includes a bigger matrix than $PAR.
			for (let n = 1; n <= Math.max(10, $PAR); n++)
				for (let m = 1; m <= Math.max(10, $PAR); m++)
					allowed.add(keyword.replace("{{n}}", n).replace("{{m}}", m));
		} else if (keyword.includes("{{n}}")) {
			for (let n = 1; n <= $PAR; n++) {
				allowed.add(keyword.replace("{{n}}", n));
			}
		} else {
			allowed.add(keyword);
		}
	}

	let hasViolation = false;
	for (const [keyword, value] of keyvals) {
		if (!allowed.has(keyword) && keyword[0] === "$") {
			hasViolation = true;
			logInfo({
				name: "§3.2.12 Standard Keywords",
				notes: `Keyword ${keyword} starts with "$", but only FCS-defined keywords may begin with "$". This is not typically fatal for FCS readers.`,
				level: "warn"
			});
		}
	}

	if (!hasViolation) {
		logInfo({
			name: "§3.2.12 Standard Keywords",
			notes: `Only FCS-defined keywords begin with "$".`,
			level: "ok"
		});
	}

	// TODO more we can do here:
	// custom keywords must be ASCII, not contain CR, LF or other unprintable chars
}

function checkUnescapedDelimiters(version, keyvals, text) {
	const edelim = escapeRegexpComponent(text[0]);
	const $PAR = Number.parseInt(keyvals.get("$PAR"), 10);
	const required = REQUIRED_KEYWORDS[version];
	const optional = OPTIONAL_KEYWORDS[version];
	const allowed = new Set();
	for (const keyword of required.concat(optional)) {
		if (keyword.includes("{{n}}")) {
			for (let n = 1; n <= $PAR; n++) {
				allowed.add(keyword.replace("{{n}}", n));
			}
		} else {
			allowed.add(keyword);
		}
	}

	let ok = true;
	for (const keyword of allowed) {
		const eK = escapeRegexpComponent(keyword.toUpperCase());
		const re = new RegExp(`${edelim}${eK}${edelim}${edelim}`);
		if (re.test(text)) {
			ok = false;
			logInfo({
				name: "§3.2.9 Empty Keywords",
				notes: `An empty keyword exists: ${keyword}`,
				level: "error"
			});
		}
	}

	if (ok) {
		logInfo({
			name: "§3.2.7 Delimiter",
			notes: `No empty keywords found. Note: this test may have false-negatives because it can only reliably check for keywords defined in the FCS specification.`,
			level: "ok"
		});
	}
}

function checkDuplicateKeywords(keyvals, text) {
	let ok = true;
	const edelim = escapeRegexpComponent(text[0]);
	const upper = text.toUpperCase();
	for (const [keyword, value] of keyvals) {
		const eK = escapeRegexpComponent(keyword.toUpperCase());
		const re = new RegExp(`${edelim}${eK}${edelim}`, "g");
		const match = upper.match(re);
		if (match && match.length > 1) {
			ok = false;
			logInfo({
				name: "§3.2.20 Keyword Specifications",
				notes: `Keyword ${keyword} occurs ${match.length} times. Keywords must occur exactly once. Note: this may actually reflect an unescaped delimiter preceding this keyword.`,
				level: "error"
			});
		}
	}
	if (ok) {
		logInfo({
			name: "§3.2.20 Keyword Specifications",
			notes: `Keywords appear exactly once.`,
			level: "ok"
		});
	}
}

function checkInteger(keyword, keyvals) {
	const value = keyvals.get(keyword);
	if (value) {
		const ok = /^[0-9]+$/.test(value);
		logInfo({
			name: "§3.2.20 Keyword Specifications",
			notes: `${keyword} must be an integer` + (ok ? "" : `, got "${value}". Note that the FCS3.1 specification §3.2.17 forbids padding with any character other than '0'.`),
			level: ok ? "ok" : "error"
		});
	}
}

function checkFloat(keyword, keyvals) {
	const value = keyvals.get(keyword);
	if (value) {
		// TODO the spec (3.1 and 3.2 at least) allows exponential notation
		const ok = /^[\.0-9]+$/.test(value);
		logInfo({
			name: "§3.2.20 Keyword Specifications",
			notes: `${keyword} must be an number` + (ok ? "" : `, got "${value}".`),
			level: ok ? "ok" : "error"
		});
	}
}

function checkBETIM(version, keyword, keyvals) {
	const value = keyvals.get(keyword);
	if (value) {
		if (version === "1.0" || version === "2.0") { // hh:mm:ss
			// not a bullet-proof test but good enough for most cases:
			const ok = /^[0-2]\d:[0-6]\d:[0-6]\d$/.test(value);
			logInfo({
				name: "§3.2.20 Keyword Specifications",
				notes: `${keyword} must match "hh:mm:ss" (is ${value}).`,
				level: ok ? "ok" : "error"
			});
		} else if (version === "3.0") { // hh:mm:ss[:tt]
			// not a bullet-proof test but good enough for most cases:
			const ok = /^[0-2]\d:[0-6]\d:[0-6]\d(:[0-6]\d)?$/.test(value);
			logInfo({
				name: "§3.2.20 Keyword Specifications",
				notes: `${keyword} must match "hh:mm:ss[:tt]" (is ${value}).`,
				level: ok ? "ok" : "error"
			});
		} else if (version === "3.1" || version === "4.0") { // hh:mm:ss[.cc]
			// not a bullet-proof test but good enough for most cases:
			const ok = /^[0-2]\d:[0-6]\d:[0-6]\d(\.\d\d)?$/.test(value);
			logInfo({
				name: "§3.2.20 Keyword Specifications",
				notes: `${keyword} must match "hh:mm:ss[.cc]" (is ${value}).`,
				level: ok ? "ok" : "error"
			});
		}
	}
}

function checkDATE(keyvals) {
	const value = keyvals.get("$DATE");
	if (value) {
		const restr = "^\\d{2}-(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)-\\d{4}$";
		const strictOK = new RegExp(restr).test(value);
		const laxOK = new RegExp(restr, "i").test(value);
		// All files seem to use "Jan" and not "JAN", so be relaxed.
		logInfo({
			name: "§3.2.20 Keyword Specifications",
			notes: `$DATE must match "dd-mmm-yyyy" (is ${value}). Note: The specification lists upper-case months, but does not explicitly say that this field is case-sensitive.`,
			level: laxOK ? "ok" : "error"// strictOK ? "ok" : (laxOK ? "warn" : "error")
		});
	}
}

function checkBYTEORD(version, keyvals) {
	const value = keyvals.get("$BYTEORD");
	let allowedValues;
	if (version === "2.0" || version === "3.0") {
		// Other mixed byte orderings exist but are rare.
		allowedValues = ["1,2,3,4", "4,3,2,1", "3,4,1,2", "2,1,4,3", "1,2", "2,1"];
	}
	if (version === "3.1" || version === "3.2" || version === "4.0")
		allowedValues = ["1,2,3,4", "4,3,2,1"];
	const ok = allowedValues.includes(value);
	logInfo({
		name: "§3.2.20 Keyword Specifications",
		notes: `$BYTEORD must be one of "${allowedValues.join("\", \"")}".`,
		level: ok ? "ok" : "error"
	});
}

function checkDATATYPE(version, keyvals) {
	const value = keyvals.get("$DATATYPE");
	if (version === "4.0") {
		const ok = value === "I" || value === "F" || value === "D";
		logInfo({
			name: "§3.2.20 Keyword Specifications",
			notes: `$DATATYPE is ${value}; must be one of "I", "F" or "D".`,
			level: ok ? "ok" : "error"
		});
	} else {
		const ok = value === "I" || value === "F" || value === "D" || value === "A";
		logInfo({
			name: "§3.2.20 Keyword Specifications",
			notes: `$DATATYPE is ${value}; must be one of "I", "F", "D" or "A".`,
			level: ok ? "ok" : "error"
		});
		if (value === "A") {
			logInfo({
				name: "§3.2.20 Keyword Specifications",
				notes: `$DATATYPE "A" is deprecated in FCS 3.1 and 3.2 and not widely supported. Validation of this file will not be thorough.`,
				level: "warn"
			});
		}
	}

	if (value === "I") checkIntegers(version, keyvals);
	if (value === "F" || value === "D") checkFloats(version, keyvals);
}

function checkIntegers(version, keyvals) {
	let ok = true;
	const $PAR = Number.parseInt(keyvals.get("$PAR"), 10);
	for (let n = 1; n <= $PAR; n++) {
		const $PnE = keyvals.get(`$P${n}E`);
		let [f1, f2] = $PnE.split(",");
		f1 = Number.parseFloat(f1);
		f2 = Number.parseFloat(f2);
		const bothZero = f1 === 0 && f2 === 0;
		const bothPositive = f1 > 0 && f2 > 0;
		if (!bothZero && !bothPositive) {
			ok = false;
			logInfo({
				name: "§3.2.20 Keyword Specifications",
				notes: `$PnE must be "0,0" or "[>0],[>0]" for $DATATYPE I (is ${$PnE}).`,
				level: "error"
			});
		}
		if (version === "4.0") {
			const $PnB = Number.parseInt(keyvals.get(`$P${n}B`), 10);
			if ($PnB % 8 !== 0) {
				logInfo({
					name: "§3.2.20 Keyword Specifications",
					notes: `$PnB values not divisible by 8 are deprecated in FCS 4.0 (found ${$PnB}).`,
					level: "warn"
				});
			}
		}
	}
	if (ok) {
		logInfo({
			name: "§3.2.20 Keyword Specifications",
			notes: `$PnE must be "0,0" or "[>0],[>0]" for $DATATYPE I.`,
			level: "ok"
		});
	}
}

function checkFloats(version, keyvals) {
	let global$PnEok = true;
	let global$PnBok = true;
	const $PAR = Number.parseInt(keyvals.get("$PAR"), 10);
	const ok$PnE = "0,0";
	const $DATATYPE = keyvals.get("$DATATYPE");
	const allowed$PnB = $DATATYPE === "F" ? "32" : "64";
	for (let n = 1; n <= $PAR; n++) {
		const $PnEok = version !== "3.1" || keyvals.get(`$P${n}E`) === ok$PnE;
		if (!$PnEok) {
			global$PnEok = false;
			logInfo({
				name: "§3.2.20 Keyword Specifications",
				notes: `$PnE must be "0,0" for $DATATYPE ${$DATATYPE} (channel ${n}).`,
				level: $PnEok ? "ok" : "error"
			});
		}

		const $PnBok = keyvals.get(`$P${n}B`) === allowed$PnB;
		if (!$PnBok) {
			global$PnBok = false;
			logInfo({
				name: "§3.2.20 Keyword Specifications",
				notes: `$PnB must be ${allowed$PnB} for $DATATYPE ${$DATATYPE} (channel ${n}).`,
				level: $PnEok ? "ok" : "error"
			});
		}
	}
	if (global$PnEok) {
		logInfo({
			name: "§3.2.20 Keyword Specifications",
			notes: `$PnE values for $DATATYPE ${$DATATYPE} are all "0,0".`,
			level: "ok"
		});
	}
	if (global$PnBok) {
		logInfo({
			name: "§3.2.20 Keyword Specifications",
			notes: `$PnB values for $DATATYPE ${$DATATYPE} are all ${allowed$PnB}.`,
			level: "ok"
		});
	}
}

function checkMODE(version, keyvals) {
	const value = keyvals.get("$MODE");
	if ((version === "4.0" || version === "3.2") && !value)
		return; // not required in 3.2 or 4.0
	if (value === "L") {
		logInfo({
			name: "§3.2.20 Keyword Specifications",
			notes: `$MODE is "L".`,
			level: "ok"
		});
	}
	if ((version === "4.0" || version === "3.2") && value !== "L") {
		logInfo({
			name: "§3.2.20 Keyword Specifications",
			notes: `Only $MODE "L" is supported in FCS 3.2 and 4.0.`,
			level: "error"
		});
	} else if (value === "U" || value === "C") {
		logInfo({
			name: "§3.2.20 Keyword Specifications",
			notes: `$MODE "C" and "U" are deprecated in FCS 3.1 and not widely supported. Validation of this file may not be thorough.`,
			level: "warn"
		});
	}
}

function checkPnD(keyvals) {
	let ok = true;
	const $PAR = Number.parseInt(keyvals.get("$PAR"), 10);
	for (let n = 1; n <= $PAR; n++) {
		const value = keyvals.get(`$P${n}D`);
		if (value) {
			let [type, f1, f2] = value.split(",");
			if (type !== "Linear" && type !== "Logarithmic") {
				ok = false;
				logInfo({
					name: "§3.2.20 Keyword Specifications",
					notes: `$P${n}D must specify "Linear" or "Logarithmic".`,
					level: "error"
				});
			}
			f1 = Number.parseFloat(f1);
			f2 = Number.parseFloat(f2);
			if (type === "Linear" && f2 < f1) {
				ok = false;
				logInfo({
					name: "§3.2.20 Keyword Specifications",
					notes: `$P${n}D lower bound (${f1}) must be less than upper bound (${f2}).`,
					level: "error"
				});
			}
		}
	}
	if (ok) {
		logInfo({
			name: "§3.2.20 Keyword Specifications",
			notes: `$PnD values are acceptable.`,
			level: "ok"
		});
	}
}

function checkPnG(keyvals) {
	let ok = true;
	const $PAR = Number.parseInt(keyvals.get("$PAR"), 10);
	for (let n = 1; n <= $PAR; n++) {
		if (keyvals.has(`$P${n}g`)) {
			const $PnG = Number.parseFloat(keyvals.get(`$P${n}G`));
			const $PnE = keyvals.get(`$P${n}E`);
			if ($PnE !== "0,0" && $PnG !== 1) {
				ok = false;
				logInfo({
					name: "§3.2.20 Keyword Specifications",
					notes: `$P${n}G must be 1 if $P${n}E is "0,0".`,
					level: "error"
				});
			}
		}
	}
	if (ok) {
		logInfo({
			name: "§3.2.20 Keyword Specifications",
			notes: `$PnG values are acceptable.`,
			level: "ok"
		});
	}
}

function checkPnR(keyvals) {
	let ok = true;
	const $PAR = Number.parseInt(keyvals.get("$PAR"), 10);
	for (let n = 1; n <= $PAR; n++) {
		const value = keyvals.get(`$P${n}R`);
		if (!/^[.0-9]+$/.test(value)) {
			ok = false;
			logInfo({
				name: "§3.2.20 Keyword Specifications",
				notes: `$P${n}R must be a number, got "${value}".`,
				level: "error"
			});
		}
	}
	if (ok) {
		logInfo({
			name: "§3.2.20 Keyword Specifications",
			notes: `$PnR values are all numbers.`,
			level: "ok"
		});
	}
}

function checkPnN(version, keyvals, text) {
	let ok = true;
	const $PAR = Number.parseInt(keyvals.get("$PAR"), 10);
	const edelim = escapeRegexpComponent(text[0]);
	for (let n = 1; n <= $PAR; n++) {
		const $PnN = keyvals.get(`$P${n}N`);
		if ((version === "3.1" || version === "3.2" || version === "4.0") && $PnN.includes(",")) {
			ok = false;
			logInfo({
				name: "§3.2.20 Keyword Specifications",
				notes: `$PnN must not contain a comma.`,
				level: "error"
			});
		}
	}
	// These are ridiculous, no one adheres to them.
	// if (version === "2.0") {
	// 	logInfo({
	// 		name: "FCS2.0 Parameter Names",
	// 		notes: `FCS 2.0 states "Possible values for the name are: FS, SS, FL[n], AE, CV, TI."`,
	// 		level: "info"
	// 	})
	// }
	// if (version === "3.0") {
	// 	logInfo({
	// 		name: "FCS3.0 Parameter Names",
	// 		notes: `FCS 3.0 states "Required short names for parameters include the following: CS, FS, SS, FLn, AE, CV, TIME." It's unclear in what sense they are "required."`,
	// 		level: "info"
	// 	})
	// }
	if (ok) {
		logInfo({
			name: "§3.2.20 Keyword Specifications",
			notes: `$PnN values are acceptable.`,
			level: "ok"
		});
	}
}

function check$COMP(keyvals) {
	const value = keyvals.get("$COMP");
	if (!value) return;
	let ok = true;
	const split = value.split(",");
	const N = Number.parseInt(split[0], 10);
	const $PAR = Number.parseInt(keyvals.get("$PAR"));
	const channelNames = new Set();
	for (let n = 1; n < $PAR; n++) {
		const cname = keyvals.get(`$P${n}N`);
		if (cname.startsWith("FL")) channelNames.add(cname);
	}
	if (channelNames.size !== N) {
		ok = false;
		logInfo({
			name: "§3.2.20 Keyword Specifications",
			notes: `$COMP has size ${N} but ${channelNames} "FL" channels exist.`,
			level: "error"
		});
	}
	// Check size. This roughly checks that the digit separator is a period and
	// not a comma (CytoFLEX bug).
	if (split.length !== 1 + N * N) {
		ok = false;
		logInfo({
			name: "§3.2.20 Keyword Specifications",
			notes: `$COMP value has the wrong number of values. Check that a period and not a comma is used as the decimal separator.`,
			level: "error"
		});
	}
	if (ok) {
		logInfo({
			name: "§3.2.20 Keyword Specifications",
			notes: `$COMP value is acceptable.`,
			level: "ok"
		});
	}
}

function check$SPILLOVER(keyvals) {
	const value = keyvals.get("$SPILLOVER");
	if (!value) return;
	let ok = true;
	const split = value.split(",");
	const N = Number.parseInt(split[0], 10);
	const $PAR = Number.parseInt(keyvals.get("$PAR"));
	// Check all channels exist. Also checks that the spillstring uses $PnN and not n.
	const channelNames = new Set();
	for (let n = 1; n <= $PAR; n++) channelNames.add(keyvals.get(`$P${n}N`));
	for (let n = 1; n <= N; n++) {
		const exists = channelNames.has(split[n]);
		if (!exists) {
			ok = false;
			logInfo({
				name: "§3.2.20 Keyword Specifications",
				notes: `$SPILLOVER references a channel that does not exist: "${split[n]}".`,
				level: "error"
			});
		}
	}
	// Check size. This roughly checks that the digit separator is a period and
	// not a comma (CytoFLEX bug).
	if (split.length !== 1 + N + N * N) {
		ok = false;
		logInfo({
			name: "§3.2.20 Keyword Specifications",
			notes: `$SPILLOVER value has the wrong number of values. Check that a period and not a comma is used as the decimal separator.`,
			level: "error"
		});
	}
	if (ok) {
		logInfo({
			name: "§3.2.20 Keyword Specifications",
			notes: `$SPILLOVER value is acceptable.`,
			level: "ok"
		});
	}
}

async function validate2_0(file) {
	logInfo({name: "Version", notes: "2.0", level: "info"});

	const coordinates = await getCoordinates(file);

	const text = await read(file, coordinates[0]);

	checkRequiredKeywords("2.0", text);
	checkNoCustomKeywordsStartWith$("2.0", text);
	
	const delim = text[0];
	const keyvals = textToMap(delim, text);
	
	checkDuplicateKeywords(keyvals, text);
	checkUnescapedDelimiters("2.0", keyvals, text);

	await checkDataCoords(file, keyvals);

	// no check: "$ASC"
	checkInteger("$ABRT", keyvals);
	checkBETIM("2.0", "$BTIM", keyvals);
	checkBYTEORD("2.0", keyvals);
	// no check: $COM
	// no check: $CYT
	checkDATATYPE("2.0", keyvals);
	checkDATE(keyvals);
	checkBETIM("2.0", "$ETIM", keyvals);
	// no check: $EXP
	// no check: $FIL
	// no check: $GATE, $GnE,F,N,P,R,S,T,V
	// no check: $INST
	checkInteger("$LOST", keyvals);
	checkMODE("2.0", keyvals);
	checkInteger("$NEXTDATA", keyvals);
	// no check: $OP
	checkInteger("$PAR", keyvals);
	// no check: $PKn, $PKNn
	// checked in checkDATATYPE: $PnB
	// no check: $PnF
	checkPnG(keyvals);
	// no check: $PnL
	checkPnN("2.0", keyvals, text)
	// no check: $PnO
	// no check: $PnP
	checkPnR(keyvals); // TODO this is an optional keyword
	// no check: $PnS
	// no check: $PnT
	// no check: $PnV
	// no check: $PROJ
	// no check: $RnI, RnW
	// no check: $SMNO
	// no check: $DFCmn
	// no check: $SRC
	// no check: $SYS
	checkInteger("$TOT", keyvals);
	// no check: $TR -- TODO
}

async function validate3_0(file) {
	logInfo({name: "Version", notes: "3.0", level: "info"});

	const coordinates = await getCoordinates(file);

	const text = await read(file, coordinates[0]);

	checkRequiredKeywords("3.0", text);
	checkNoCustomKeywordsStartWith$("3.0", text);
	
	const delim = text[0];
	const keyvals = textToMap(delim, text);
	
	checkDuplicateKeywords(keyvals, text);
	checkUnescapedDelimiters("3.0", keyvals, text);

	await checkDataCoords(file, keyvals);

	checkInteger("$ABRT", keyvals);
	checkInteger("$BEGINANALYSIS", keyvals);
	checkInteger("$BEGINDATA", keyvals);
	checkInteger("$BEGINSTEXT", keyvals);
	checkBETIM("3.0", "$BTIM", keyvals);
	checkInteger("$BEGINSTEXT", keyvals);
	checkBYTEORD("3.0", keyvals);
	// no check: $COM
	checkInteger("$CSMODE", keyvals);
	checkInteger("$CSVBITS", keyvals);
	// no check: $CSVnFLAG
	// no check: $CYT
	// no check: $CYTSN
	checkDATATYPE("3.0", keyvals);
	checkDATE(keyvals);
	checkInteger("$ENDANALYSIS", keyvals);
	checkInteger("$ENDDATA", keyvals);
	checkInteger("$ENDSTEXT", keyvals);
	checkBETIM("3.0", "$ETIM", keyvals);
	// no check: $EXP
	// no check: $FIL
	// no check: $GATE, $GATING, $GnE,F,N,P,R,S,T,V
	// no check: $INST
	// no check: $LAST_MODIFIED -- TODO dd-mmm-yyyy hh:mm:ss[.cc]
	// no check: $LAST_MODIFIER
	checkInteger("$LOST", keyvals);
	checkMODE("3.0", keyvals);
	checkInteger("$NEXTDATA", keyvals);
	// no check: $OP
	checkInteger("$PAR", keyvals); // we've already assumed this is...
	// no check: $PKn, $PKNn
	// checked in checkDATATYPE: $PnB
	// (no $PnD in 3.0)
	// no check: $PnF
	checkPnG(keyvals);
	// no check: $PnL -- different from 3.1 however
	checkPnN("3.0", keyvals, text)
	// no check: $PnO
	// no check: $PnP
	checkPnR(keyvals);
	// no check: $PnS
	// no check: $PnT
	// no check: $PnV
	// no check: $PROJ
	// no check: $RnI, RnW
	// no check: $SMNO
	check$COMP(keyvals);
	// no check: $SRC
	// no check: $SYS
	// no check: $TIMESTEP -- TODO
	checkInteger("$TOT", keyvals);
	// no check: $TR -- TODO
	// no check: $UNICODE
}

async function validate3_1(file) {
	logInfo({name: "Version", notes: "3.1", level: "info"});

	const coordinates = await getCoordinates(file);

	const text = await read(file, coordinates[0]);
	const delimiter = text[0];
	checkDelimiter(delimiter);
	checkRequiredKeywords("3.1", text);
	checkNoCustomKeywordsStartWith$("3.1", text);
	
	const delim = text[0];
	const keyvals = textToMap(delim, text);

	checkDuplicateKeywords(keyvals, text);
	checkUnescapedDelimiters("3.1", keyvals, text);

	await checkDataCoords(file, keyvals);

	checkInteger("$ABRT", keyvals);
	checkInteger("$BEGINANALYSIS", keyvals);
	checkInteger("$BEGINDATA", keyvals);
	checkInteger("$BEGINSTEXT", keyvals);
	checkBETIM("3.1", "$BTIM", keyvals);
	checkBYTEORD("3.1", keyvals);
	// no check: $COM
	checkInteger("$CSMODE", keyvals);
	checkInteger("$CSVBITS", keyvals);
	// no check: $CSVnFLAG
	// no check: $CYT
	// no check: $CYTSN
	checkDATATYPE("3.1", keyvals);
	checkDATE(keyvals);
	checkInteger("$ENDANALYSIS", keyvals);
	checkInteger("$ENDDATA", keyvals);
	checkInteger("$ENDSTEXT", keyvals);
	checkBETIM("3.1", "$ETIM", keyvals);
	// no check: $EXP
	// no check: $FIL
	// no check: $GATE, $GATING, $GnE,F,N,P,R,S,T,V
	// no check: $INST
	// no check: $LAST_MODIFIED -- TODO dd-mmm-yyyy hh:mm:ss[.cc]
	// no check: $LAST_MODIFIER
	checkInteger("$LOST", keyvals);
	checkMODE("3.1", keyvals);
	checkInteger("$NEXTDATA", keyvals);
	// no check: $OP
	// no check: $ORIGINALITY -- TODO enum Original, Appended, NoNDataModified, DataModified
	checkInteger("$PAR", keyvals); // we've already assumed this is...
	// no check: $PKn, $PKNn
	// no check: $PLATEID
	// no check: $PLATENAME
	// checked in checkDATATYPE3_1: $PnB
	// no check: $PnCALIBRATION -- TODO f,string where f is floating point
	checkPnD(keyvals);
	// checked in checkDATATYPE3_1: $PnE
	// no check: $PnF
	checkPnG(keyvals);
	// no check: $PnL
	checkPnN("3.1", keyvals, text)
	// no check: $PnO
	// no check: $PnP
	checkPnR(keyvals);
	// no check: $PnS
	// no check: $PnT
	// no check: $PnV
	// no check: $PROJ
	// no check: $RnI, RnW
	// no check: $SMNO
	check$SPILLOVER(keyvals);
	// no check: $SRC
	// no check: $SYS
	// no check: $TIMESTEP -- TODO
	checkInteger("$TOT", keyvals);
	// no check: $TR -- TODO
	// checkNumeric("$VOL", keyvals);
	// no check: $WELLID
}

async function validate3_2(file) {
	logInfo({name: "Version", notes: "3.2", level: "info"});

	const coordinates = await getCoordinates(file);

	const text = await read(file, coordinates[0]);
	const delimiter = text[0];
	checkDelimiter(delimiter);
	checkRequiredKeywords("3.2", text);
	checkNoCustomKeywordsStartWith$("3.2", text);
	
	const delim = text[0];
	const keyvals = textToMap(delim, text);

	checkDuplicateKeywords(keyvals, text);
	checkUnescapedDelimiters("3.2", keyvals, text);

	await checkDataCoords(file, keyvals);

	checkInteger("$ABRT", keyvals);
	checkInteger("$BEGINANALYSIS", keyvals);
	checkInteger("$BEGINDATA", keyvals);
	// TODO $BEGINDATETIME yyyy-mm-ddThh:mm:ss[TZD], ISO 8601
	checkInteger("$BEGINSTEXT", keyvals);
	checkBETIM("3.2", "$BTIM", keyvals); // TODO mark deprecated
	checkBYTEORD("3.2", keyvals);
	// no check: $CARRIERID, string
	// no check: $CARRIERTYPE, string
	// no check: $CELLS, string
	// no check: $COM, string
	// no check: $CYT, string
	// no check: $CYTSN, string
	checkDATATYPE("3.2", keyvals);
	checkDATE(keyvals); // TODO mark deprecated
	checkInteger("$ENDANALYSIS", keyvals);
	checkInteger("$ENDDATA", keyvals);
	// TODO $ENDDATETIME
	checkInteger("$ENDSTEXT", keyvals);
	checkBETIM("3.2", "$ETIM", keyvals); // TODO mark deprecated
	// no check: $EXP, string
	// no check: $FIL, string
	// no check: $FLOWRATE, string
	// no check: $GATE, $GATING, $GnE,F,N,P,R,S,T,V
	// no check: $INST, string
	// no check: $LAST_MODIFIED -- TODO dd-mmm-yyyy hh:mm:ss[.cc]
	// no check: $LAST_MODIFIER, string
	// no check: $LOCATIONID, string
	checkInteger("$LOST", keyvals);
	checkMODE("3.2", keyvals);
	checkInteger("$NEXTDATA", keyvals);
	// no check: $OP, string
	// no check: $ORIGINALITY -- TODO enum Original, Appended, NoNDataModified, DataModified
	checkInteger("$PAR", keyvals); // we've already assumed this is...
	// no check: $PLATEID, string, deprecated
	// no check: $PLATENAME, string, deprecated
	// no check: $PnANALYTE, string
	// checked in checkDATATYPE: $PnB
	// no check: $PnCALIBRATION -- TODO f[,f],string where f is floating point (different from 3.1)
	checkPnD(keyvals);
	// TODO the $PnDATATYPE keyword
	// no check: $PnDET, string
	// checked in checkDATATYPE: $PnE
	// no check: $PnF, string
	// no check, $PnFEATURE, string
	checkPnG(keyvals);
	// no check: $PnL
	checkPnN("3.2", keyvals, text)
	// no check: $PnO
	// no check: $PnP, deprecated
	checkPnR(keyvals);
	// no check: $PnS
	// no check: $PnT
	// no check: $PnTAG
	// no check: $PnTYPE
	// no check: $PnV
	// no check: $PROJ
	// no check: $RnI, RnW, deprecated
	// no check: $SMNO
	check$SPILLOVER(keyvals);
	// no check: $SRC
	// no check: $SYS
	// no check: $TIMESTEP -- TODO
	checkInteger("$TOT", keyvals);
	// no check: $TR -- TODO
	// no check: $UNSTAINEDCENTERS
	// no check: $UNSTAINEDINFO
	// checkNumeric("$VOL", keyvals); -- TODO
}

async function validate4_0(file) {
	logInfo({name: "Version", notes: "4.0", level: "info"});

	const coordinates = await getCoordinates(file);

	const text = await read(file, coordinates[0]);
	const delimiter = text[0];
	checkDelimiter(delimiter);
	checkRequiredKeywords("4.0", text);
	checkNoCustomKeywordsStartWith$("4.0", text);
	
	const delim = text[0];
	const keyvals = textToMap(delim, text);

	checkDuplicateKeywords(keyvals, text);
	checkUnescapedDelimiters("4.0", keyvals, text);

	await checkDataCoords(file, keyvals);

	checkInteger("$BEGINANALYSIS", keyvals);
	checkInteger("$BEGINDATA", keyvals);
	checkInteger("$BEGINSTEXT", keyvals);
	checkBETIM("4.0", "$BTIM", keyvals);
	checkInteger("$BEGINSTEXT", keyvals);
	checkBYTEORD("4.0", keyvals);
	// no check: $COM
	// no check: $CYT
	// no check: $CYTSN
	checkDATATYPE("4.0", keyvals);
	checkDATE(keyvals);
	checkInteger("$ENDANALYSIS", keyvals);
	checkInteger("$ENDDATA", keyvals);
	checkInteger("$ENDSTEXT", keyvals);
	checkBETIM("4.0", "$ETIM", keyvals);
	// no check: $EXP
	// no check: $FIL
	// no check: $GATING
	// no check: $INST
	// no check: $LAST_MODIFIED -- TODO dd-mmm-yyyy hh:mm:ss[.cc]
	// no check: $LAST_MODIFIER
	checkInteger("$LOST", keyvals);
	checkMODE("4.0", keyvals);
	checkInteger("$NEXTDATA", keyvals);
	// no check: $OP
	// no check: $ORIGINALITY -- TODO enum Original, Appended, NoNDataModified, DataModified
	checkInteger("$PAR", keyvals); // we've already assumed this is...
	// no check: $PLATEID
	// no check: $PLATENAME
	// checked in checkDATATYPE3_1: $PnB
	// no check: $PnCALIBRATION -- TODO f,string where f is floating point
	checkPnD(keyvals);
	// checked in checkDATATYPE3_1: $PnE
	// no check: $PnF
	checkPnG(keyvals);
	// no check: $PnL
	checkPnN("4.0", keyvals, text)
	// no check: $PnO
	// no check: $PnP
	// no check: $PnR -- TODO
	// no check: $PnS
	// no check: $PnT
	// no check: $PnV
	// no check: $PnRFMIN, $PnRFMAX
	// no check: $PnTYPE
	// no check: $PROJ
	// no check: $RnI, RnW
	// no check: $SMNO
	check$SPILLOVER(keyvals);
	// no check: $SRC
	// no check: $SYS
	// no check: $TIMESTEP -- TODO
	checkInteger("$TOT", keyvals);
	// no check: $TR -- TODO
	// checkNumeric("$VOL", keyvals);
	// no check: $WELLID
}

// TODO separate file reading from validation so that this can be used in node.js
/*if (typeof module !== "undefined" && module.exports) {
	module.exports = validate;
} else {
	window.validate = validate;
}*/
