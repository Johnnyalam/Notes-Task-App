$(document).ready(function () {
    let notes = JSON.parse(localStorage.getItem("notes")) || []; //notes=saved notes OR empty list
    let editIndex = null; // the note we are editing, if null then we are adding a note, number then we are editing

    renderNotes(); //to show notes on the screen

    $("#addNote").click(function () { //when the user clicks "Add Task"
        let text = $("#noteInput").val().trim(); // to take what the user typed, trim() to remove extra unnecesary spaces

        if (text === "") { 
            alert("Please write something!"); //check if the input is empty
            return;
        }

        if (editIndex !== null) {
            notes[editIndex].text = text;
            editIndex = null;
            $("#addNote").text("Add Task"); //after editing an existing note the button text changes back to "Add Text"
        } else {
            notes.push({ text: text, done: false }); //puhes it into array
        }

        saveNotes(); //save notes to LocalStorage
        renderNotes(); //display the tasks on the screen
        $("#noteInput").val(""); //clear input box
    });

    $("#noteInput").on("keydown", function (e) {
        if (e.key === "Enter") {   
            e.preventDefault();    
            $("#addNote").click(); 
        }
    }); // to add or edit a task by pressing enter

    function renderNotes(filter = "") { // filter=search text
        $("#notesList").empty();
        notes.forEach((note, index) => { //loop: for each note in the array
            if (!note.text.toLowerCase().includes(filter.toLowerCase())) return; //Search logic, if note doesn't match -> skip it

            $("#notesList").append(` 
            <li class="list-group-item d-flex justify-content-between align-items-center">
            <span class="${note.done ? "done" : ""}" data-index="${index}" class="taskText">${note.text}</span>
            <div>
            <button class="btn btn-sm btn-success doneBtn" data-index="${index}">✔</button>
            <button class="btn btn-sm btn-warning editBtn" data-index="${index}">Edit</button>
            <button class="btn btn-sm btn-danger deleteBtn" data-index="${index}">X</button>
            </div>
            </li>`);
        }); //to create HTML dynamically
    }

    function saveNotes() {
        localStorage.setItem("notes", JSON.stringify(notes)); //convert array into text and save it in browser
    }

    $(document).on("click", ".deleteBtn", function () {
        let index = $(this).data("index");
        notes.splice(index, 1); //to delete a note
        saveNotes();
        renderNotes($("#searchInput").val());
    });

    $(document).on("click", ".editBtn", function () { 
        let index = $(this).data("index");
        editIndex = index; // to edit a note
        $("#noteInput").val(notes[index].text);
        editIndex = index;
        $("#addNote").text("Update Task");
    });

    $(document).on("click", ".doneBtn", function () {
        let index = $(this).data("index");
        notes[index].done = !notes[index].done; //toggle state
        saveNotes();
        renderNotes($("#searchInput").val());
    });
    $("#searchInput").on("input", function () {
        renderNotes($(this).val());
    }); //this means every time user types, filter notes
});