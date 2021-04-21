var repoNameEl = document.querySelector("#repo-name");
var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");

var getRepoName = function() {
    // get repo name from url query string
    var queryString = document.location.search;
    var repoName = queryString.split("=")[1];
    // check for valid values before passing into function calls
    if (repoName) {
        // display repo name on page
        repoNameEl.textContent = repoName;
        // list issues
        getRepoIssues(repoName);
    } else {
        // invalid values redirect to homepage
        document.location.replace("./index.html");
    }
}

var getRepoIssues = function(repo) {
    // user's url
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    // request url info
    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
            response.json().then(function(data) {
                displayIssues(data);
                // check if api has paginated issues
                if (response.headers.get("Link")) {
                    displayWarning(repo);
                }
            });
        } else {
            // if unsuccessful, redirect to homepage
            document.location.replace("./index.html");
        }
    });
};

var displayIssues = function(issues) {
    // repo has no open issues
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }
    // loop through open issues
    for (var i = 0; i < issues.length; i++) {
        // create a link element to take users to the issue on github
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        // new link has attribute html_url from json array
        issueEl.setAttribute("href", issues[i].html_url);
        // opens link in new tab
        issueEl.setAttribute("target", "_blank");
        // create span to hold issue title
        var titleEl = document.createElement("span");
        // set text content of span element to current issue title
        titleEl.textContent = issues[i].title;
        // append span element to link
        issueEl.appendChild(titleEl);
        // create a type element
        var typeEl = document.createElement("span");
        // check if issue or pull request and label as such
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull request)";
        } else {
            typeEl.textContent = "(Issue)";
        }
        // apply type element to link
        issueEl.appendChild(typeEl);
        // append link to container
        issueContainerEl.appendChild(issueEl);
    }
};

var displayWarning = function(repo) {
    // add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit ";
    // link to full list of open issues on github
    var linkEl = document.createElement("a");
    linkEl.textContent = "GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    // open in new tab
    linkEl.setAttribute("target", "_blank");
    // append to warning container
    limitWarningEl.appendChild(linkEl);
};

getRepoName();