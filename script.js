const LANGUAGE = "en";
const parentElement = document.querySelector("#transcript");

function showTranscription() {
	const videoId = ReadVideoIdFromInput();
	const language = document.querySelector("#langSelect select").value;

	const transcriptionLink = `https://video.google.com/timedtext?lang=${language}&v=${videoId}`;
	parentElement.innerHTML = "";

	if (language == "None") {
		return;
	}

	fetch(transcriptionLink)
		.then(response => response.text())
		.then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
		.then(data => {
			const transcript = data.querySelector("transcript");
			PrintTranscript(transcript);
		});
}

function showLanguageList() {
	const videoId = ReadVideoIdFromInput();
	const targetURL = `https://video.google.com/timedtext?type=list&v=${videoId}`;

	fetch(targetURL)
		.then(response => response.text())
		.then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
		.then(data => {
			const transcriptList = data.querySelector("transcript_list");
			const tracks = Array.from(transcriptList.querySelectorAll("track"));

			if (tracks.length == 0) {
				parentElement.innerHTML = "No Transcript Found!";
			}

			const lang_codes = tracks.map(track => track.attributes.lang_code.value);

			const selectElement = document.querySelector("#langSelect select");
			selectElement.parentElement.style.display = "flex";

			const noneOption = document.createElement("option");
			noneOption.innerHTML = "None";
			selectElement.appendChild(noneOption);

			for (const code of lang_codes) {
				const option = document.createElement("option");
				option.innerHTML = code;
				selectElement.appendChild(option);
			}
		});
}

// Seconds to HH:MM:SS
function FormatSeconds(secondsToFormat) {
	let hours = parseInt(secondsToFormat / 3600);
	let minutes = parseInt(secondsToFormat / 60);
	let seconds = parseInt(secondsToFormat % 60);
	if (hours <= 9) {hours = "0" + hours}
	if (minutes <= 9) {minutes = "0" + minutes}
	if (seconds <= 9) {seconds = "0" + seconds}
	return `${hours}:${minutes}:${seconds}`;
}

// Read the DOM and convert the input to Video ID
function ReadVideoIdFromInput() {
	const input = document.querySelector("#videoIdInput").value;
	const splittedInput = input.split("=");

	if (splittedInput.length == 1) {
		return splittedInput[0];
	} else {
		return splittedInput[splittedInput.length - 1];
	}
}

// Takes XML <transcript> tag and prints it.
function PrintTranscript(transcript) {
	const texts = transcript.querySelectorAll("text");

	for (let i = 0; i < texts.length; i++) {
		// Create Elements To Print
		const container = document.createElement("p");
		const startTimeElement = document.createElement("span");
		const textElement = document.createElement("span");

		// Fill The Elements
		const startTimeInSeconds = parseInt(texts[i].getAttribute("start"));
		startTimeElement.innerHTML = FormatSeconds(startTimeInSeconds) + " - ";
		textElement.innerHTML = texts[i].innerHTML;

		// Styling
		startTimeElement.className = "startTime";
		textElement.className = "speechText";

		// Print The Elements
		container.appendChild(startTimeElement);
		container.appendChild(textElement);
		parentElement.appendChild(container);
	}
}
