const LANGUAGE = "en";
const parentElement = document.querySelector("#transcript");

function showTranscription() {
	const videoId = document.querySelector("#videoIdInput").value;
	const transcriptionLink = `https://video.google.com/timedtext?lang=en&v=${videoId}`;
	parentElement.innerHTML = "";

	fetch(transcriptionLink)
		.then(response => response.text())
		.then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
		.then(data => {
			const transcript = data.querySelector("transcript");
			
			if (!transcript) {
				console.log("Error! Probably Language is Not Supported...");
				return;
			}

			const texts = transcript.querySelectorAll("text");

			for (let i=0; i<texts.length; i++) {
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
		});
}

// Seconds to HH:MM:SS
function FormatSeconds(secondsToFormat) {
	let hours = parseInt(secondsToFormat / 3600);
	let minutes = parseInt(secondsToFormat / 60);
	let seconds = parseInt(secondsToFormat % 60);
	if (hours   <= 9) { hours   = "0" + hours   }
	if (minutes <= 9) { minutes = "0" + minutes }
	if (seconds <= 9) { seconds = "0" + seconds }
	return `${hours}:${minutes}:${seconds}`;
}
