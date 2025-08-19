// Variables
if (!localStorage.getItem("mode"))
{
	localStorage.setItem("mode", "dark");
}
var project = 1;
var maxprojects = 0;
if (!localStorage.getItem("linkbar"))
{
	localStorage.setItem("linkbar", "closed");
}

var pagestack = []; // this is used to keep track of pages visited
var pushstack = true; // this is used to determine if we should push the page into the above stack
// Functions
document.addEventListener("DOMContentLoaded", () =>
{
	// Mobile Check
	if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
	{
		console.log('mobile');
		let link = document.createElement("link");
		link.href = "./css/mobile.css";
		link.rel = "stylesheet";
		document.head.appendChild(link);
	}
	else
	{
		console.log('not mobile')
	}

	// Light/Dark Mode Function
	function LightSwitch()
	{
		// toggles lightmode from all tags in document.body (everything)
		document.body.classList.toggle("lightmode");
	}

	if (localStorage.getItem("mode") === "light") // if the last time we were on the page it was light mode (not default), turn on light mode.
	{
		LightSwitch();
		document.body.classList.add("notransition"); //  without this, you'll see the dark mode briefly as it'll do a transition effect to switch to light mode on the code being ran.
		setTimeout(() =>
		{
			document.body.classList.remove("notransition"); // we don't want it forever because that'll mess up future transitions.
		}, 500);
	}
	

	document.getElementById("lightswitch").addEventListener("click", () =>
	{
		localStorage.setItem("mode", localStorage.getItem("mode") == "dark" ? "light" : "dark");
		LightSwitch();
	});

	// Navbar-related stuff, if it was last open before refresh we remember this
	if(localStorage.getItem("linkbar") === "open")
	{
		NavbarToggle();
	}

	// Time Function
	function TheTime()
	{
		// time.getMonth()+1 if you use x/x/xxxx for day format
		let time = new Date();
		let months = ["Janurary", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		let [month, day, year, hour, minute, second, period, weekday] = [months[time.getMonth()], time.getDate(), time.getFullYear(), time.getHours(), time.getMinutes(), time.getSeconds(), "AM", days[time.getDay()]];

		// it will only show the minute/second without a 0 in front of it (should it be less than 10) without these two ifs
		if (minute < 10)
		{
			minute = "0" + minute;
		}

		if (second < 10)
		{
			second = "0" + second;
		}

		if (hour >= 12)
		{
			period = "PM";
		}
		else if (hour <= 11)
		{
			period = "AM";
		}

		// time uses the 24 hour clock, we want a 12 hour clock, so remove 12 hours if it's greater than that.
		if (hour > 12)
		{
			hour -= 12;
		}

		// we don't want midnight showing up as 0.
		if (hour == 0)
		{
			hour = 12;
		}

		if (document.getElementById("time"))
		{
			document.getElementById("time").innerHTML = `Today is ${weekday}, ${month} ${day}, ${year} and the time is ${hour}:${minute}:${second} ${period}.`;
		}
	}

	TheTime();
	let timer = setInterval(() => TheTime(), 1000);

	// Slideshow
	// Back Button
	document.getElementById("backbutton").addEventListener("click", () =>
	{
		if (project == 1) // if we are at the first project, go to the last project.
		{
			project = maxprojects;
			document.getElementById("project1").setAttribute("hidden", "");
			document.getElementById("project" + project).removeAttribute("hidden");
		}
		else
		{
			project--;
			document.getElementById("project" + (project + 1)).setAttribute("hidden", "");
			document.getElementById("project" + project).removeAttribute("hidden");
		}
	});
	// Next Button
	document.getElementById("nextbutton").addEventListener("click", () =>
	{
		if (project == maxprojects) // if we are at the last project, go to the first project.
		{
			project = 1;
			document.getElementById("project" + maxprojects).setAttribute("hidden", "");
			document.getElementById("project" + project).removeAttribute("hidden");
		}
		else
		{
			project++;
			document.getElementById("project" + (project - 1)).setAttribute("hidden", "");
			document.getElementById("project" + project).removeAttribute("hidden");
		}
	});

	// Links
	document.body.addEventListener("click", (e) =>
	{
		if (e.target.tagName == "A" && e.target.href.includes("http") == false) // if anchor tag
		{
			e.preventDefault(); // this is so we don't reload the page on clicking a non http/s link.
		}
	});

	// Router (part 1)
	if(localStorage.getItem("lastpage")) // if we visited the site before, load the last page.
	{
		LoadPage(localStorage.getItem("lastpage"), true);
		document.getElementsByClassName('container')[0].style.visibility = "visible";
	}
	else // first time, load home
	{
		LoadPage("home", true);
		thepage = localStorage.getItem("lastpage");
		document.getElementsByClassName('header')[0].style.animation = "fadein 1s forwards";
		setTimeout(() => { document.getElementsByClassName('container')[0].style.visibility = "visible"; }, 3000);
		document.getElementsByClassName('container')[0].style.animation = "fadein 1s forwards";
		document.getElementsByClassName('container')[0].style.animationDelay = "2s";
	}
});

// Router (part 2)
const pages = "./pages"; // directory of our pages.

				 //file // is it called on page load (added so we don't have missing pages on refreshes because page == lastpage)
function LoadPage(page, isitonpageload, isfrompopstate) // Load page function, to load the pages into our app
{
	if(pushstack && !isfrompopstate) // if it should push state and if this is not from a popstate event
	{
		//console.log("Adding new page to stack: " + page);
		pagestack.push(page);
		window.history.pushState({ page: page }, '', '');
	}
	pushstack = true; // reset it to true so future page loads will push into the stack
	//console.log("Stack: " + pagestack);
	const app = document.getElementById("app");
	// if page is different from lastpage OR if this is being called on page loading
	if (page != localStorage.getItem("lastpage") || isitonpageload == true)
	{
		let header = document.getElementById("header"); // header is index.html's header

		fetch(`${pages}/${page}.html`, { method: 'HEAD' }) 
			.then(response =>
			{
				if (response.ok) // if response is ok
				{
					return fetch(`${pages}/${page}.html`); // fetch the page requested from /pages/
				}
				else // if not okay
				{
					// load the error page
					LoadPage("error"); // we can probably handle this better, but this works for now.
					console.error("LoadPage had an error getting the page '" + page + "'. Maybe it's wrong or missing?");
				}
			})
			.then(response => response.text()) // get response as text
			.then(data =>
			{
				const parser = new DOMParser(); // we use a DOMParser to parse the HTML string into a document
				const doc = parser.parseFromString(data, 'text/html');
				app.innerHTML = doc.getElementById("Content").innerHTML; // get the content from the parsed doc
				let pagename = doc.getElementById("Title").innerHTML; // we get the title from the parsed doc
				header.innerHTML = pagename; // we set our header to the pagename...
				document.title = pagename;  // as well as the document.title
				if(page == "portfolio")
				{
					let totalprojects = doc.getElementById("TotalProjects").innerHTML; // get the total projects from the parsed doc
					maxprojects = maxprojects != totalprojects ? totalprojects : maxprojects; // set maxprojects to the amount of projects in the JSON file.
				}
				localStorage.setItem("lastpage", page); // and we set the page here in case we reload or come back later
			})
			.catch((e) =>
			{
				// I can only imagine this would happen if the user loses their internet connection, the website isn't reachable, or if CORS is enforced and this is locally without a server.
				header.innerHTML = "Uh oh!";
				app.innerHTML = "<p>An error occured while loading a page.</p><br><p>ERROR: "+e.message+"</p>";
				console.error("Caught error in LoadPage: " + e.message);

			})
	}

// Show/Hide Buttons
	if (page == "portfolio") // if the page is Portfolio, make buttons visible.
	{
		project = 1; // This fixes a bug where it would try to continue from whatever number it was originally on
		// on page switch (if the site wasn't reloaded)
		document.getElementById("buttoncontainer").removeAttribute("hidden");
		document.getElementById("app").style = "height: 50vh;";
	}
	else
	{
		document.getElementById("buttoncontainer").setAttribute("hidden", "");
		document.getElementById("app").style = "height: 20vh;";
	}
}

// Navbar
function NavbarToggle()
{
	let l = document.getElementById("links");
	l.style.display = l.style.display === "block" ? "none" : "block";
	localStorage.setItem("linkbar", l.style.display  == "block" ? "open" : "closed"); // if set to block it was open, otherwise it's closed
}

window.addEventListener('popstate', (event) => 
{
	pushstack = false; // we don't push for backward navigation
    if (pagestack.length > 1) 
	{
		//console.log("Popping page from stack: " + pagestack[pagestack.length - 1]);
		pagestack.pop();
		const newpage = pagestack[pagestack.length - 1]; 
        LoadPage(newpage, false, true);
		localStorage.setItem("lastpage", newpage);
    }
});