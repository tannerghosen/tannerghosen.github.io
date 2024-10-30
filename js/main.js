// Variables
if (!localStorage.getItem("mode"))
{
	localStorage.setItem("mode", "dark");
}
var project = 1;
var maxprojects = 0;

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
		let navbar = document.getElementById("links");
		navbar.innerHTML = ""
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
		if (e.target.tagName == "A")
		{
			if (e.target.href.includes("http") == false)
			{
				e.preventDefault(); // this is so we don't reload the page on clicking a non http/s link.
			}
		}
	});

	// Typewriter (for the neat header effect)
	let header = document.getElementById("header");
	function TypeWriter(Text, ThePage, I = 0)
	{
		let i = I; // iterator
		let text = Text; // text to output
		let speed = 100; // speed of the typewriter in ms
		let thepage = ThePage; // the page
		if (i < text.length && thepage == localStorage.getItem("lastpage")) // if i < text.length and thepage matches the current page or if thepage is null (first time visiting)
		{
			header.innerHTML += text.charAt(i); // add the letter at i
			i++; // increase iterator
			setTimeout(() => { TypeWriter(text, thepage, i) }, speed); // recursively call the function after speed ms
		}
	}

	// uncomment this for every time a user visits the site
	// this is so we don't get <empty string> from trying to use innerHTML too early
	/*setTimeout(() =>
	{
		thepage = localStorage.getItem("lastpage"); // we grab the lastpage so if the page changes we stop the typewriter
		text = header.innerHTML; // set text to header's innerHTML
		header.style.visibility = "visible"; // make header visible
		header.innerHTML = ""; // clear its innerHTML
		TypeWriter(text, thepage, 0); // call typewriter
	}, 500);*/

	// Router (part 1)
	if(localStorage.getItem("lastpage")) // if we visited the site before, load the last page.
	{
		header.style.visibility = "visible"; // unhide header
		LoadPage(localStorage.getItem("lastpage"), true);
	}
	else // first time we were here, load home and play a funny typewriter animation.
	{
		LoadPage("home", true);
		// this is so we don't get <empty string> from trying to use innerHTML too early
		setTimeout(() =>
		{
			thepage = localStorage.getItem("lastpage"); // we grab the lastpage so if the page changes we stop the typewriter
			text = header.innerHTML; // set text to header's innerHTML
			header.style.visibility = "visible"; // make header visible
			header.innerHTML = ""; // clear its innerHTML
			TypeWriter(text, thepage); // call typewriter
		}, 500);
	}
});

// Router (part 2)
const pages = "./pages"; // directory of our pages.

				 //file // is it called on page load (added so we don't have missing pages on refreshes because page == lastpage)
function LoadPage(page, isitonpageload) // Load page function, to load the pages into our app
{
	const app = document.getElementById("app");
	// if page is different from lastpage OR if this is being called on page loading
	if (page != localStorage.getItem("lastpage") || isitonpageload == true)
	{
		let header = document.getElementById("header"); // header is index.html's header

		fetch(`${pages}/${page}.json`, { method: 'HEAD' }) // check to see if the file exists first
			.then(response =>
			{
				if (response.ok) // if it does
				{
					return fetch(`${pages}/${page}.json`); // fetch the page requested from /pages/
				}
				else // if it doesn't
				{
					// load the error page
					LoadPage("error"); // we can probably handle this better, but this works for now.
					console.error("LoadPage had an error getting the page '" + page + "'. Maybe it's wrong or missing?");
				}
			})
			.then(response => response.text())
			.then(data =>
			{
				data = JSON.parse(data); // we parse our JSON string into an object we can access
				app.innerHTML = data.content; // the div id 'app' will contain our content property from the loaded page JSON.
				let pagename = data.page; // loaded pages have a page property that is the name of the page
				header.innerHTML = pagename; // we set our header to the pagename...
				document.title = pagename;  // as well as the document.title
				localStorage.setItem("lastpage", page); // and we set the page here in case we reload or come back later.
				if (page === "portfolio" && maxprojects != data.projects) // if the page is portfolio and maxprojects doesn't equal the property data.projects
				{
					maxprojects = data.projects; // we set it to it
				}
			})
			.catch(() =>
			{
				// I can only imagine this would happen if the user loses their internet connection, the website isn't reachable, or if CORS is enforced and this is locally without a server.
				header.innerHTML = "Uh oh!";
				app.innerHTML = "<p>An error occured while loading a page. Either your internet connection is down, or the website's down. To verify, please refresh the page and check your internet connection to see if it's still connected.</p>";
				console.error("LoadPage had an error getting the page '" + page + "'. Maybe it's an internet issue or an issue reaching the website?");
			})
	}

// Show/Hide Buttons
	if (page == "portfolio") // if the page is Portfolio, make buttons visible.
	{
		project = 1; // This fixes a bug where it would try to continue from whatever number it was originally on
		// on page switch (if the site wasn't reloaded)
		document.getElementById("buttoncontainer").removeAttribute("hidden");
	}
	else
	{
		document.getElementById("buttoncontainer").setAttribute("hidden", "");
	}
}

// Navbar
function NavbarToggle()
{
	let l = document.getElementById("links");
	l.style.display = l.style.display === "block" ? "none" : "block";
}