// targets form element
var userFormEl = document.querySelector("#user-form");
// targets user submission
var nameInputEl = document.querySelector("#username");
// container for repo list
var repoContainerEl = document.querySelector("#repos-container");
// username submission data is being displayed for
var repoSearchTerm = document.querySelector("#repo-search-term");

var formSubmitHandler = function(event) {
    event.preventDefault();
    // get value from input element via nameInputEl and store in username variable
    var username = nameInputEl.value.trim();
    // check if there is a value in the username variable
    if (username) {
        // pass data to getUserRepos() as an argument
        getUserRepos(username);
        // clear the form after submission
        nameInputEl.value = "";
    } else {
        // prompts user to submit a username if field is blank
        alert("Please enter a GitHub username");
    }
};

var getUserRepos = function(user) {
    // format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    // make a request to the url
    fetch(apiUrl).then(function(response) {
        // if username exists
        if (response.ok) {
            // response data converts to JSON
            response.json().then(function(data) {
                // sends data to displayRepos() function
                displayRepos(data, user);
            });
        // if username does not exist
        } else {
            // alert 404 error
            alert("Error: There was an issue processing your request");
        }
    })
    // alert user about github connection error
    .catch(function(error) {
        alert("Unable to connect to GitHub");
    })
};

// accepts array of repository data and search term as parameters
var displayRepos = function(repos, searchTerm) {
    // if user has no repos, let the user know
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }
    // clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    // take each repository and write its data to the page
    for (var i = 0; i < repos.length; i++) {
        // format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;
        // create a container for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);
        // create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;
        // append to container
        repoEl.appendChild(titleEl);
        // create a status element and give it a class name
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center"
        //check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            // if there are issues, display number of issues and red X icon
            statusEl.innerHTML =
            "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            // if no issues, display blue checkmark
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }
        // append to container
        repoEl.appendChild(statusEl);
        //append container to the dom
        repoContainerEl.appendChild(repoEl);
    }
};

// listens for submit event on form and calls formSubmitHandler function
userFormEl.addEventListener("submit", formSubmitHandler);