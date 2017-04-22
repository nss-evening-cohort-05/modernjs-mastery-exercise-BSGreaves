$(function() {

	const filepaths = ["./db/teams.json", "./db/genders.json", "./db/characters.json"];

	const DOMOutputDiv = $("#output");

	const loadJSON = (filepath) => {
		return new Promise((resolve, reject) => {
			$.ajax(filepath)
			.done(data => resolve(data))
			.fail(error => reject(error));
		});
	};

	const loadData = (selectedTeam) => {
		Promise.all([loadJSON(filepaths[0]), loadJSON(filepaths[1]), loadJSON(filepaths[2])])
		.then((data) => {
			displayData(data, selectedTeam);
		}).catch((error) => {
			console.log(error);
		});
	};

	const displayData = (dataArray, selectedTeam) => {
		const teams = dataArray[0].teams;
		const genders = dataArray[1].genders;
		const characters = dataArray[2].characters;
		characters.forEach(function(currChar){ // gets data onto the character objects so I have it in one place
			genders.forEach(function(currGender) {
				if (currChar.gender_id === currGender.id) {
					currChar.gender = currGender.type;
				}
			});
			if (currChar.gender === "Male" && currChar.description === "") {
				currChar.description = "1234567890";
			}
			if (currChar.gender === "Female" && currChar.description === "") {
				currChar.description = "abcde fghij klmno pqrst uvwxy z";
			}
		});
		charCards = [];
		teams.forEach(function(currTeam){ // This nest builds an array of jquery panels
			if (selectedTeam === currTeam.name) {
				characters.forEach(function(currChar){
					if (currChar.team_id === currTeam.id) {
					charCards.push(buildPanel(currChar));
					}
				});
			}
		});
		let rowArray = []; // What follows is complicated but I ended up down a rabbit hole
		let howManyRows = (Math.ceil(charCards.length / 4)); 
		// let rowArray = Array((Math.ceil(charCards.length / 4))).fill($("<div>", {class: "row"}));
		// Initially I used the above line, but guess what? Every jquery object was a CLONE that references the parent. So I was creating multiple instances of the same row in the DOM
		for (let i = 0; i < howManyRows; i++) { // This was the workaround
			rowArray.push($("<div>", {class: "row"}));
		}
		charCards.forEach(function(card, cardIndex){ 
			let targetRow = (Math.floor(cardIndex / 4));
			card.appendTo(rowArray[targetRow]);
		});
		let $outputDiv = $("<div>");
		rowArray.forEach(function(row){
			row.appendTo($outputDiv);
		});
		DOMOutputDiv.html($outputDiv); // lesson? Sometimes, just use an output string
	};

	const buildPanel = (currChar) => { //Builds an individual card
		let $charPanel = $("<div>", {class: "panel panel-default col-md-3 col-sm-3"});
		let $panelHeadingCont = $("<div>", {class: "panel-heading"});
		let $panelHeading = $("<h4>", {class: "panel-titles text-center", text: currChar.name});
		let $imageCont = $("<div>", {class: "text-center"});
		let $charImage = $("<img>", {class: "img img-fluid img-circle char-image", src: currChar.image});
		let $charDescription = $("<div>", {class: "panel-body", text: currChar.description});
		if (currChar.gender === "Female") {
			$charImage.addClass("female");
		}
		if (currChar.gender === "Male") {
			$charImage.addClass("male");
		}
		$panelHeadingCont.append($panelHeading);
		$imageCont.append($charImage);
		$charPanel.append($panelHeadingCont).append($imageCont).append($charDescription);
		return $charPanel;
	};

	$("#xmen-button, #avengers-button, #guardians-button").click((event) => {
    loadData($(event.currentTarget).val());
  	});

});